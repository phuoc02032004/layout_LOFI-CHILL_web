import express from 'express';
import admin from 'firebase-admin';
import bcrypt from 'bcrypt';
import { sendVerificationEmail } from '../utils/email.js';
import jwt from 'jsonwebtoken';

admin.initializeApp();
const db = admin.firestore();

export const register = ({ username, email, password }) => new Promise(async (resolve, reject) => {

    try {
        const userRef = db.collection('users');
        const snapshot = await userRef.where('email', '==', email).get();

        // Kiểm tra xem email đã được sử dụng chưa
        if (!snapshot.empty) {
            return reject({ status: 400, message: 'Email already in use' });
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tạo mã xác thực
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Tạo user mới
        await userRef.add({
            email,
            password: hashedPassword,
            username,
            verificationCode,
            isVerified: false,
            isVip: false,
            vipExpiration: null,
            vipExpiredAt: null,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        // Gửi email xác thực
        await sendVerificationEmail(email, verificationCode);

        resolve({
            err: 0,
            mes: 'User created successfully. Please check your email for verification.'
        });
    } catch (error) {
        reject(error);
        return { status: 500, message: 'Error registering user', error };
    }
});

export const verify = ({ email, code }) => new Promise(async (resolve, reject) => {
    try {
        const userRef = db.collection('users');
        const querySnapshot = await userRef.where('email', '==', email).get();

        // Kiểm tra nếu không có tài liệu nào khớp với email
        if (querySnapshot.empty) {
            return reject({ status: 404, message: 'User not found' }); // Đổi thành 404
        }

        // Lấy tài liệu người dùng (lấy tài liệu đầu tiên trong kết quả)
        const userDoc = querySnapshot.docs[0];
        const user = userDoc.data();

        // Kiểm tra mã xác thực
        if (user.verificationCode === code) {
            await userDoc.ref.update({
                isVerified: true,
                verifiedAt: admin.firestore.FieldValue.serverTimestamp(),
            });
            return resolve({
                status: 200,
                message: 'Email verified successfully'
            });
        } else {
            return reject({ status: 400, message: 'Invalid verification code' });
        }
    } catch (error) {
        console.error('Error in verification process:', error); // Log lỗi chi tiết
        return reject({ status: 500, message: 'Error verifying email', error });
    }
});


export const login = ({ email, password }) => new Promise(async (resolve, reject) => {
    try {
        const userRef = db.collection('users');
        const querySnapshot = await userRef.where('email', '==', email).get();
        if (querySnapshot.empty) {
            console.log('User does not exist');
            return reject({ status: 400, error: 'Invalid credentials' }); // Trả về mã 400 cho lỗi đăng nhập
        }

        let user;
        querySnapshot.forEach(doc => {
            user = doc.data();
        });

        // Kiểm tra mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Password does not match');
            return reject({ status: 400, error: 'Invalid credentials' }); // Mật khẩu không khớp
        }

        // Kiểm tra email đã xác thực chưa
        if (!user.isVerified) {
            console.log('Email not verified');
            return reject({ status: 401, error: 'Please verify your email address' }); // 401: yêu cầu xác thực email
        }

        // Tạo JWT
        const token = jwt.sign({ userId: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        resolve({
            err: 0,
            mes: 'Log in successfully',
            token: token
        });
    } catch (error) {
        reject({ status: 500, message: 'Error logging in', error });
    }
});

