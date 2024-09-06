import admin from 'firebase-admin';
import { Storage } from '@google-cloud/storage';
const storage = new Storage();

const db = admin.firestore();

// Get all Playlist
export const getAllPlaylist = ({ }) => new Promise(async (resolve, reject) => {
    try {
        const playlistsSnapshot = await db.collection('Music').get();
        const playlist = playlistsSnapshot.docs.map(doc => doc.data());
        resolve({
            err: 0,
            mes: 'Get all playlist successfully',
            playlist: playlist
        })
    } catch (error) {
        reject(error);
        return { status: 500, message: 'Error get all playlist', error };
    }
});

// Get specific Playlist
export const getSpecificPlaylist = ({ id }) => new Promise(async (resolve, reject) => {
    try {
        const playlistRef = db.collection('Music').doc(id);
        const playlistDoc = await playlistRef.get();
        if (!playlistDoc.exists) {
            return resolve({
                status: 404,
                message: 'Playlist not found',
            });
        }
        resolve({
            err: 0,
            mes: 'Get specific playlist successfully',
            playlist: playlistDoc.data()
        });
    } catch (error) {
        reject(error);
        return { status: 500, message: 'Error get specific playlist', error };
    }
});

// POST a new playlist
export const createPlaylist = ({ Title, Description }) => new Promise(async (resolve, reject) => {
    try {
        // Kiểm tra xem playlist đã tồn tại chưa
        const playlistsRef = db.collection('Music');
        const snapshot = await playlistsRef.where('Title', '==', Title).get();

        if (!snapshot.empty) {
            return resolve({
                status: 404,
                mes: 'Playlist with this title already exists'
            });
        }

        // Tạo playlist mới trong Firestore
        const newPlaylistRef = playlistsRef.doc();
        await newPlaylistRef.set({
            Title,
            Description,
        });

        // Truy xuất lại dữ liệu playlist vừa tạo
        const createdPlaylist = await newPlaylistRef.get();

        // Tạo thư mục mới trong Firebase Storage dựa trên title
        const bucket = storage.bucket(process.env.BUCKET);
        const folderName = `Music/${Title}/`;
        const file = bucket.file(folderName + '.keep');

        // Tạo một file trống để đảm bảo thư mục được tạo
        await file.save('');

        resolve({
            err: 0,
            mes: 'Create playlist successfully',
            playlist: createdPlaylist.data() // Lấy dữ liệu của playlist vừa tạo
        });
    } catch (error) {
        reject(error);
        return { status: 500, message: 'Error creating playlist', error };
    }
});

//Update a playlist
export const updatePlaylist = ({ id, data }) => new Promise(async (resolve, reject) => {
    try {
        const playlistRef = db.collection('Music').doc(id);

        const playlistDoc = await playlistRef.get();
        if (!playlistDoc.exists) {
            return resolve({
                status: 404,
                message: 'Playlist not found',
            });
        }

        await playlistRef.update(data);

        // Lấy lại dữ liệu mới sau khi cập nhật
        const playlistUpdate = await playlistRef.get();

        resolve({
            err: 0,
            mes: 'Update playlist successfully',
            playlist: playlistUpdate.data() // Lấy dữ liệu của playlist vừa tạo
        });
    } catch (error) {
        reject(error);
        return { status: 500, message: 'Error update playlist', error };
    }
});

// DELETE a playlist
export const deletePlaylist = ({ id }) => new Promise(async (resolve, reject) => {
    try {
        const playlistRef = db.collection('Music').doc(id);
        const playlistDoc = await playlistRef.get();
        if (!playlistDoc.exists) {
            return resolve({
                status: 404,
                message: 'Playlist not found',
            });
        }
        await playlistRef.delete();
        resolve({
            err: 0,
            mes: 'Delete playlist successfully',
        });
    } catch (error) {
        reject(error);
        return { status: 500, message: 'Error delete playlist', error };
    }
});
