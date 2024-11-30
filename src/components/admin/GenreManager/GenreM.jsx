import React, { useState, useEffect } from "react";
import "./GenreM.css";
import {
  createPlaylist,
  getAllPlaylists,
  updatePlaylist,
  deletePlaylist,
} from "../../../services/playlist";

const GenreM = () => {
  const [stations, setStations] = useState([]);  
  const [isDeleteGenreModalOpen, setIsDeleteGenreModalOpen] = useState(false);
  const [genreToDelete, setGenreToDelete] = useState(null);
  const [isEditGenreModalOpen, setIsEditGenreModalOpen] = useState(false);
  const [genreToEdit, setGenreToEdit] = useState(null);
  const [isAddGenreModalOpen, setIsAddGenreModalOpen] = useState(false);

 
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const playlists = await getAllPlaylists();
        setStations(playlists);  
      } catch (error) {
        console.error("Error fetching playlists:", error);
      }
    };
    fetchGenres();  
  }, []);

  const handleAddGenreClick = () => {
    setIsAddGenreModalOpen(true);
  };

  const handleEditGenre = (genre) => {
    setGenreToEdit(genre);
    setIsEditGenreModalOpen(true);
  };

  const handleDeleteGenre = (genre) => {
    setGenreToDelete(genre);
    setIsDeleteGenreModalOpen(true);
  };

  const handleCloseGenreModal = () => {
    setIsDeleteGenreModalOpen(false);
    setGenreToDelete(null);
    setIsEditGenreModalOpen(false);
    setGenreToEdit(null);
    setIsAddGenreModalOpen(false);
  };

  const handleConfirmDeleteGenre = async () => {
    try {
      await deletePlaylist(genreToDelete.id); 
      const updatedStations = stations.filter(
        (station) => station.id !== genreToDelete.id  
      );
      setStations(updatedStations);  
    } catch (error) {
      console.error("Error deleting playlist:", error);
    } finally {
      setIsDeleteGenreModalOpen(false);
      setGenreToDelete(null);
    }
  };

  const handleSaveEditGenre = async (event) => {
    event.preventDefault();
    const updatedGenreName = document.getElementById("editGenreName").value;
    const updatedGenreDescription = document.getElementById("editGenreDescription").value;
    const updatedGenreVip = document.getElementById("editGenreVip").value === "true";  

    try {
      await updatePlaylist(
        genreToEdit.id,
        updatedGenreName,
        updatedGenreDescription,
        updatedGenreVip  
      );
      const updatedStations = stations.map((station) =>
        station.id === genreToEdit.id
          ? {
              ...station,
              name: updatedGenreName,
              description: updatedGenreDescription,
              vip: updatedGenreVip,  
            }
          : station
      );
      setStations(updatedStations);  
    } catch (error) {
      console.error("Error updating playlist:", error);
    } finally {
      setIsEditGenreModalOpen(false);
      setGenreToEdit(null);
    }
  };

  const handleSaveAddGenre = async (event) => {
    event.preventDefault();
    const newGenreName = document.getElementById("newGenreName").value;
    const newGenreDescription = document.getElementById("newGenreDescription").value;
    const newGenreVip = document.getElementById("newGenreVip").value === "true";  

    try {
      const newPlaylist = await createPlaylist(
        newGenreName,
        newGenreDescription,
        newGenreVip 
      );
      if (newPlaylist && newPlaylist.id) {
        const updatedStations = [
          ...stations,
          {
            id: newPlaylist.id,
            name: newPlaylist.Title,
            description: newPlaylist.Description,
            vip: newPlaylist.vip,  
          },
        ];
        setStations(updatedStations);  
      } else {
        console.error("Invalid playlist data:", newPlaylist);
      }
    } catch (error) {
      console.error("Error adding playlist:", error);
    } finally {
      setIsAddGenreModalOpen(false);
    }
  };

  return (
    <div className="genre-management">
      <button className="btn-add-G" onClick={handleAddGenreClick}>
        ADD Genre
      </button>

      {isAddGenreModalOpen && (
        <div className="add-modal">
          <div className="modal-content">
            <span className="close-modal" onClick={handleCloseGenreModal}>
              ×
            </span>
            <h2>Add New Genre</h2>
            <form onSubmit={handleSaveAddGenre}>
              <label htmlFor="newGenreName">Genre Name:</label>
              <input
                type="text"
                id="newGenreName"
                name="newGenreName"
                required
              />
              <label htmlFor="newGenreDescription">Description:</label>
              <textarea
                id="newGenreDescription"
                name="newGenreDescription"
                required
              ></textarea>
              <label htmlFor="newGenreVip">VIP Status:</label>
              <select id="newGenreVip" name="newGenreVip" required>
                <option value="false">Normal</option>
                <option value="true">VIP</option>
              </select>
              <button type="submit">Save Genre</button>
            </form>
          </div>
        </div>
      )}

      {isEditGenreModalOpen && (
        <div className="edit-modal">
          <div className="modal-content">
            <span className="close-modal" onClick={handleCloseGenreModal}>
              ×
            </span>
            <h2>Edit Genre</h2>
            <form onSubmit={handleSaveEditGenre}>
              <label htmlFor="editGenreName">Genre Name:</label>
              <input
                type="text"
                id="editGenreName"
                name="editGenreName"
                defaultValue={genreToEdit?.name}
                required
              />
              <label htmlFor="editGenreDescription">Description:</label>
              <textarea
                id="editGenreDescription"
                name="editGenreDescription"
                defaultValue={genreToEdit?.description}
                required
              ></textarea>
              <label htmlFor="editGenreVip">VIP Status:</label>
              <select id="editGenreVip" name="editGenreVip" defaultValue={genreToEdit?.vip.toString()} required>
                <option value="false">Normal</option>
                <option value="true">VIP</option>
              </select>
              <button type="submit">Save Changes</button>
            </form>
          </div>
        </div>
      )}

      <div className="genre-list-container">
        {stations.map((genre) => (
          <div key={genre.id} className="genre-item">
            <h3>{genre.name}</h3>
            <p>{genre.description}</p>
            <div className="button-group">
              <button
                className="btn-edit"
                onClick={() => handleEditGenre(genre)}
              >
                EDIT
              </button>
              <button
                className="btn-dele"
                onClick={() => handleDeleteGenre(genre)}
              >
                DELETE
              </button>
            </div>
          </div>
        ))}
      </div>

      {isDeleteGenreModalOpen && (
        <div className="delete-modal">
          <div className="delete-content">
            <span className="close-modal" onClick={handleCloseGenreModal}>
              ×
            </span>
            <h2>Are you sure you want to delete this genre?</h2>
            <button onClick={handleConfirmDeleteGenre}>Yes</button>
            <button onClick={handleCloseGenreModal}>No</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenreM;
