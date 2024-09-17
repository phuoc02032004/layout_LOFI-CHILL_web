import admin from 'firebase-admin';
import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';
const storage = new Storage();

const db = admin.firestore();
const bucket = admin.storage().bucket(process.env.BUCKET);


// Get all SoundEffect
export const getAllSoundEffect = ({ }) => new Promise(async (resolve, reject) => {
    try {
        const soundEffectsSnapshot = await db.collection('Sounds').get();
        const soundEffect = soundEffectsSnapshot.docs.map(doc => doc.data());
        resolve({
            err: 0,
            mes: 'Get all soundEffect successfully',
            soundEffect: soundEffect
        })
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
        resolve({
            err: 0,
            mes: 'Get specific soundEffect successfully',
            soundEffect: soundEffectDoc.data()
        });
    } catch (error) {
        reject(error);
        return { status: 500, message: 'Error get specific soundEffect', error };
    }
});

// Delte specific SoundEffect
export const deleteSpecificSoundEffect = ({ id }) => new Promise(async (resolve, reject) => {
    try {
        const soundEffectRef = db.collection('Sounds').doc(id);
        const soundEffectDoc = await soundEffectRef.get();
        if (!soundEffectDoc.exists) {
            return resolve({
                status: 404,
                message: 'SoundEffect not found',
            });
        }

        await soundEffectRef.delete();
        resolve({
            err: 0,
            mes: 'Delete specific soundEffect successfully',
        });
    } catch (error) {
        reject(error);
        return { status: 500, message: 'Error delete specific soundEffect', error };
    }
}
);

// POST a new Folder soundEffect
export const createFolderSoundEffect = ({ Title, Description }) => new Promise(async (resolve, reject) => {
    try {
        // Kiểm tra xem soundEffect đã tồn tại chưa
        const soundEffectsRef = db.collection('Sounds');
        const snapshot = await soundEffectsRef.where('Title', '==', Title).get();

        if (!snapshot.empty) {
            return resolve({
                status: 404,
                mes: 'SoundEffect with this title already exists'
            });
        }

        // Tạo soundEffect mới trong Firestore
        const newSoundEffectRef = soundEffectsRef.doc();
        await newSoundEffectRef.set({
            Title,
            Description,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });


        const bucket = storage.bucket(process.env.BUCKET);
        const folderName = `Sounds/${Title}/`;
        const folder = bucket.file(folderName);
        await folder.save('');

        resolve({
            err: 0,
            mes: 'Create soundEffect successfully',
            soundEffect: {
                Title,
                Description
            }
        });
    } catch (error) {
        reject(error);
        return { status: 500, message: 'Error create soundEffect', error };
    }
});

// Update Folder specific SoundEffect
export const updateFolderSoundEffect = ({ id, data }) => new Promise(async (resolve, reject) => {
    try {
        const soundEffectRef = db.collection('Sounds').doc(id);
        const soundEffectDoc = await soundEffectRef.get();
        if (!soundEffectDoc.exists) {
            return resolve({
                status: 404,
                message: 'SoundEffect not found',
            });
        }

        await soundEffectRef.update({
            data,
            updatedAt: new Date(),
        });

        resolve({
            err: 0,
            mes: 'Update soundEffect successfully',
        });
    } catch (error) {
        reject(error);
        return { status: 500, message: 'Error update soundEffect', error };
    }
});

// POST a new SoundEffect
export const createSoundEffect = ({ idFolder, Title, Description }, file) => new Promise(async (resolve, reject) => {
    try {
        const soundEffectRef = db.collection('Sounds').doc(idFolder).collection('Sound');

        // Lấy tên của folder
        const folderRef = db.collection('Sounds').doc(idFolder);
        const folderDoc = await folderRef.get();
        if (!folderDoc.exists) {
            return resolve({
                status: 404,
                message: 'Folder not found',
            });
        }

        const folderName = folderDoc.data().Title;
        const filename = `Sounds/${folderName}/${uuidv4()}_${file.originalname}`;

        const fileUpload = bucket.file(filename);
        await fileUpload.save(file.buffer);

        const [url] = await fileUpload.getSignedUrl({
            action: 'read',
            expires: '03-01-2500'
        });

        await soundEffectRef.add({
            Title,
            Description,
            url: url,
            filePath: filename,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        resolve({
            err: 0,
            mes: 'Create soundEffect successfully',
        });
    } catch (error) {
        reject(error);
        return { status: 500, message: 'Error creating soundEffect', error };
    }
});