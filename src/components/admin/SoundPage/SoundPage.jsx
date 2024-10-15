import React, { useEffect, useState } from 'react';
import './SoundPage.css';
import NavbarAD from '../NavbarAdmin/Navbar';
import { createSound, getAllSound, deleteSound } from '../../../services/sound';

const SoundPage = () => {
  const [soundsData, setSoundsData] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [soundToEdit, setSoundToEdit] = useState(null);
  const [soundToDelete, setSoundToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const soundsPerPage = 5;

  useEffect(() => {
    fetchSoundsData();
  }, []);

  const fetchSoundsData = async () => {
    try {
      const response = await getAllSound();
      setSoundsData(response);
    } catch (error) {
      console.error('Failed to fetch sounds data:', error);
    }
  };

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

  const handleConfirmDelete = async () => {
    try {
        await deleteSound(soundToDelete.id);
        
        setSoundsData(soundsData.filter((s) => s.id !== soundToDelete.id));
    } catch (error) {
        console.error('Error during sound deletion:', error);
    } finally {
        setIsDeleteModalOpen(false);
        setSoundToDelete(null);
    }
};


  const handleSaveEdit = async (event) => {
    event.preventDefault();
    const updatedName = document.getElementById('editSoundName').value;
    const updatedFile = document.getElementById('editSoundFile').files[0];

    const updatedSoundsData = soundsData.map((sound) =>
      sound.id === soundToEdit.id
        ? { ...sound, title: updatedName, file: updatedFile }
        : sound
    );
    setSoundsData(updatedSoundsData);
    setIsEditModalOpen(false);
    setSoundToEdit(null);
  };

  const handleSaveAdd = async (event) => {
    event.preventDefault();
    const newSoundName = document.getElementById('newSoundName').value;
    const newSoundDescription = document.getElementById('newSoundDescription').value;
    const newSoundFile = document.getElementById('newSoundFile').files[0];

    try {
      await createSound(newSoundName, newSoundDescription, newSoundFile);
      await fetchSoundsData();
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error saving new sound:', error);
    }
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
              <input type="text" id="newSoundName" required />

              <label htmlFor="newSoundDescription">Description:</label>
              <input type="text" id="newSoundDescription" required />

              <label htmlFor="newSoundFile">Sound File:</label>
              <input type="file" id="newSoundFile" name="soundFile" required />

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
                defaultValue={soundToEdit?.title}
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
            <h2>Are you sure you want to delete {soundToDelete?.title}?</h2>
            <button className='btn-delete' onClick={handleConfirmDelete}>DELETE</button>
          </div>
        </div>
      )}

      <div className="sounds-container-ad">
        {currentSounds.map((sound) => (
          <div key={sound.id} className="sound-item-ad">
            <span className="sound-name-ad">{sound.title}</span>
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
