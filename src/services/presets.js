import admin from 'firebase-admin';
import { Storage } from '@google-cloud/storage';
const storage = new Storage();
const db = admin.firestore();

// Create a new preset
export const createPreset = ({ Title, Description, playlistId, visualId, sounds, vip }) => new Promise(async (resolve, reject) => {
    try {
        const presetsRef = db.collection('Preset');
        const snapshot = await presetsRef.where('Title', '==', Title).get();

        if (!snapshot.empty) {
            return resolve({
                status: 404,
                mes: 'Preset with this title already exists'
            });
        }

        const newPresetRef = presetsRef.doc();
        await newPresetRef.set({
            Title, Description, playlistId, visualId, sounds, vip,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        const createdPreset = await newPresetRef.get();

        return resolve({
            err: 0,
            mes: 'Create preset successfully',
            preset: createdPreset.data()
        });
    } catch (error) {
        reject(error);
        return { status: 500, message: 'Error creating preset', error };
    }
});

// Hàm phụ để lấy URL Video Visual theo ID
const getUrlVideoVisualById = async (collectionName, id) => {
    const doc = await db.collection(collectionName).doc(id).get();
    return doc.exists ? doc.data().videoUrl : null;
};

// Hàm phụ để lấy URL Image Visual theo ID
const getUrlImgVisualById = async (collectionName, id) => {
    const doc = await db.collection(collectionName).doc(id).get();
    return doc.exists ? doc.data().imgUrl : null;
};

// Hàm phụ để lấy URL Soung theo ID
const getUrlSoundById = async (collectionName, id) => {
    const doc = await db.collection(collectionName).doc(id).get();
    return doc.exists ? doc.data().url : null;
};

// Hàm phụ để lấy URL Soung theo ID
const getTitleSoundById = async (collectionName, id) => {
    const doc = await db.collection(collectionName).doc(id).get();
    return doc.exists ? doc.data().Title : null;
};

// Hàm phụ để lấy URL và tiêu đề cho mỗi phần tử sound
const getSoundDetails = async (collectionName, soundIds) => {
    return await Promise.all(soundIds.map(async sound => {
        const { soundId, volume } = sound;
        const soundUrl = soundId ? await getUrlSoundById(collectionName, soundId) : null;
        const soundTitle = soundId ? await getTitleSoundById(collectionName, soundId) : null;
        return {
            soundId,
            volume,
            soundUrl,
            soundTitle
        };
    }));
};

// Get all presets
export const getAllPresets = () => new Promise(async (resolve, reject) => {
    try {
        const presetsSnapshot = await db.collection('Preset').get();

        const presets = await Promise.all(presetsSnapshot.docs.map(async doc => {
            const data = doc.data();
            const visualId = data.visualId;
            const soundIdArray = data.sounds;

            // Lấy URL cho mỗi ID
            const visualUrlVideo = visualId ? await getUrlVideoVisualById('Visuals', visualId) : null;
            const visualUrlImg = visualId ? await getUrlImgVisualById('Visuals', visualId) : null;
            const soundDetails = Array.isArray(soundIdArray) ? await getSoundDetails('Sounds', soundIdArray, soundIdArray.volume) : null;

            return {
                id: doc.id,
                ...data,
                urls: {
                    visualUrlVideo,
                    visualUrlImg,
                    soundDetails
                }
            };
        }));

        return resolve({
            err: 0,
            mes: 'Get all presets successfully',
            presets
        });
    } catch (error) {
        reject(error);
        return { status: 500, message: 'Error getting presets', error };
    }
});

// Get specific preset by ID
export const getSpecificPreset = ({ id }) => new Promise(async (resolve, reject) => {
    try {
        const presetRef = db.collection('Preset').doc(id);
        const presetDoc = await presetRef.get();

        if (!presetDoc.exists) {
            return resolve({
                status: 404,
                mes: 'Preset not found',
            });
        }

        return resolve({
            err: 0,
            mes: 'Get specific preset successfully',
            preset: presetDoc.data()
        });
    } catch (error) {
        reject(error);
        return { status: 500, message: 'Error getting preset', error };
    }
});

// Update a preset
export const updatePreset = async ({ presetId, ...data }) =>
    new Promise(async (resolve, reject) => {
        try {
            const presetsRef = db.collection('Preset').doc(presetId);
            const snapshot = await presetsRef.get();

            if (!snapshot.exists) {
                return resolve({
                    status: 404,
                    mes: 'Preset not found'
                });
            }

            // Loại bỏ các trường có giá trị undefined
            const validData = Object.fromEntries(
                Object.entries(data).filter(([_, value]) => value !== undefined)
            );

            // Kiểm tra nếu không còn trường nào để cập nhật
            if (Object.keys(validData).length === 0) {
                return resolve({
                    status: 400,
                    mes: 'No valid fields to update',
                });
            }

            // Update preset fields
            await presetsRef.update({
                ...validData,
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });

            const updatedPreset = await presetsRef.get();

            return resolve({
                err: 0,
                mes: 'Update preset successfully',
                preset: updatedPreset.data()
            });
        } catch (error) {
            reject({
                status: 500,
                message: 'Error updating preset',
                error
            });
        }
    });



// Delete a preset
export const deletePreset = ({ id }) => new Promise(async (resolve, reject) => {
    try {
        const presetRef = db.collection('Preset').doc(id);
        const presetDoc = await presetRef.get();

        if (!presetDoc.exists) {
            return resolve({
                status: 404,
                mes: 'Preset not found',
            });
        }

        await presetRef.delete();

        return resolve({
            err: 0,
            mes: 'Delete preset successfully',
        });
    } catch (error) {
        reject(error);
        return { status: 500, message: 'Error deleting preset', error };
    }
});