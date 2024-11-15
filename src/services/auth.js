import admin from 'firebase-admin';
import bcrypt from 'bcrypt';
import { sendVerificationEmail } from '../utils/email.js';
import jwt from 'jsonwebtoken';
import { auth, db } from '../config/firebaseConfig.js';
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { collection, query, where, getDocs, updateDoc, serverTimestamp, addDoc, setDoc, doc } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";
admin.initializeApp();

function generateAccessToken(user, isVip, role) {
    const userPayload = { ...user, isVip, role }
    return jwt.sign(userPayload, process.env.JWT_SECRET, { expiresIn: '5m' })
}

function generateRefreshToken(user) {
    return jwt.sign(user, process.env.REFRESH_JWT_SECRET, { expiresIn: '7d' })
}

export const register = ({ username, email, password }) => new Promise(async (resolve, reject) => {
    try {
        const userRef = collection(db, 'users');
        const q = query(userRef, where("email", "==", email));
        const snapshot = await getDocs(q);

        // Kiểm tra xem email đã được sử dụng chưa
        if (!snapshot.empty) {
            return reject({ status: 400, message: 'Email already in use' });
        }

        // Tạo tài khoản người dùng bằng Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Lưu thông tin bổ sung vào Firestore
        await setDoc(doc(db, "users", user.uid), {
            email,
            password: hashedPassword,
            username,
            role: 0,
            isVerified: false,
            isVip: false,
            vipExpiration: null,
            vipExpiredAt: null,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });

        // Gửi email xác thực
        await sendEmailVerification(user);

        resolve({
            err: 0,
            mes: 'User created successfully. Please check your email for verification.'
        });
    } catch (error) {
        reject({ status: 500, message: 'Error registering user', error });
    }
});

export const login = ({ email, password }) => new Promise(async (resolve, reject) => {
    try {
        const userRef = collection(db, 'users');
        const q = query(userRef, where('email', '==', email));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return reject({ status: 400, error: 'Invalid credentials' });
        }

        let userData = querySnapshot.docs[0].data();
        const isMatch = await bcrypt.compare(password, userData.password);

        if (!isMatch) {
            return reject({ status: 400, error: 'Invalid credentials' });
        }

        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Kiểm tra trạng thái email đã xác thực chưa
        if (user.emailVerified && !userData.isVerified) {
            await updateDoc(querySnapshot.docs[0].ref, {
                isVerified: true,
                verifiedAt: serverTimestamp(),
            });
            userData.isVerified = true;
        }

        if (!userData.isVerified) {
            return reject({ status: 401, error: 'Please verify your email address' });
        }

        const userPayloadAccess = { email: userData.email, isVip: userData.isVip, role: userData.role };
        const userPayloadRefresh = { email: userData.email };
        const accessToken = generateAccessToken(userPayloadAccess);
        const refreshToken = generateRefreshToken(userPayloadRefresh);

        await updateDoc(querySnapshot.docs[0].ref, {
            refreshToken: refreshToken,
            updatedAt: serverTimestamp()
        });

        resolve({
            err: 0,
            mes: 'Log in successfully',
            accessToken: accessToken,
            refreshToken: refreshToken
        });

    } catch (error) {
        console.error("Error logging in:", error);
        return reject({ status: 500, message: 'Error logging in', error });
    }
});

// Xử lý refresh token để cấp mới accessToken
export const refreshAccessToken = (refreshToken) => new Promise(async (resolve, reject) => {
    try {
        if (!refreshToken) return reject({ status: 401, message: 'Refresh token is required' });

        // Kiểm tra refreshToken trong cơ sở dữ liệu
        const userRef = db.collection('users');
        const snapshot = await userRef.where('refreshToken', '==', refreshToken).get();

        if (snapshot.empty) {
            return reject({ status: 403, message: 'refresh token is empty' });
        }

        // Xác minh refreshToken
        jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET, (err, user) => {
            if (err) {
                return reject({ status: 403, message: 'Invalid refresh token' });
            }

            const userPayload = { email: user.email, isVip: user.isVip, role: user.role };
            const newAccessToken = generateAccessToken(userPayload);

            return resolve({ accessToken: newAccessToken });
        });
    } catch (error) {
        console.error("Error refreshing token:", error);
        reject({ status: 500, message: 'Error refreshing token', error });
    }
}).catch(error => error);
