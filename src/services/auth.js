import express from 'express';
import admin from 'firebase-admin';
import bcrypt from 'bcrypt';
import { sendVerificationEmail } from '../utils/email.js';
import jwt from 'jsonwebtoken';

admin.initializeApp();
const db = admin.firestore();

export const register = ({ email, password, username }) => new Promise(async (resolve, reject) => {

    try {
        // Kiểm tra xem email đã tồn tại chưa
        const userRef = db.collection('users').doc(email);
        const doc = await userRef.get();
        if (doc.exists) {
            return { error: 'Email already exists' };
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

        resolve({
            err: 0,
            mes: 'User created successfully. Please check your email for verification.'
        });
    } catch (error) {
        reject(error);
        return { status: 500, message: 'Error registering user', error };
    }
});

export const verify = ({ email, password, username }) => new Promise(async (resolve, reject) => {
    try {
        const userRef = db.collection('users').doc(email);
        const doc = await userRef.get();
        if (!doc.exists) {
            return { error: 'User not found' };
        }

        const user = doc.data();
        if (user.verificationCode === code) {
            await userRef.update({
                isVerified: true,
                verifiedAt: admin.firestore.FieldValue.serverTimestamp(),
            });
        }
        resolve({
            err: 0,
            mes: 'Email verified successfully'
        });
    } catch (error) {
        reject(error);
        return { status: 400, message: 'Invalid verification code', error };
    }
});

export const login = ({ email, password }) => new Promise(async (resolve, reject) => {
    try {
        const userRef = db.collection('users').doc(email);
        const doc = await userRef.get();
        if (!doc.exists) {
            console.log('User does not exist');
            return { error: 'Invalid credentials' };
        }

        const user = doc.data();

        // Kiểm tra mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Password does not match');
            return { error: 'Invalid credentials' };
        }

        // Kiểm tra email đã được xác thực chưa
        if (!user.isVerified) {
            console.log('Email not verified');
            return { error: 'Please verify your email address' };
        }

        // Tạo JWT
        const token = jwt.sign({ userId: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        resolve({
            err: 0,
            mes: 'Log in successfully',
            token: token
        });
    } catch (error) {
        reject(error);
        return { status: 500, message: 'Error logging in', error };
    }
});
