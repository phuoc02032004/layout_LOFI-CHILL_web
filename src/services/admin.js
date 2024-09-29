import admin from 'firebase-admin';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const db = admin.firestore();

export const login = async ({ email, password }) => new Promise(async (resolve, reject) => {
    try {
        const adminRef = db.collection('Admin');
        const snapshot = await adminRef.where('email', '==', email).limit(1).get();

        // Kiểm tra xem email có tồn tại hay không
        if (snapshot.empty) {
            return reject({ status: 400, message: 'Email not found' });
        }

        // Lấy thông tin Admin
        const adminData = snapshot.docs[0].data();

        // So sánh mật khẩu với mật khẩu đã mã hóa
        const match = await bcrypt.compare(password, adminData.password);
        if (!match) {
            return reject({ status: 400, message: 'Incorrect password' });
        }

        // Tạo token JWT
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        resolve({
            err: 0,
            mes: 'Login successful',
            token,
        });
    } catch (error) {
        console.error('Error in login service:', error);
        reject({ status: 500, message: 'Internal Server Error', error });
    }
});
