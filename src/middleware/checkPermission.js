import jwt from 'jsonwebtoken';
import admin from 'firebase-admin';
const db = admin.firestore();

export const checkPermission = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (token == null) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET)

        const userRef = db.collection('users').doc(decode.id);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = userDoc.data();

        if (user.role !== 1) {
            return res.status(403).json({ error: 'Forbidden - Admins only' });
        }

        req.user = user;

        next();

    } catch (error) {
        return res.status(403).json({ error: 'Invalid token' });
    }
};