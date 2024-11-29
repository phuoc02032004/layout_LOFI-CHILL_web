import admin from 'firebase-admin';
import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';

const storage = new Storage();
const bucket = admin.storage().bucket(process.env.BUCKET);

const db = admin.firestore();

// Create Visual
export const createVisual = ({ Title, vip }, fileImg, fileVideo) => new Promise(async (resolve, reject) => {
    try {
        const visualRef = db.collection('Visuals');

        const snapshot = await visualRef.where('Title', '==', Title).get();

        if (!snapshot.empty) {
            return resolve({
                status: 404,
                mes: 'Visual withe this title already exist'
            })
        }

        // Định nghĩa đường dẫn upload cho video và ảnh
        const filenameVideo = `Visuals/${uuidv4()}_${fileVideo.originalname}`;
        const filenameImg = `Images/Visual/${uuidv4()}_${fileImg.originalname}`;

        // Tạo reference cho các file trên Firebase Storage
        const fileUploadVideo = bucket.file(filenameVideo);
        const fileUploadImg = bucket.file(filenameImg);

        // Tải file video lên Firebase Storage
        await fileUploadVideo.save(fileVideo.buffer);

        // Tải file ảnh lên Firebase Storage
        await fileUploadImg.save(fileImg.buffer);

        // Lấy URL của video từ Firebase Storage
        const [urlVideo] = await fileUploadVideo.getSignedUrl({
            action: 'read',
            expires: '03-01-2500'
        });

        // Lấy URL của ảnh từ Firebase Storage
        const [urlImg] = await fileUploadImg.getSignedUrl({
            action: 'read',
            expires: '03-01-2500'
        });

        // Thêm visual vào Firestore với URL video và ảnh
        const newVisualRef = await visualRef.add({
            Title,
            vip,
            imgUrl: urlImg,
            videoUrl: urlVideo,
            filePathImg: filenameImg,
            filePathVideo: filenameVideo,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        return resolve({
            err: 0,
            mes: 'Visual created successfully.',
            visual: newVisualRef.id,
        });

    } catch (error) {
        reject(error);
        return {
            err: 1,
            mes: 'Error creating Visual',
            error: error.message,
        };
    }
});

// Get all Visual
export const getAllVisual = ({ }) => new Promise(async (resolve, reject) => {
    try {
        const visualRef = db.collection('Visuals');
        const visualDoc = await visualRef.get();
        if (visualDoc.empty) {
            return resolve({
                status: 404,
                message: 'No visuals found',
            });
        }
        const visuals = visualDoc.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
        return resolve({
            err: 0,
            mes: 'Get all Visual successfully',
            visual: visuals
        });
    } catch (error) {
        reject(error);
        return { status: 500, message: 'Error get all Visual', error };
    }
});

// GET a specific Visual
export const getSpecificVisual = ({ id }) => new Promise(async (resolve, reject) => {
    try {
        const visualRef = db.collection('Visuals').doc(id);
        const visualDoc = await visualRef.get();
        if (!visualDoc.exists) {
            return resolve({
                status: 404,
                message: 'Visual not found',
            });
        }

        return resolve({
            err: 0,
            mes: 'Get specific Visual successfully',
            visual: visualDoc.data()
        });
    } catch (error) {
        reject(error);
        return { status: 500, message: 'Error get specific Visual', error };
    }
});

// Update Visual
export const updateVisual = ({ id, data }, fileImg, fileVideo) => new Promise(async (resolve, reject) => {
    try {
        const visualRef = db.collection('Visuals').doc(id);
        const visualDoc = await visualRef.get();
        if (!visualDoc.exists) {
            return resolve({
                status: 404,
                message: 'Visual not found',
            });
        }

        if (fileImg) {
            const visualData = visualDoc.data();
            const filePathImg = visualData.filePathImg;
            const fileImgRef = bucket.file(filePathImg);

            try {
                await fileImgRef.delete();
                console.log(`Deleted old image file: ${filePathImg}`);
            } catch (error) {
                console.error(`Failed to delete old image file: ${filePathImg}`, error);
            }

            const filenameImg = `Images/Visual/${uuidv4()}_${fileImg.originalname}`;
            const fileUploadImg = bucket.file(filenameImg);
            await fileUploadImg.save(fileImg.buffer);
            const [urlImg] = await fileUploadImg.getSignedUrl({
                action: 'read',
                expires: '03-01-2500'
            });
            data.imgUrl = urlImg;
            data.filePathImg = filenameImg;
        }

        if (fileVideo) {
            const visualData = visualDoc.data();
            const filePathVideo = visualData.filePathVideo;
            const fileVideoRef = bucket.file(filePathVideo);

            try {
                await fileVideoRef.delete();
                console.log(`Deleted old video file: ${filePathVideo}`);
            } catch (error) {
                console.error(`Failed to delete old video file: ${filePathVideo}`, error);
            }

            const filenameVideo = `Visuals/${uuidv4()}_${fileVideo.originalname}`;
            const fileUploadVideo = bucket.file(filenameVideo);
            await fileUploadVideo.save(fileVideo.buffer);
            const [urlVideo] = await fileUploadVideo.getSignedUrl({
                action: 'read',
                expires: '03-01-2500'
            });
            data.videoUrl = urlVideo;
            data.filePathVideo = filenameVideo;
        }

        // Chuyển đổi `updatedAt` sang Firestore Timestamp
        const updatedAtTimestamp = data.updatedAt || admin.firestore.FieldValue.serverTimestamp();

        // Sua bài hát trong Firestore
        await visualRef.update(
            {
                ...data,
                updatedAt: updatedAtTimestamp,
            }
        );
        // Lấy lại dữ liệu mới sau khi cập nhật
        const updatedDoc = await visualRef.get();
        return resolve({
            err: 0,
            mes: 'Update Visual successfully',
            visual: updatedDoc.data(),
        });
    } catch (error) {
        reject(error);
        return { status: 500, message: 'Error Update Visual', error };
    }
});

// Delete a Visual
export const deleteVisual = ({ id }) => new Promise(async (resolve, reject) => {
    try {
        const visualRef = db.collection('Visuals').doc(id);
        const visualDoc = await visualRef.get();
        if (!visualDoc.exists) {
            return resolve({
                status: 404,
                message: 'Visual not found',
            });
        }
        const visualData = visualDoc.data();
        const filePathImg = visualData.filePathImg;
        const filePathVideo = visualData.filePathVideo;


        if (!filePathImg || !filePathVideo) {
            return resolve({
                status: 404,
                message: 'Invalid file path',
            });
        }

        // Xóa file từ Firebase Storage
        const fileImg = bucket.file(filePathImg);
        const fileVideo = bucket.file(filePathVideo);
        await fileImg.delete();
        await fileVideo.delete();

        // Xóa bài hát khỏi Firestore
        await visualRef.delete();
        return resolve({
            err: 0,
            mes: 'Delete Visual successfully',
        });
    } catch (error) {
        reject(error);
        return { status: 500, message: 'Error delete Visual', error };
    }
});