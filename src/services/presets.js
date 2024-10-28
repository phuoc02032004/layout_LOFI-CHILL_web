import admin from 'firebase-admin';
import { Storage } from '@google-cloud/storage';
const storage = new Storage();
const db = admin.firestore();

// Create a new preset
export const createPreset = ({ Title, Description, musicUrl, imageUrl, visualUrl, soundUrl, soundVol }) => new Promise(async (resolve, reject) => {
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
            Title, Description, musicUrl, imageUrl, visualUrl, soundUrl, soundVol,
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

// Get all presets
export const getAllPresets = () => new Promise(async (resolve, reject) => {
    try {
        const presetsSnapshot = await db.collection('Preset').get();
        const presets = presetsSnapshot.docs.map(doc => (
            { id: doc.id, ...doc.data() }
        ));

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
export const updatePreset = ({ id, data }) => new Promise(async (resolve, reject) => {
    try {
        const presetRef = db.collection('Preset').doc(id);
        const presetDoc = await presetRef.get();

        if (!presetDoc.exists) {
            return resolve({
                status: 404,
                mes: 'Preset not found',
            });
        }

        data.updatedAt = new Date();
        await presetRef.update(data);

        const updatedPreset = await presetRef.get();

        return resolve({
            err: 0,
            mes: 'Update preset successfully',
            preset: updatedPreset.data()
        });
    } catch (error) {
        reject(error);
        return { status: 500, message: 'Error updating preset', error };
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