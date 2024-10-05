import admin from 'firebase-admin';
import { Storage } from '@google-cloud/storage';
const storage = new Storage();
const db = admin.firestore();

// Create a new artist
export const createArtis = ({ Artist, Description }) => new Promise(async (resolve, reject) => {
    try {
        // Kiểm tra xem artist đã tồn tại chưa
        const artistsRef = db.collection('Artists');
        const snapshot = await artistsRef.where('Artist', '==', Artist).get();

        if (!snapshot.empty) {
            return resolve({
                status: 404,
                mes: 'Artist with this name already exists'
            });
        }

        // Tạo artist mới trong Firestore
        const newArtistRef = artistsRef.doc();
        await newArtistRef.set({
            Artist,
            Description,
        });

        // Truy xuất lại dữ liệu artist vừa tạo
        const createdArtist = await newArtistRef.get();

        return resolve({
            err: 0,
            mes: 'Create artist successfully',
            artist: createdArtist.data()
        });
    } catch (error) {
        reject(error);
        return { status: 500, message: 'Error creating artist', error };
    }
});

// Get all artists
export const getAllArtis = () => new Promise(async (resolve, reject) => {
    try {
        const artistsSnapshot = await db.collection('Artists').get();
        const artists = artistsSnapshot.docs.map(doc => doc.data());
        return resolve({
            err: 0,
            mes: 'Get all artists successfully',
            artists: artists
        });
    } catch (error) {
        reject(error);
        return { status: 500, message: 'Error getting all artists', error };
    }
});

// Get specific artist by ID
export const getSpecificArtis = ({ id }) => new Promise(async (resolve, reject) => {
    try {
        const artistRef = db.collection('Artists').doc(id);
        const artistDoc = await artistRef.get();
        if (!artistDoc.exists) {
            return resolve({
                status: 404,
                message: 'Artist not found',
            });
        }
        return resolve({
            err: 0,
            mes: 'Get specific artist successfully',
            artist: artistDoc.data()
        });
    } catch (error) {
        reject(error);
        return { status: 500, message: 'Error getting specific artist', error };
    }
});

// Update an artist
export const updateArtis = ({ id, data }) => new Promise(async (resolve, reject) => {
    try {
        const artistRef = db.collection('Artists').doc(id);

        const artistDoc = await artistRef.get();
        if (!artistDoc.exists) {
            return resolve({
                status: 404,
                message: 'Artist not found',
            });
        }

        data.updatedAt = new Date();
        await artistRef.update(data);

        // Lấy lại dữ liệu mới sau khi cập nhật
        const artistUpdate = await artistRef.get();

        resolve({
            err: 0,
            mes: 'Update artist successfully',
            artist: artistUpdate.data()
        });
    } catch (error) {
        reject(error);
        return { status: 500, message: 'Error updating artist', error };
    }
});

// Delete an artist
export const deleteArtis = ({ id }) => new Promise(async (resolve, reject) => {
    try {
        const artistRef = db.collection('Artists').doc(id);
        const artistDoc = await artistRef.get();
        if (!artistDoc.exists) {
            return resolve({
                status: 404,
                message: 'Artist not found',
            });
        }
        await artistRef.delete();
        return resolve({
            err: 0,
            mes: 'Delete artist successfully',
        });
    } catch (error) {
        reject(error);
        return { status: 500, message: 'Error deleting artist', error };
    }
});
