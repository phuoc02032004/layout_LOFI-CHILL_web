import admin from 'firebase-admin';

const db = admin.firestore();

const createArtist = async (artistData) => {
    try {
        const artistRef = db.collection('Artist').doc();
        await artistRef.set({
            name: artistData.name,
            imageUrl: artistData.imageUrl || '',
            bio: artistData.bio || '',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        return artistRef;
    } catch (error) {
        console.error('Error creating artist:', error);
        throw error;
    }
};

const getArtistById = async (id) => {
    try {
        const artistRef = db.collection('artists').doc(id);
        const artistDoc = await artistRef.get();
        if (!artistDoc.exists) {
            throw new Error('Artist not found');
        }
        return artistDoc.data();
    } catch (error) {
        console.error('Error fetching artist:', error);
        throw error;
    }
};

const updateArtist = async (id, artistData) => {
    try {
        const artistRef = db.collection('artists').doc(id);
        await artistRef.update({
            ...artistData,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        return artistRef;
    } catch (error) {
        console.error('Error updating artist:', error);
        throw error;
    }
};

const deleteArtist = async (id) => {
    try {
        const artistRef = db.collection('artists').doc(id);
        await artistRef.delete();
        return { message: 'Artist deleted' };
    } catch (error) {
        console.error('Error deleting artist:', error);
        throw error;
    }
};

export { createArtist, getArtistById, updateArtist, deleteArtist };