import React, { useState } from 'react';
import './SoundPage.css';
import NavbarAD from '../NavbarAdmin/Navbar';

const initialSoundsData = [
  { id: 1, name: 'Campfire', volume: 0.5, file: 'campfire.mp3' }, 
  { id: 2, name: 'Cicadas', volume: 0.5, file: 'cicadas.mp3' },
  { id: 3, name: 'City Noise', volume: 0.5, file: 'city_noise.mp3' },
  { id: 4, name: 'Cosy Cafe', volume: 0.5, file: 'cosy_cafe.mp3' },
  { id: 5, name: 'Keyboard', volume: 0.5, file: 'keyboard.mp3' },
  { id: 6, name: 'Page Turning', volume: 0.5, file: 'page_turning.mp3' },
  { id: 7, name: 'Rain', volume: 0.5, file: 'rain.mp3' },
  { id: 8, name: 'Forest', volume: 0.5, file: 'forest.mp3' },
  { id: 9, name: 'Ocean', volume: 0.5, file: 'ocean.mp3' },
  { id: 10, name: 'Thunder', volume: 0.5, file: 'thunder.mp3' },
  { id: 11, name: 'Wind', volume: 0.5, file: 'wind.mp3' },
  { id: 12, name: 'Birds', volume: 0.5, file: 'birds.mp3' },
];

const SoundPage = () => {
  const [soundsData, setSoundsData] = useState(initialSoundsData);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [soundToEdit, setSoundToEdit] = useState(null);
  const [soundToDelete, setSoundToDelete] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const soundsPerPage = 5;

  const handleAddClick = () => {
    setIsAddModalOpen(true);
  };

  const handleEditClick = (sound) => {
    setSoundToEdit(sound);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (sound) => {
    setSoundToDelete(sound);
    setIsDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSoundToEdit(null);
    setSoundToDelete(null);
  };

  const handleConfirmDelete = () => {
    setSoundsData(soundsData.filter((s) => s.id !== soundToDelete.id));
    setIsDeleteModalOpen(false);
    setSoundToDelete(null);
  };

  const handleSaveEdit = (event) => {
    event.preventDefault();
    const updatedName = document.getElementById('editSoundName').value;
    const updatedVolume = parseFloat(document.getElementById('editSoundVolume').value);
    const updatedFile = document.getElementById('editSoundFile').files[0];

    const updatedSoundsData = soundsData.map((sound) =>
      sound.id === soundToEdit.id
        ? { ...sound, name: updatedName, volume: updatedVolume, file: updatedFile }
        : sound
    );
    setSoundsData(updatedSoundsData);
    setIsEditModalOpen(false);
    setSoundToEdit(null);
  };

  const handleSaveAdd = (event) => {
    event.preventDefault();
    const newSoundName = document.getElementById('newSoundName').value;
    const newSoundVolume = parseFloat(document.getElementById('newSoundVolume').value);
    const newSoundFile = document.getElementById('newSoundFile').files[0];

    const newSound = {
      id: Math.max(...soundsData.map((s) => s.id)) + 1,
      name: newSoundName,
      volume: newSoundVolume,
      file: newSoundFile,
    };

    setSoundsData([...soundsData, newSound]);
    setIsAddModalOpen(false);
  };

  const indexOfLastSound = currentPage * soundsPerPage;
  const indexOfFirstSound = indexOfLastSound - soundsPerPage;
  const currentSounds = soundsData.slice(indexOfFirstSound, indexOfLastSound);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(soundsData.length / soundsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div>
      <NavbarAD />
      <button className='btn-add' onClick={handleAddClick}>ADD</button>

      {isAddModalOpen && (
        <div className="add-modal">
          <div className="modal-content">
            <span className="close-modal" onClick={handleCloseModal}>×</span>
            <h2>Add New Sound</h2>
            <form onSubmit={handleSaveAdd}>
              <label htmlFor="newSoundName">Sound Name:</label>
              <input type="text" id="newSoundName" name="newSoundName" required />

              <label htmlFor="newSoundVolume">Volume:</label>
              <input
                type="number"
                id="newSoundVolume"
                name="newSoundVolume"
                min="0"
                max="1"
                step="0.01"
                defaultValue="0.5"
                required
              />

              <label htmlFor="newSoundFile">Sound File:</label>
              <input type="file" id="newSoundFile" name="newSoundFile" required />

              <button type="submit">Save Sound</button>
            </form>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="edit-modal">
          <div className="modal-content">
            <span className="close-modal" onClick={handleCloseModal}>×</span>
            <h2>Edit Sound</h2>
            <form onSubmit={handleSaveEdit}>
              <label htmlFor="editSoundName">Sound Name:</label>
              <input
                type="text"
                id="editSoundName"
                name="editSoundName"
                defaultValue={soundToEdit?.name}
                required
              />

              <label htmlFor="editSoundVolume">Volume:</label>
              <input
                type="number"
                id="editSoundVolume"
                name="editSoundVolume"
                min="0"
                max="1"
                step="0.01"
                defaultValue={soundToEdit?.volume}
                required
              />

              <label htmlFor="editSoundFile">Sound File:</label>
              <input type="file" id="editSoundFile" name="editSoundFile" />

              <button type="submit">Save Changes</button>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="delete-modal">
          <div className="modal-content">
            <span className="close-modal" onClick={handleCloseModal}>×</span>
            <h2>Are you sure you want to delete {soundToDelete?.name}?</h2>
            <button className='btn-delete' onClick={handleConfirmDelete}>DELETE</button>
          </div>
        </div>
      )}

      <div className="sounds-container">
        {currentSounds.map((sound) => (
          <div key={sound.id} className="sound-item">
            <span className="sound-name">{sound.name}</span>
            <div className="button-group">
              <button className='btn-edit' onClick={() => handleEditClick(sound)}>EDIT</button>
              <button className='btn-dele' onClick={() => handleDeleteClick(sound)}>DELETE</button>
            </div>
          </div>
        ))}
      </div>
      <div className="pagination">
          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={currentPage === number ? 'active' : ''}
            >
              {number}
            </button>
          ))}
        </div>
    </div>
  );
};

export default SoundPage;