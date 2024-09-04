import admin from 'firebase-admin';

const db = admin.firestore();

// Get all user
export const getAllUser = ({ }) => new Promise(async (resolve, reject) => {
    try {
        const usersSnapshot = await db.collection('users').get();
        const users = usersSnapshot.docs.map(doc => doc.data());
        resolve({
            err: 0,
            mes: 'Get all user successfully',
            user: users
        });
    } catch (error) {
        reject(error);
        return { status: 500, message: 'Error get all user', error };
    }
});

// GET a specific user
export const getSpecificUser = ({ id }) => new Promise(async (resolve, reject) => {
    try {
        const userRef = db.collection('users').doc(id);
        const doc = await userRef.get();
        if (!doc.exists) {
            return res.status(404).json({ error: 'User not found' });
        }
        resolve({
            err: 0,
            mes: 'Get specific user successfully',
            user: doc.data()
        });
    } catch (error) {
        reject(error);
        return { status: 500, message: 'Error get specific user', error };
    }
});