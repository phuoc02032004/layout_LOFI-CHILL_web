import admin from 'firebase-admin';
import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';
const storage = new Storage();

const db = admin.firestore();
const bucket = admin.storage().bucket(process.env.BUCKET);


// POST a new SoundEffect
export const createSoundEffect = ({ Title, Description, vip }, file) => new Promise(async (resolve, reject) => {
    try {

        // Kiểm tra xem soundEffect đã tồn tại chưa
        const soundEffectRef = db.collection('Sounds');
        const snapshot = await soundEffectRef.where('Title', '==', Title).get();

        if (!snapshot.empty) {
            return resolve({
                status: 404,
                mes: 'SoundEffect with this title already exists'
            });
        }

        const filename = `Sounds/${uuidv4()}_${file.originalname}`;

        const fileUpload = bucket.file(filename);
        await fileUpload.save(file.buffer);

        const [url] = await fileUpload.getSignedUrl({
            action: 'read',
            expires: '03-01-2500'
        });

        await soundEffectRef.add({
            Title,
            Description,
            vip: vip,
            url: url,
            filePath: filename,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        return resolve({
            err: 0,
            mes: 'Create soundEffect successfully',
        });
    } catch (error) {
        reject(error);
        return { status: 500, message: 'Error creating soundEffect', error };
    }
});

// Get all SoundEffect
export const getAllSoundEffect = ({ }) => new Promise(async (resolve, reject) => {
    try {
        const soundEffectsSnapshot = await db.collection('Sounds').get();
        const soundEffect = soundEffectsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
        return resolve({
            err: 0,
            mes: 'Get all soundEffect successfully',
            soundEffect: soundEffect
        });
    } catch (error) {
        reject(error);
        return { status: 500, message: 'Error get all soundEffect', error };
    }
});


// Get specific SoundEffect
export const getSpecificSoundEffect = ({ id }) => new Promise(async (resolve, reject) => {
    try {
        const soundEffectRef = db.collection('Sounds').doc(id);
        const soundEffectDoc = await soundEffectRef.get();
        if (!soundEffectDoc.exists) {
            return resolve({
                status: 404,
                message: 'SoundEffect not found',
            });
        }
        return resolve({
            err: 0,
            mes: 'Get specific soundEffect successfully',
            soundEffect: soundEffectDoc.data()
        });
    } catch (error) {
        reject(error);
        return { status: 500, message: 'Error get specific soundEffect', error };
    }
});

// Update specific SoundEffect
export const updateSoundEffect = ({ id, data }, fileSound) => new Promise(async (resolve, reject) => {
    try {
        const soundEffectRef = db.collection('Sounds').doc(id);

        // Lấy thông tin SoundEffect hiện tại
        const soundEffectDoc = await soundEffectRef.get();
        if (!soundEffectDoc.exists) {
            return resolve({
                status: 404,
                message: 'SoundEffect not found',
            });
        }

        // Xử lý upload file mới
        if (fileSound) {
            const oldFilePath = soundEffectDoc.data().filePath; // Đường dẫn file cũ
            const filenameSound = `Sounds/${uuidv4()}_${fileSound.originalname}`; // Tạo tên file mới
            const fileUpload = bucket.file(filenameSound);

            // Lưu file mới vào Firebase Storage
            await fileUpload.save(fileSound.buffer);

            // Lấy URL truy cập công khai của file mới
            const [url] = await fileUpload.getSignedUrl({
                action: 'read',
                expires: '03-01-2500' // Bạn có thể điều chỉnh thời gian hết hạn URL
            });

            // Kiểm tra và xóa file cũ (nếu tồn tại)
            if (oldFilePath) {
                const oldFile = bucket.file(oldFilePath);
                try {
                    await oldFile.delete();
                } catch (err) {
                    console.error(`Failed to delete old file: ${oldFilePath}`, err);
                }
            }

            // Cập nhật đường dẫn file và URL mới trong dữ liệu
            data.filePath = filenameSound;
            data.url = url;
        }

        // Thêm ngày cập nhật
        data.updatedAt = new Date();

        // Cập nhật dữ liệu SoundEffect trong Firestore
        await soundEffectRef.update(data);

        return resolve({
            err: 0,
            mes: 'Update soundEffect successfully',
        });
    } catch (error) {
        console.error('Error updating soundEffect:', error);
        return reject({
            status: 500,
            message: 'Error updating soundEffect',
            error,
        });
    }
});


// Delte specific SoundEffect
export const deleteSoundEffect = ({ id }) => new Promise(async (resolve, reject) => {
    try {
        const soundEffectRef = db.collection('Sounds').doc(id);
        const soundEffectDoc = await soundEffectRef.get();
        if (!soundEffectDoc.exists) {
            return resolve({
                status: 404,
                message: 'SoundEffect not found',
            });
        }

        const soundData = soundEffectDoc.data();
        const filePath = soundData.filePath;

        if (!filePath) {
            return resolve({
                status: 404,
                message: 'SoundEffect file path not found',
            });
        }

        const file = bucket.file(filePath);
        await file.delete();
        await soundEffectRef.delete();
        return resolve({
            err: 0,
            mes: 'Delete soundEffect successfully',
        });
    } catch (error) {
        reject(error);
        return { status: 500, message: 'Error delete specific soundEffect', error };
    }
}
);
