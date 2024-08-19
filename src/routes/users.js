const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const bcrypt = require('bcrypt');
const { sendVerificationEmail } = require('../utils/email');
const jwt = require('jsonwebtoken');
const cors = require('cors');

admin.initializeApp();
const db = admin.firestore();

// Cấu hình CORS cho phép OPTIONS
router.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// POST register
router.post('/register', async (req, res) => {
  try {
    const { email, password, username } = req.body;

    // Kiểm tra xem tất cả các trường có giá trị không
    if (!email || !password || !username) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Kiểm tra xem email đã tồn tại chưa
    const userRef = db.collection('users').doc(email);
    const doc = await userRef.get();
    if (doc.exists) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo mã xác thực
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Tạo user mới
    await userRef.set({
      email,
      password: hashedPassword,
      username,
      verificationCode,
      isVerified: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Gửi email xác thực
    await sendVerificationEmail(email, verificationCode);

    res.status(201).json({ message: 'User created successfully. Please check your email for verification.' });

  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ error: 'Error registering user' });
  }
});

// POST verify
router.post('/verify', async (req, res) => {
  try {
    const { email, code } = req.body;

    const userRef = db.collection('users').doc(email);
    const doc = await userRef.get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = doc.data();
    if (user.verificationCode === code) {
      await userRef.update({
        isVerified: true,
        verifiedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      res.json({ message: 'Email verified successfully!' });
    } else {
      res.status(400).json({ error: 'Invalid verification code' });
    }

  } catch (err) {
    console.error('Error verifying email:', err);
    res.status(500).json({ error: 'Error verifying email' });
  }
});

// POST login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const userRef = db.collection('users').doc(email);
    const doc = await userRef.get();
    if (!doc.exists) {
      console.log('User does not exist');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = doc.data();

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password does not match');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Kiểm tra email đã được xác thực chưa
    if (!user.isVerified) {
      console.log('Email not verified');
      return res.status(401).json({ error: 'Please verify your email address' });
    }

    // Tạo JWT
    const token = jwt.sign({ userId: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });

  } catch (err) {
    console.error('Error logging in:', err);
    res.status(500).json({ error: 'Error logging in' });
  }
});


// GET all users
router.get('/', authenticateToken, async (req, res) => {
  try {
    const usersSnapshot = await db.collection('users').get();
    const users = usersSnapshot.docs.map(doc => doc.data());
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching users' });
  }
});

// GET a specific user
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const userRef = db.collection('users').doc(req.params.id);
    const doc = await userRef.get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(doc.data());
  } catch (err) {
    res.status(500).json({ error: 'Error fetching user' });
  }
});

// PUT (update) a user
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const userRef = db.collection('users').doc(req.params.id);
    await userRef.update(req.body);
    res.json({ message: 'User updated successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Error updating user' });
  }
});

// PUT (update) favorites của user
router.put('/:id/favorites', authenticateToken, async (req, res) => {
  try {
    const { favorites } = req.body;
    const userRef = db.collection('users').doc(req.params.id);

    await userRef.update({
      favorites: favorites
    });

    res.json({ message: 'Favorites updated successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Error updating user favorites' });
  }
});

// DELETE a user
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const userRef = db.collection('users').doc(req.params.id);
    await userRef.delete();
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting user' });
  }
});

// Hàm xác thực JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }

    req.user = user;
    next();
  });
}

module.exports = router;
