const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

const createUser = async (userData) => {
  try {
    const userRef = db.collection('users').doc(userData.email);
    await userRef.set({
      email: userData.email,
      password: userData.password,  
      username: userData.username,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      verificationCode: userData.verificationCode || '',
      isVerified: userData.isVerified || false,
      verifiedAt: userData.verifiedAt || null
    });
    return userRef;
  } catch (error) {
    console.error('Error creating user:', error);
  }
};

module.exports = createUser;
