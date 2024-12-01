import admin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';
import { collection } from 'firebase/firestore';

const db = admin.firestore();

export const addHistory = ({ userId, playlistId, songId }) => new Promise(async (resolve, reject) => {
    try {
        console.log('Adding to history:', { userId, playlistId, songId });
        const historyRef = db.collection('users').doc(userId).collection('history');
        const snapshot = await historyRef.where('songId', '==', songId).get();

        if (!snapshot.empty) {
            return resolve({
                status: 409,
                message: 'History with this Song already exists',
            });
        }

        await historyRef.add({
            playlistId,
            songId,
            listenedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        return resolve({
            status: 201,
            message: 'History added successfully.',
        });
    } catch (error) {
        console.error('Error adding history:', error);
        return reject({
            status: 500,
            message: 'Error adding history',
            error: error.message,
        });
    }
});

const getSong = async (playlistId, songId) => {
    const doc = await db.collection('Music').doc(playlistId).collection('Songs').doc(songId).get();
    return doc.exists ? doc.data() : null;
}

const getArtistName = async (artistId) => {
    const doc = await db.collection('Artist').doc(artistId).get();
    return doc.exists ? doc.data().name : null;
}

export const getHistory = ({ userId }) => new Promise(async (resolve, reject) => {
    try {
        const historySnapshot = await db.collection('users').doc(userId).collection('history').get();

        if (historySnapshot.empty) {
            return resolve({
                status: 404,
                message: 'History not found',
            });
        }

        const historyData = await Promise.all(
            historySnapshot.docs.map(async (doc) => {
                const { playlistId, songId } = doc.data();
                const songData = await getSong(playlistId, songId);

                const artist = await getArtistName(songData.ArtistId);

                if (!songData) return null;

                return {
                    playlistId,
                    songId,
                    title: songData.Title,
                    songUrl: songData.Url || null,
                    songArtist: artist || null,
                    songImg: songData.urlImg || null,
                    listenedAt: doc.data().listenedAt?.toDate().toISOString() || null, // Định dạng thời gian
                };
            })
        );

        const filteredHistory = historyData.filter((item) => item !== null);

        return resolve({
            status: 200,
            message: 'History retrieved successfully',
            data: filteredHistory,
        });

    } catch (error) {
        console.error('Error retrieving history:', error);
        return reject({
            status: 500,
            message: 'Error retrieving history',
            error: error.message,
        });
    }
});