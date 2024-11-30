import admin from 'firebase-admin';
import bcrypt from 'bcrypt';
import { sendVerificationEmail } from '../utils/email.js';
import jwt from 'jsonwebtoken';
import { auth, db } from '../config/firebaseConfig.js';
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification } from "firebase/auth";
import { collection, query, where, getDocs, updateDoc, serverTimestamp, addDoc, setDoc, doc, getDoc } from "firebase/firestore";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { refreshToken } from 'firebase-admin/app';
admin.initializeApp();

function generateAccessToken(user) {
    const userPayload = { ...user }
    return jwt.sign(userPayload, process.env.JWT_SECRET, { expiresIn: '7d' })
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
        const userId = querySnapshot.docs[0].id;
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

        const userPayloadAccess = { id: userId, isVip: userData.isVip, role: userData.role };
        const userPayloadRefresh = { id: user.id };
        const accessToken = generateAccessToken(userPayloadAccess);
        const refreshToken = generateRefreshToken(userPayloadRefresh);

        await updateDoc(querySnapshot.docs[0].ref, {
            refreshToken: refreshToken,
            updatedAt: serverTimestamp()
        });

        resolve({
            err: 0,
            mes: 'Log in successfully',
            userId: userId,
            accessToken: accessToken,
            refreshToken: refreshToken,
        });

    } catch (error) {
        console.error("Error logging in:", error);
        return reject({ status: 500, message: 'Error logging in', error });
    }
});

// Xử lý refresh token để cấp mới accessToken
export const refreshAccessToken = (id, refreshToken) => new Promise(async (resolve, reject) => {
    try {
        if (!refreshToken) return reject({ status: 401, message: 'Refresh token is required' });

        const userRef = doc(db, 'users', id);
        const userDoc = await getDoc(userRef);

        // Kiểm tra nếu tài liệu không tồn tại
        if (!userDoc.exists) {
            return reject({ status: 404, message: 'User not found' });
        }

        const userData = userDoc.data();

        // Kiểm tra refreshToken
        if (userData.refreshToken !== refreshToken) {
            return reject({ status: 403, message: 'Invalid refresh token' });
        }

        // Xác minh refreshToken
        jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET, (err, decoded) => {
            if (err) {
                return reject({ status: 403, message: 'Invalid refresh token' });
            }

            // Tạo payload cho AccessToken
            const userPayload = {
                id: id,
                isVip: userData.isVip || false,
                role: userData.role || 'user',
            };
            const newAccessToken = generateAccessToken(userPayload);

            return resolve({ accessToken: newAccessToken });
        });
    } catch (error) {
        console.error("Error refreshing token:", error);
        reject({ status: 500, message: 'Error refreshing token', error });
    }
});

export const logOut = ({ id }) => new Promise(async (resolve, reject) => {
    try {
        const userRef = doc(db, 'users', id); // Correctly create the document reference
        const snapshot = await getDoc(userRef); // Use getDoc to fetch the document

        if (!snapshot.exists()) {
            return resolve({
                status: 404,
                message: 'User not found',
            });
        }

        await updateDoc(userRef, {
            refreshToken: null, // Update the refresh token to null
        });

        resolve({ status: 200, message: 'Logged out successfully' });
    } catch (error) {
        console.error('Error in Log Out service:', error);
        reject({ status: 500, message: 'Server error', error });
    }
});

// Reset password
export const resetPassword = async ({ id, password, passwordnew }) => {
    try {
        const userRef = doc(db, 'users', id);
        const userSnapshot = await getDoc(userRef);

        if (!userSnapshot.exists()) {
            throw { status: 404, message: 'User not found' };
        }

        const userData = userSnapshot.data();
        const isMatch = await bcrypt.compare(password, userData.password);

        if (!isMatch) {
            throw { status: 400, message: 'Mật khẩu hiện tại không đúng!' };
        }

        const hashedPassword = await bcrypt.hash(passwordnew, 10);

        await updateDoc(userRef, {
            password: hashedPassword,
            updatedAt: serverTimestamp(),
        });

        await admin.auth().updateUser(id, { password: passwordnew });

        return { err: 0, mes: 'Password has been reset successfully' };
    } catch (error) {
        console.error('Error resetting password:', error);
        throw error.status
            ? error
            : { status: 500, message: 'Internal Server Error' };
    }
};

export const forgetPassword = async ({ email }) => {
    try {
        const auth = getAuth();
        await sendPasswordResetEmail(auth, email);
        return { err: 0, mes: 'Password reset email sent successfully. Please check your inbox.' };
    } catch (error) {
        console.error('Error sending password reset email:', error);
        if (error.code === 'auth/user-not-found') {
            throw { status: 404, message: 'User with this email does not exist.' };
        }
        throw { status: 500, message: 'Internal Server Error' };
    }
};