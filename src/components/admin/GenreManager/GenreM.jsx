import React, { useState } from 'react';
import './GenreM.css'; 
import { FaCoffee } from "react-icons/fa"; 

const GenreM = ({ stations, setStations }) => {
  const [isDeleteGenreModalOpen, setIsDeleteGenreModalOpen] = useState(false);
  const [genreToDelete, setGenreToDelete] = useState(null);
  const [isEditGenreModalOpen, setIsEditGenreModalOpen] = useState(false);
  const [genreToEdit, setGenreToEdit] = useState(null);
  const [isAddGenreModalOpen, setIsAddGenreModalOpen] = useState(false);

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

  const handleConfirmDeleteGenre = () => {
    setStations(stations.filter((g) => g.id !== genreToDelete.id));
    setIsDeleteGenreModalOpen(false);
    setGenreToDelete(null);
  };

  const handleSaveEditGenre = (event) => {
    event.preventDefault();
    const updatedGenreName = document.getElementById('editGenreName').value;
    const updatedGenreDescription = document.getElementById('editGenreDescription').value;

    const genreIndex = stations.findIndex((g) => g.id === genreToEdit.id);
    const updatedGenres = [...stations];
    updatedGenres[genreIndex] = {
      ...genreToEdit,
      name: updatedGenreName,
      description: updatedGenreDescription,
    };
    setStations(updatedGenres);
    setIsEditGenreModalOpen(false);
    setGenreToEdit(null);
  };

  const handleSaveAddGenre = (event) => {
    event.preventDefault();
    const newGenreName = document.getElementById('newGenreName').value;
    const newGenreDescription = document.getElementById('newGenreDescription').value;

    const newGenre = {
      id: stations.length + 1,
      name: newGenreName,
      description: newGenreDescription,
      icon: <FaCoffee /> // Replace with your desired icon
    };

    setStations([...stations, newGenre]);
    setIsAddGenreModalOpen(false);
  };

  return (
    <div className="genre-management">
      <button className='btn-add-G' onClick={handleAddGenreClick}>ADD Genre</button>

      {isAddGenreModalOpen && (
        <div className="add-modal">
          <div className="modal-content">
            <span className="close-modal" onClick={handleCloseGenreModal}>×</span>
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
              <button type="submit">Save Genre</button>
            </form>
          </div>
        </div>
      )}

      {isEditGenreModalOpen && (
        <div className="edit-modal">
          <div className="modal-content">
            <span className="close-modal" onClick={handleCloseGenreModal}>×</span>
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
              <button className='btn-edit' onClick={() => handleEditGenre(genre)}>EDIT</button>
              <button className='btn-dele' onClick={() => handleDeleteGenre(genre)}>DELETE</button>
            </div>
          </div>
        ))}
      </div>

      {isDeleteGenreModalOpen && (
        <div className="delete-modal">
          <div className="delete-content">
            <span className="close-modal" onClick={handleCloseGenreModal}>×</span>
            <h2>Are you sure you want to delete {genreToDelete?.name}?</h2>
            <button className='btn-delete' onClick={handleConfirmDeleteGenre}>DELETE</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenreM;