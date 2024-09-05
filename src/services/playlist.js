import admin from 'firebase-admin';

const db = admin.firestore();

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