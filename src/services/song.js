import admin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';
import { Timestamp } from 'firebase-admin/firestore';

const db = admin.firestore();
const bucket = admin.storage().bucket(process.env.BUCKET);

// Post a Song
export const createSong = ({ idPlaylist, ArtistId, Title, Description }, fileMusic, fileImg) => new Promise(async (resolve, reject) => {
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
            ArtistId: ArtistId,
            Title,
            Url: url,
            Description: Description,
            urlImg: urlImg,
            filePath: filenameMusic,
            filePathImg: filenameImg,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        return resolve({
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

// Get all Song
export const getAllSongPlaylist = ({ id }) => new Promise(async (resolve, reject) => {
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

        return resolve({
            err: 0,
            mes: 'Get all song in playlist successfully',
            song: songs
        });
    } catch (error) {
        reject(error);
        return { status: 500, message: 'Error get all song in playlist', error };
    }
});

export const getAllSong = () => new Promise(async (resolve, reject) => {
    try {
        const playlistsRef = db.collection('Music');
        const playlistsSnapshot = await playlistsRef.get();

        if (playlistsSnapshot.empty) {
            reject('No playlists found');
            return;
        }

        let allSongs = [];

        // Lặp qua từng playlist để lấy các bài hát
        for (const playlistDoc of playlistsSnapshot.docs) {
            const playlistId = playlistDoc.id;

            const songsRef = playlistsRef.doc(playlistId).collection('Songs');
            const songsSnapshot = await songsRef.get();

            if (!songsSnapshot.empty) {
                songsSnapshot.forEach(songDoc => {
                    allSongs.push({
                        idPlaylist: playlistId,
                        id: songDoc.id,
                        ...songDoc.data()
                    });
                });
            }
        }
        return resolve(allSongs);
    } catch (error) {
        return reject(error.message || 'Failed to fetch songs');
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

        return resolve({
            err: 0,
            mes: 'Get specific song successfully',
            user: songDoc.data()
        });
    } catch (error) {
        reject(error);
        return { status: 500, message: 'Error get specific song', error };
    }
});

// Get new song in
export const getNewSong = () => new Promise(async (resolve, reject) => {
    try {
        const songRef = await db.collection('Music').get();
        let allSong = [];

        // Sử dụng for...of để lặp qua từng playlist
        for (const playlistDoc of songRef.docs) {
            const songSnapshot = await db.collection('Music').doc(playlistDoc.id).collection('Songs')
                .orderBy('createdAt', 'desc')
                .limit(3)
                .get();

            songSnapshot.forEach((songDoc) => {
                allSong.push({
                    id: songDoc.id,
                    ...songDoc.data()
                });
            });
        }

        // Trả về kết quả khi đã có tất cả các bài hát
        return resolve({
            err: 0,
            mess: 'Get newest Song successfully',
            song: allSong,
        });
    } catch (error) {
        // Xử lý lỗi và trả về phản hồi lỗi
        return reject({
            err: 1,
            mess: 'Error get newest songs',
            error,
        });
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
                try {
                    await oldFile.delete();
                } catch (error) {
                    console.error(`Failed to delete old file: ${oldFilePath}`, error);
                }
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
                try {
                    await oldFileImg.delete();
                } catch (error) {
                    console.error(`Failed to delete old file: ${oldFilePathImg}`, error);
                }
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
        return resolve({
            err: 0,
            song: updatedDoc.data(),
        });
    } catch (error) {
        reject(error);
        return { status: 500, message: 'Error delete song', error };
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

//Play song random from playlist
export const playSong = ({ id }) => new Promise(async (resolve, reject) => {
    try {
        const songRef = db.collection('Music').doc(id).collection('Songs');
        const songDoc = await songRef.get();
        if (songDoc.empty) {
            return resolve({
                status: 404,
                message: 'Song not found',
            });
        }

        // Tạo mảng chứa các bài hát
        const songs = [];
        for (const doc of songDoc.docs) {
            const songData = doc.data();

            const artistRef = db.collection('Artist').doc(songData.ArtistId);
            const artistDoc = await artistRef.get(); 
            const artistName = artistDoc.exists ? artistDoc.data().name : "Unknown Artist";

            songs.push({
                id: doc.id,
                ...songData,
                artistName,
            });
        }


        const shuffledSongs = songs.sort(() => 0.5 - Math.random());
        const randomSong = shuffledSongs.slice(0, 5);

        return resolve({
            err: 0,
            message: 'Song found',
            song: randomSong
        });
    } catch (error) {
        console.error('Error playing random song: ', error);
        return reject({
            status: 500,
            message: 'Internal server error',
        });
    }
});