import React, { useState } from 'react';
import './PresetPage.css'; // Import the CSS file
import NavbarAD from '../NavbarAdmin/Navbar';
import { AiOutlineCamera } from "react-icons/ai";
import { GiSoundWaves } from "react-icons/gi";
import chillhopRadio from '../../assets/images/chillhopradio.jpg';
import lateNightVibes from '../../assets/images/latenight.jpg';
import chillStudyBeats from '../../assets/images/chillstudy.jpg';
import sunnyDay from '../../assets/images/sunnyday.jpg';
import essentials from '../../assets/images/essentials.jpg';

function PresetPage() {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [presetToDelete, setPresetToDelete] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [presetToEdit, setPresetToEdit] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [presets, setPresets] = useState([
    {
      id: 1,
      name: 'Chillhop Radio',
      image: chillhopRadio,
      visuals: 'Chillhop Radio',
      sounds: 'Summer Birds, City Noise',
      isDefault: true
    },
    {
      id: 2,
      name: 'Late Night Vibes',
      image: lateNightVibes,
      visuals: 'Late Night Vibes',
      sounds: 'Rain, City Noise',
      isDefault: true
    },
    {
      id: 3,
      name: 'Chill Study Beats',
      image: chillStudyBeats,
      visuals: 'Chill Study Beats',
      sounds: 'Page Turning, Cosy Cafe',
      isDefault: true
    },
    {
      id: 4,
      name: 'Sunny day',
      image: sunnyDay,
      visuals: 'Sunshine Beats',
      sounds: 'Stream',
      isDefault: true
    },
    {
      id: 5,
      name: 'Chillhop Essentials',
      image: essentials,
      visuals: 'Sunshine Beats',
      sounds: 'Summer Birds',
      isDefault: true
    },
  ]);

  const handleEdit = (preset) => {
    setPresetToEdit(preset);
    setIsEditModalOpen(true);
  };

  const handleDelete = (preset) => {
    setPresetToDelete(preset);
    setIsDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDeleteModalOpen(false);
    setPresetToDelete(null);
    setIsEditModalOpen(false);
    setPresetToEdit(null);
    setIsAddModalOpen(false);
  };

  const handleConfirmDelete = () => {
    setPresets(presets.filter((p) => p.id !== presetToDelete.id));
    setIsDeleteModalOpen(false);
    setPresetToDelete(null);
  };

  const handleSaveEdit = (event) => {
    event.preventDefault();
    const updatedName = document.getElementById('editPresetName').value;
    const updatedVisuals = document.getElementById('editPresetVisuals').value;
    const updatedSounds = document.getElementById('editPresetSounds').value;

    const presetIndex = presets.findIndex((p) => p.id === presetToEdit.id);

    const updatedPresets = [...presets];
    updatedPresets[presetIndex] = {
      ...presetToEdit,
      name: updatedName,
      visuals: updatedVisuals,
      sounds: updatedSounds,
    };
    setPresets(updatedPresets);

    setIsEditModalOpen(false);
    setPresetToEdit(null);
  };

  const handleAddClick = () => {
    setIsAddModalOpen(true);
  };

  const handleSaveAdd = (event) => {
    event.preventDefault();
    const newPresetName = document.getElementById('newPresetName').value;
    const newPresetVisuals = document.getElementById('newPresetVisuals').value;
    const newPresetSounds = document.getElementById('newPresetSounds').value;
    const newPresetImageFile = document.getElementById('newPresetImage').files[0];

    const reader = new FileReader();
    reader.onloadend = () => {
      const newPreset = {
        id: presets.length + 1, // Assign a new ID 
        name: newPresetName,
        image: reader.result,
        visuals: newPresetVisuals,
        sounds: newPresetSounds,
        isDefault: false // Default to false for new presets
      };
      setPresets([...presets, newPreset]);
      setIsAddModalOpen(false);
    };
    if (newPresetImageFile) {
      reader.readAsDataURL(newPresetImageFile);
    }
  };

  return (
    <div>
      <NavbarAD />
      <button className='btn-add' onClick={handleAddClick}>ADD</button> 

      {isAddModalOpen && (
        <div className="add-modal">
          <div className="modal-content">
            <span className="close-modal" onClick={handleCloseModal}>×</span>
            <h2>Add New Preset</h2>
            <form onSubmit={handleSaveAdd}>
              <label htmlFor="newPresetName">Preset Name:</label>
              <input
                type="text"
                id="newPresetName"
                name="newPresetName"
                required
              />

              <label htmlFor="newPresetVisuals">Visuals:</label>
              <input
                type="text"
                id="newPresetVisuals"
                name="newPresetVisuals"
                required
              />

              <label htmlFor="newPresetSounds">Sounds:</label>
              <input
                type="text"
                id="newPresetSounds"
                name="newPresetSounds"
                required
              />

              <label htmlFor="newPresetImage">Select Image:</label>
              <input
                type="file"
                id="newPresetImage"
                name="newPresetImage"
                accept="image/*"
              />

              <button type="submit">Save Preset</button>
            </form>
          </div>
        </div>
      )}

      <div className="preset-container">
        {presets.map((preset) => (
          <div key={preset.id} className="preset-card">
            <img src={preset.image} alt={preset.name} />
            <div className="preset-info">
              <h3>{preset.name}</h3>
              <p>
                <AiOutlineCamera /> {preset.visuals}
              </p>
              <p>
                <GiSoundWaves /> {preset.sounds}
              </p>
              <div className="button-group">
                <button className='btn-edit' onClick={() => handleEdit(preset)}>EDIT</button>
                <button className='btn-dele' onClick={() => handleDelete(preset)}>DELETE</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isEditModalOpen && (
        <div className="edit-modal">
          <div className="modal-content">
            <span className="close-modal" onClick={handleCloseModal}>×</span>
            <h2>Edit Preset</h2>
            <form onSubmit={handleSaveEdit}>
              <label htmlFor="editPresetName">Preset Name:</label>
              <input
                type="text"
                id="editPresetName"
                name="editPresetName"
                defaultValue={presetToEdit?.name}
                required
              />

              <label htmlFor="editPresetVisuals">Visuals:</label>
              <input
                type="text"
                id="editPresetVisuals"
                name="editPresetVisuals"
                defaultValue={presetToEdit?.visuals}
                required
              />

              <label htmlFor="editPresetSounds">Sounds:</label>
              <input
                type="text"
                id="editPresetSounds"
                name="editPresetSounds"
                defaultValue={presetToEdit?.sounds}
                required
              />

              <button type="submit">Save Changes</button>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="delete-modal">
          <div className="delete-content">
            <span className="close-modal" onClick={handleCloseModal}>×</span>
            <h2>Are you sure you want to delete {presetToDelete?.name}?</h2>
            <button className='btn-delete' onClick={handleConfirmDelete}>DELETE</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PresetPage;