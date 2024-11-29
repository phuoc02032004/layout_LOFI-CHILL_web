import admin from 'firebase-admin';
import { Storage } from '@google-cloud/storage';
const storage = new Storage();
const bucket = admin.storage().bucket(process.env.BUCKET);

const db = admin.firestore();

// POST a new playlist
export const createPlaylist = ({ Title, Description, vip }) => new Promise(async (resolve, reject) => {
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
        const playlistId = newPlaylistRef.id; // Lấy ID của playlist vừa tạo

        // Tạo thư mục mới trong Firebase Storage dựa trên title
        const bucket = storage.bucket(process.env.BUCKET);
        const folderName = `Music/${Title}/`;
        const file = bucket.file(folderName + '.keep');

        // Tạo một file trống để đảm bảo thư mục được tạo
        await file.save('');

        // Lưu dữ liệu playlist vào Firestore
        await newPlaylistRef.set({
            Title,
            Description,
            filePathPlaylist: folderName,
            vip,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Trả về dữ liệu playlist vừa tạo
        return resolve({
            err: 0,
            mes: 'Create playlist successfully',
            playlist: {
                id: playlistId, // Bao gồm ID
                Title,
                Description,
                filePathPlaylist: folderName,
            },
        });
    } catch (error) {
        reject(error);
        return { status: 500, message: 'Error creating playlist', error };
    }
});

// Get all Playlist
export const getAllPlaylist = ({ }) => new Promise(async (resolve, reject) => {
    try {
        const playlistsSnapshot = await db.collection('Music').get();
        const playlist = playlistsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        return resolve({
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
        return resolve({
            err: 0,
            mes: 'Get specific playlist successfully',
            playlist: playlistDoc.data()
        });
    } catch (error) {
        reject(error);
        return { status: 500, message: 'Error get specific playlist', error };
    }
});


//Update a playlist
export const updatePlaylist = ({ id, data }) => new Promise(async (resolve, reject) => {
    try {
        const playlistRef = db.collection('Music').doc(id);

        // Lấy playlist từ Firestore
        const playlistDoc = await playlistRef.get();
        if (!playlistDoc.exists) {
            return resolve({
                status: 404,
                message: 'Playlist not found',
            });
        }

        const oldPlaylistData = playlistDoc.data();

        // Kiểm tra nếu title thay đổi
        if (data.title && data.title !== oldPlaylistData.title) {
            const oldFolderPath = oldPlaylistData.filePathPlaylist;
            const newFolderPath = `playlists/${data.title}`;

            // Đổi tên folder trong storage
            const [files] = await bucket.getFiles({ prefix: oldFolderPath });

            if (files.length > 0) {
                await Promise.all(files.map(file => {
                    const newFilePath = file.name.replace(oldFolderPath, newFolderPath);
                    return file.move(newFilePath);
                }));
            }

            // Cập nhật đường dẫn mới vào playlist
            data.filePathPlaylist = newFolderPath;
        }

        // Cập nhật thời gian và dữ liệu khác vào Firestore
        data.updatedAt = new Date();

        // Ghi cập nhật vào Firestore, bao gồm cả filePathPlaylist
        await playlistRef.update({
            ...data,
        });

        // Lấy lại dữ liệu mới sau khi cập nhật
        const playlistUpdate = await playlistRef.get();

        return resolve({
            err: 0,
            mes: 'Update playlist and folder successfully',
            playlist: playlistUpdate.data()
        });
    } catch (error) {
        reject({
            status: 500,
            message: 'Error updating playlist and folder',
            error
        });
    }
});

// DELETE a playlist
export const deletePlaylist = ({ id }) => new Promise(async (resolve, reject) => {
    try {
        // Tham chiếu đến playlist
        const playlistRef = db.collection('Music').doc(id);
        const playlistDoc = await playlistRef.get();

        // Kiểm tra nếu playlist không tồn tại
        if (!playlistDoc.exists) {
            return resolve({
                status: 404,
                message: 'Playlist not found',
            });
        }

        const playlistData = playlistDoc.data();

        // Kiểm tra nếu playlist có chứa đường dẫn của thư mục playlist
        if (playlistData.filePathPlaylist) {
            const folderPath = playlistData.filePathPlaylist;

            // Liệt kê tất cả các file trong thư mục playlist
            const [files] = await bucket.getFiles({ prefix: folderPath });

            if (files.length > 0) {
                // Xóa từng file trong thư mục playlist
                for (const file of files) {
                    await file.delete();
                }
            }
        }

        // Xóa chính playlist khỏi Firestore sau khi đã xóa các file
        await playlistRef.delete();

        return resolve({
            err: 0,
            mes: 'Delete playlist and all files successfully',
        });
    } catch (error) {
        reject({
            status: 500,
            message: 'Error deleting playlist and files',
            error
        });
    }
});

