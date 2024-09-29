import admin from 'firebase-admin';
import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';

const storage = new Storage();
const bucket = admin.storage().bucket(process.env.BUCKET);

const db = admin.firestore();

// Create folder Visual
export const createFolderVisual = ({ Title }) => new Promise(async (resolve, reject) => {
    try {
        // Kiểm tra xem Folder Visual đã tồn tại chưa
        const visualRef = db.collection('Visuals');
        const snapshot = await visualRef.where('Title', '==', Title).get();

        if (!snapshot.empty) {
            return resolve({
                status: 404,
                mes: 'Folder Visual with this title already exists'
            });
        }

        // Tạo Folder Visual mới trong Firestore
        const newVisualRef = visualRef.doc();
        await newVisualRef.set({
            Title,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Truy xuất lại dữ liệu Folder Visual vừa tạo
        const createdVisual = await newVisualRef.get();

        // Tạo thư mục mới trong Firebase Storage dựa trên title
        const bucket = storage.bucket(process.env.BUCKET);
        const folderName = `Visuals/${Title}/`;
        const folderImgName = `Images/Visual/${Title}/`;
        const file = bucket.file(folderName + '.keep');
        const fileImg = bucket.file(folderImgName + '.keep');

        // Tạo một file trống để đảm bảo thư mục được tạo
        await file.save('');
        await fileImg.save('');

        return resolve({
            err: 0,
            mes: 'Create Folder Visual successfully',
            playlist: createdVisual.data()
        });
    } catch (error) {
        reject(error);
        return { status: 500, message: 'Error creating Folder Visual', error };
    }
});

// Get all Folder Visual
export const getAllFolderVisual = ({ }) => new Promise(async (resolve, reject) => {
    try {
        const folderSnapshot = await db.collection('Visuals').get();
        const visuals = folderSnapshot.docs.map(doc => doc.data());
        resolve({
            err: 0,
            mes: 'Get all Folder Visual successfully',
            Visual: visuals
        })
    } catch (error) {
        reject(error);
        return { status: 500, message: 'Error get all Folder Visual', error };
    }
});

// Get specific Folder Visual
export const getSpecificFolderVisual = ({ id }) => new Promise(async (resolve, reject) => {
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
            mes: 'Get specific Folder Visual successfully',
            Visual: visualDoc
        })
    } catch (error) {
        reject(error);
        return { status: 500, message: 'Error get specific Folder Visual', error };
    }
});


//Update a Folder Visual
export const updateFolderVisual = ({ id, data }) => new Promise(async (resolve, reject) => {
    try {
        const visualRef = db.collection('Visuals').doc(id);

        const visualDoc = await visualRef.get();
        if (!visualDoc.exists) {
            return resolve({
                status: 404,
                message: 'Folder Visual not found',
            });
        }

        data.updatedAt = new Date();
        await visualRef.update(data);

        // Lấy lại dữ liệu mới sau khi cập nhật
        const visualUpdate = await visualRef.get();

        return resolve({
            err: 0,
            mes: 'Update Folder Visual successfully',
            playlist: visualUpdate.data() // Lấy dữ liệu của Visual vừa sua
        });
    } catch (error) {
        reject(error);
        return { status: 500, message: 'Error update Visual Folder', error };
    }
});

// Delete Folder Visual
export const deleteFolderVisual = ({ id }) => new Promise(async (resolve, reject) => {
    try {
        const visualRef = db.collection('Visuals').doc(id);
        const visualDoc = await visualRef.get();
        if (!visualDoc.exists) {
            return resolve({
                status: 404,
                message: 'Folder Visual not found',
            });
        }
        await visualRef.delete();
        resolve({
            err: 0,
            mes: 'Delete Folder Visual successfully',
        });
    } catch (error) {
        reject(error);
        return { status: 500, message: 'Error delete Folder Visual', error };
    }
});

// Create Visual
export const createVisual = ({ idFolderVisual, Title }, fileImg, fileVideo) => new Promise(async (resolve, reject) => {
    try {
        const visualRef = db.collection('Visuals').doc(idFolderVisual).collection('Visual');

        const folderVisualRef = db.collection('Visuals').doc(idFolderVisual);
        const folderVisualDoc = await folderVisualRef.get();
        if (!folderVisualDoc.exists) {
            return resolve({
                status: 404,
                message: 'Folder Visual not found',
            });
        }
        const folderName = folderVisualDoc.data().Title;

        // Định nghĩa đường dẫn upload cho video và ảnh
        const filenameVideo = `Visuals/${folderName}/${uuidv4()}_${fileVideo.originalname}`;
        const filenameImg = `Images/Visual/${folderName}/${uuidv4()}_${fileImg.originalname}`;

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
            Title: Title,
            imgUrl: urlImg,
            videoUrl: urlVideo,
            filePathImg: filenameImg,
            filePathVideo: filenameVideo,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        resolve({
            err: 0,
            mes: 'Visual created successfully.',
            visual: newVisualRef.id, // Trả về id của visual mới tạo
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
export const getAllVisual = ({ idFolderVisual }) => new Promise(async (resolve, reject) => {
    try {
        const visualRef = db.collection('Visuals').doc(idFolderVisual).collection('Visual');
        const visualDoc = await visualRef.get();
        if (visualDoc.empty) {
            return resolve({
                status: 404,
                message: 'No visuals found',
            });
        }
        const visuals = visualDoc.docs.map(doc => doc.data());
        resolve({
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
export const getSpecificVisual = ({ idFolderVisual, id }) => new Promise(async (resolve, reject) => {
    try {
        const visualRef = db.collection('Visuals').doc(idFolderVisual).collection('Visual').doc(id);
        const visualDoc = await visualRef.get();
        if (!visualDoc.exists) {
            return resolve({
                status: 404,
                message: 'Visual not found',
            });
        }

        resolve({
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
export const updateVisual = ({ idFolderVisual, id, data }, fileImg, fileVideo) => new Promise(async (resolve, reject) => {
    try {
        const visualRef = db.collection('Visuals').doc(idFolderVisual).collection('Visual').doc(id);
        const visualDoc = await visualRef.get();
        if (!visualDoc.exists) {
            return resolve({
                status: 404,
                message: 'Visual not found',
            });
        }

        const folderVisualRef = db.collection('Visuals').doc(idFolderVisual);
        const folderVisualDoc = await folderVisualRef.get();
        if (!folderVisualDoc.exists) {
            return resolve({
                status: 404,
                message: 'Folder Visual not found',
            });
        }
        const visualName = folderVisualDoc.data().Title;

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

            const filenameImg = `Images/Visual/${visualName}/${uuidv4()}_${fileImg.originalname}`;
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

            const filenameVideo = `Visuals/${visualName}/${uuidv4()}_${fileVideo.originalname}`;
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
export const deleteVisual = ({ idFolderVisual, id }) => new Promise(async (resolve, reject) => {
    try {
        const visualRef = db.collection('Visuals').doc(idFolderVisual).collection('Visual').doc(id);
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
        resolve({
            err: 0,
            mes: 'Delete Visual successfully',
        });
    } catch (error) {
        reject(error);
        return { status: 500, message: 'Error delete Visual', error };
    }
});