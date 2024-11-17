import axios from "axios";

interface Artist {
  id: string;
  Description: string;
  name: string;
  urlImg: string;
  filePathImg: string;
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };
  updatedAt: {
    _seconds: number;
    _nanoseconds: number;
  };
  songs: string;
}

interface ArtistResponse {
  err: number;
  mes: string;
  artist: Artist;
}

const apiUrl = "http://192.168.2.177:3002/api/v1/artist";

const createArtist = async (
  name: string,
  Description: string,
  imgFile: File
) => {
  try {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("Description", Description);
    formData.append("fileImg", imgFile);

    const response = await axios.post(`${apiUrl}/createArtist`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Artist Created: ", response.data);
  } catch (error: any) {
    if (error.response) {
      console.error("Error creating Artist:", error.response.data);
    } else {
      console.error("Error creating Artist:", error.message);
    }
  }
};

const getAllArtist = async () => {
  try {
    const response = await axios.get(`${apiUrl}/getAllArtist`);
    return response.data.artists;  
  } catch (error: any) {
    if (error.response) {
      console.error("Error fetching artists:", error.response.data, error.response.status); //Added status code
    } else {
      console.error("Error fetching artists:", error.message);
    }
    throw error;
  }
};

const updateArtist = async (
  id: number,
  name?: string,
  Description?: string,
  imgFile?: File
) => {
  try {
    const formData = new FormData();
    if (name) {
      formData.append("name", name);
    }

    if (Description) {
      formData.append("Description", Description);
    }

    if (imgFile) {
      formData.append("fileImg", imgFile);
    }

    const response = await axios.put(
      `${apiUrl}/updateArtist/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("Artist Updated: ", response.data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Error updating Artist:", error.response.data);
    } else {
      console.error("Error updating Artist:", error.message);
    }
    throw error;
  }
};

const deleteArtist = async (artistId: number) => {
  try {
    const response = await axios.delete(
      `${apiUrl}/deleteArtist/${artistId}`
    );
    console.log("Artist Deleted:", response.data);
  } catch (error: any) {
    if (error.response) {
      console.error("Error deleting Artist:", error.response.data);
    } else {
      console.error("Error deleting Artist:", error.message);
    }
  }
};

const getSpecificArtist = async (artistId: string) => {
  try {
    const response = await axios.get(`${apiUrl}/getSpecificArtist/${artistId}`);
    return response.data as ArtistResponse;
  } catch (error: any) {
    if (error.response) {
      console.error("Error fetching artist:", error.response.data);
    } else {
      console.error("Error fetching artist:", error.message);
    }
    throw error;
  }
};

export { createArtist, getAllArtist, updateArtist, deleteArtist, getSpecificArtist };