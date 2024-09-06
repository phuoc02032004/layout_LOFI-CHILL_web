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

// Post Song
export const createSong = ({ idPlaylist, Artist, Title }, file) => new Promise(async (resolve, reject) => {
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
        const filename = `Music/${playlistName}/${uuidv4()}_${file.originalname}`;
        const fileUpload = bucket.file(filename);

        // Tải file lên Storage
        await fileUpload.save(file.buffer);

        // Lấy URL của file từ Storage
        const [url] = await fileUpload.getSignedUrl({
            action: 'read',
            expires: '03-01-2500' // Thời gian hết hạn của URL (có thể thay đổi)
        });

        // Thêm bài hát vào Firestore
        await songRef.add({
            Artist,  // Sử dụng Artist từ tham số truyền vào
            Title,   // Sử dụng Title từ tham số truyền vào
            Url: url,
            filePath: filename,
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

