import admin from 'firebase-admin';
import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';
const storage = new Storage();
const db = admin.firestore();
const bucket = admin.storage().bucket(process.env.BUCKET);

export const createArtist = ({ name, Description }, fileImg) => new Promise(async (resolve, reject) => {
    try {
        // Kiểm tra xem artist đã tồn tại chưa
        const artistsRef = db.collection('Artist');
        const snapshot = await artistsRef.where('name', '==', name).get();

        if (!snapshot.empty) {
            return resolve({
                status: 404,
                mes: 'Artist with this name already exists'
            });
        }

        if (!fileImg) {
            return resolve({
                status: 400,
                mes: 'Image file is required'
            });
        }

        const filenameImg = `Images/Artist/${uuidv4()}_${fileImg.originalname}`;
        const fileUploadImg = bucket.file(filenameImg);

        await fileUploadImg.save(fileImg.buffer);

        const [urlImg] = await fileUploadImg.getSignedUrl({
            action: 'read',
            expires: '03-01-2500'
        });

        // Tạo artist mới trong Firestore
        await artistsRef.add({
            name,
            Description,
            urlImg: urlImg,
            filePathImg: filenameImg,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        return resolve({
            err: 0,
            mes: 'Create artist successfully',
        });
    } catch (error) {
        reject(error);
        return { status: 500, message: 'Error creating artist', error };
    }
});

// Get all artists
export const getAllArtist = () => new Promise(async (resolve, reject) => {
    try {
        const artistsSnapshot = await db.collection('Artist').get();

        // Check if the snapshot is empty
        if (artistsSnapshot.empty) {
            return resolve({
                status: 404,
                message: 'No artists found', // Better message for empty case
            });
        }

        // Map through the documents and construct the artist list
        const artists = artistsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Resolve with the list of artists
        return resolve({
            err: 0,
            message: 'Get all artists successfully',
            artists: artists
        });
    } catch (error) {
        console.error('Error getting all artists:', error);
        // Reject with a proper error message
        reject({
            status: 500,
            message: 'Error getting all artists',
            error: error.message || error
        });
    }
});

// Get specific artist by ID
export const getSpecificArtist = ({ id }) => new Promise(async (resolve, reject) => {
    try {
        const artistRef = db.collection('Artist').doc(id);
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
export const updateArtist = ({ id, data }, fileImg) => new Promise(async (resolve, reject) => {
    try {
        const artistRef = db.collection('Artist').doc(id);

        const artistDoc = await artistRef.get();
        if (!artistDoc.exists) {
            return resolve({
                status: 404,
                message: 'Artist not found',
            });
        }

        if (fileImg) {
            const oldFilePathImg = artistDoc.data().filePathImg;
            const filenameImg = `Images/Artist/${uuidv4()}_${fileImg.originalname}`;
            const fileUploadImg = bucket.file(filenameImg);

            await fileUploadImg.save(fileImg.buffer);

            const [urlImg] = await fileUploadImg.getSignedUrl({
                action: 'read',
                expires: '03-01-2500'
            });

            if (oldFilePathImg) {
                await bucket.file(oldFilePathImg).delete();
            }

            data.urlImg = urlImg;
            data.filePathImg = filenameImg;
        }

        data.updatedAt = new Date();
        await artistRef.update(data);

        // Lấy lại dữ liệu mới sau khi cập nhật
        const artistUpdate = await artistRef.get();

        return resolve({
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
export const deleteArtist = ({ id }) => new Promise(async (resolve, reject) => {
    try {
        const artistRef = db.collection('Artist').doc(id);
        const artistDoc = await artistRef.get();
        if (!artistDoc.exists) {
            return resolve({
                status: 404,
                message: 'Artist not found',
            });
        }

        const artistData = artistDoc.data();
        if (artistData.filePathImg) {
            await bucket.file(artistData.filePathImg).delete();
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


export const getArtistSong = ({ id }) => new Promise(async (resolve, reject) => {
    try {
        const playlistsSnapshot = await db.collection('Music').get();

        if (playlistsSnapshot.empty) {
            console.log('No playlists found');
            resolve([]);
            return;
        }

        const songs = [];

        for (const playlistDoc of playlistsSnapshot.docs) {
            const songsSnapshot = await playlistDoc.ref.collection('Songs')
                .where('ArtistId', '==', id)
                .get();

            if (!songsSnapshot.empty) {
                songsSnapshot.forEach(songDoc => {
                    songs.push({ id: songDoc.id, ...songDoc.data() });
                });
            }
        }

        if (songs.length === 0) {
            console.log('No songs found for artist:', id);
        }

        resolve(songs);

    } catch (error) {
        console.error("Error fetching artist's songs:", error);
        reject(error);
    }
});