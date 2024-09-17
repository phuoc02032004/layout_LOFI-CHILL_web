import admin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';
import { Timestamp } from 'firebase-admin/firestore';

const db = admin.firestore();
const bucket = admin.storage().bucket(process.env.BUCKET);

// Get all Song
export const getAllSong = ({ id }) => new Promise(async (resolve, reject) => {
    try {
        const songRef = db.collection('Music').doc(id).collection('Songs');
        const songDoc = await songRef.get();
        if (songDoc.empty) {
            return resolve({
                status: 404,
                message: 'Song not found',
            });
        }
        let songs = [];
        songDoc.forEach(doc => {
            songs.push({ id: doc.id, ...doc.data() });
        })

        resolve({
            err: 0,
            mes: 'Get all song successfully',
            song: songs
        });
    } catch (error) {
        reject(error);
        return { status: 500, message: 'Error get all song', error };
    }
});

// GET SPECIFIC SONG
export const getSpecificSong = ({ idPlaylist, id }) => new Promise(async (resolve, reject) => {
    try {
        const songRef = db.collection('Music').doc(idPlaylist).collection('Songs').doc(id);
        const songDoc = await songRef.get();
        if (!songDoc.exists) {
            return resolve({
                status: 404,
                message: 'Song not found',
            });
        }

        resolve({
            err: 0,
            mes: 'Get specific song successfully',
            user: songDoc.data()
        });
    } catch (error) {
        reject(error);
        return { status: 500, message: 'Error get specific song', error };
    }
});

// Post a Song
export const createSong = ({ idPlaylist, Artist, Title }, fileMusic, fileImg) => new Promise(async (resolve, reject) => {
    try {
        const songRef = db.collection('Music').doc(idPlaylist).collection('Songs');

        // Lấy tên của playlist de truyen vao filepath
        const playlistRef = db.collection('Music').doc(idPlaylist);
        const playlistDoc = await playlistRef.get();
        if (!playlistDoc.exists) {
            return resolve({
                status: 404,
                message: 'Playlist not found',
            });
        }
        const playlistName = playlistDoc.data().Title;

        // Upload file vào Firebase Storage
        const filenameMusic = `Music/${playlistName}/${uuidv4()}_${fileMusic.originalname}`;
        const filenameImg = `Images/Song/${playlistName}/${uuidv4()}_${fileImg.originalname}`;

        const fileUpload = bucket.file(filenameMusic);

        const fileUploadImg = bucket.file(filenameImg);

        // Tải file lên Storage
        await fileUpload.save(fileMusic.buffer);
        await fileUploadImg.save(fileImg.buffer);

        // Lấy URL của file từ Storage
        const [url] = await fileUpload.getSignedUrl({
            action: 'read',
            expires: '03-01-2500' // Thời gian hết hạn của URL (có thể thay đổi)
        });

        const [urlImg] = await fileUploadImg.getSignedUrl({
            action: 'read',
            expires: '03-01-2500' // Thời gian hết hạn của URL (có thể thay đổi)
        });

        // Thêm bài hát vào Firestore
        await songRef.add({
            Artist,  // Sử dụng Artist từ tham số truyền vào
            Title,   // Sử dụng Title từ tham số truyền vào
            Url: url,
            urlImg: urlImg,
            filePath: filenameMusic,
            filePathImg: filenameImg,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        resolve({
            err: 0,
            mes: 'Song created successfully.',
        });

    } catch (error) {
        reject(error);
        return {
            err: 1,
            mes: 'Error creating song',
            error: error.message,
        };
    }
});

// Delete a song
export const deleteSong = ({ idPlaylist, id }) => new Promise(async (resolve, reject) => {
    try {
        const songRef = db.collection('Music').doc(idPlaylist).collection('Songs').doc(id);
        const songDoc = await songRef.get();
        if (!songDoc.exists) {
            return resolve({
                status: 404,
                message: 'Song not found',
            });
        }
        const songData = songDoc.data();
        const filePath = songData.filePath;
        const filePathImg = songData.filePathImg;

        if (!filePath) {
            return resolve({
                status: 404,
                message: 'Invalid file path',
            });
        }

        // Xóa file từ Firebase Storage
        const file = bucket.file(filePath);
        const fileImg = bucket.file(filePathImg);

        await file.delete();
        await fileImg.delete();

        // Xóa bài hát khỏi Firestore
        await songRef.delete();
        resolve({
            err: 0,
            mes: 'Delete song successfully',
        });
    } catch (error) {
        reject(error);
        return { status: 500, message: 'Error delete song', error };
    }
});

// Update a song
export const updateSong = ({ idPlaylist, id, data }, fileMusic, fileImg) => new Promise(async (resolve, reject) => {
    try {
        const songRef = db.collection('Music').doc(idPlaylist).collection('Songs').doc(id);
        const songDoc = await songRef.get();
        if (!songDoc.exists) {
            return resolve({
                status: 404,
                message: 'Song not found',
            });
        }

        const songData = songDoc.data();
        const updatedData = { ...data };

        const playlistRef = db.collection('Music').doc(idPlaylist);
        const playlistDoc = await playlistRef.get();
        if (!playlistDoc.exists) {
            return resolve({
                status: 404,
                message: 'Playlist not found',
            });
        }
        const playlistName = playlistDoc.data().Title;

        // Check if new music file is provided
        if (fileMusic) {
            const oldFilePath = songData.filePath;
            const filenameMusic = `Music/${playlistName}/${uuidv4()}_${fileMusic.originalname}`;
            const fileUpload = bucket.file(filenameMusic);

            // Upload new music file
            await fileUpload.save(fileMusic.buffer);

            // Get URL of the new music file
            const [url] = await fileUpload.getSignedUrl({
                action: 'read',
                expires: '03-01-2500'
            });

            // Delete old music file
            if (oldFilePath) {
                const oldFile = bucket.file(oldFilePath);
                await oldFile.delete();
            }

            // Update file path and URL in Firestore
            updatedData.filePath = filenameMusic;
            updatedData.Url = url;
        }

        // Check if new image file is provided
        if (fileImg) {
            const oldFilePathImg = songData.filePathImg;
            const filenameImg = `Images/Song/${playlistName}/${uuidv4()}_${fileImg.originalname}`;
            const fileUploadImg = bucket.file(filenameImg);

            // Upload new image file
            await fileUploadImg.save(fileImg.buffer);

            // Get URL of the new image file
            const [urlImg] = await fileUploadImg.getSignedUrl({
                action: 'read',
                expires: '03-01-2500'
            });

            // Delete old image file
            if (oldFilePathImg) {
                const oldFileImg = bucket.file(oldFilePathImg);
                await oldFileImg.delete();
            }

            // Update file path and URL in Firestore
            updatedData.filePathImg = filenameImg;
            updatedData.urlImg = urlImg;
        }

        // Update the updatedAt field
        updatedData.updatedAt = admin.firestore.FieldValue.serverTimestamp();

        // Cập nhật các trường của bài hát
        await songRef.update(updatedData);

        // Lấy lại dữ liệu mới sau khi cập nhật
        const updatedDoc = await songRef.get();
        resolve({
            err: 0,
            song: updatedDoc.data(),
        });
    } catch (error) {
        reject(error);
        return { status: 500, message: 'Error delete song', error };
    }
});