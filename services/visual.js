import axios from 'axios';

const apiUrl = 'http://192.168.2.177:3002/api';

const createVisual = async (title, imgFile, videoFile) => {
  try {
    const formData = new FormData();
    formData.append('Title', title);
    formData.append('image', {
      uri: imgFile.uri, // Use the URI from the ImagePicker result
      type: imgFile.type, // Set the correct MIME type
      name: imgFile.fileName, // Set the file name 
    });
    formData.append('video', {
      uri: videoFile.uri, // Use the URI from the VideoPicker result
      type: videoFile.type, // Set the correct MIME type
      name: videoFile.fileName, // Set the file name 
    });

    const response = await axios.post(`${apiUrl}/v1/visual/createVisual`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('Visual Created: ', response.data);
    return response.data; // Return the response data
  } catch (error) {
    console.error('Error creating Visual:', error.response ? error.response.data : error.message);
    throw error;
  }
};

const getAllVisual = async () => {
  try {
    const response = await axios.get(`${apiUrl}/v1/visual/getAllVisual`);
    return response.data.visual.map((visual) => ({
      id: visual.id,
      title: visual.Title,
      urlImg: visual.imgUrl,
      urlVideo: visual.videoUrl,
    }));
  } catch (error) {
    console.error('Error fetching sound:', error);
    throw error;
  }
};

const updateVisual = async (id, title, imgFile, videoFile) => {
  try {
    const formData = new FormData();
    if (title) {
      formData.append('Title', title);
    }

    if (imgFile) {
      formData.append('image', {
        uri: imgFile.uri,
        type: imgFile.type,
        name: imgFile.fileName,
      });
    }

    if (videoFile) {
      formData.append('video', {
        uri: videoFile.uri,
        type: videoFile.type,
        name: videoFile.fileName,
      });
    }

    const response = await axios.put(
      `${apiUrl}/v1/visual/updateVisual/${id}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    console.log('Visual Updated: ', response.data);
    return response.data; // Return the response data
  } catch (error) {
    console.error(
      'Error updating Visual:',
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

const deleteVisual = async (visualId) => {
  try {
    const response = await axios.delete(
      `${apiUrl}/v1/visual/deleteVisual/${visualId}`
    );
    console.log('Visual Deleted:', response.data);
    return response.data; // Return the response data
  } catch (error) {
    console.error(
      'Error deleting Visual:',
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export { createVisual, getAllVisual, updateVisual, deleteVisual };