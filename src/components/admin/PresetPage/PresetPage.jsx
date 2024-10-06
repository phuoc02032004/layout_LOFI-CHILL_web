import React, { useState, useEffect } from 'react';
import './PresetPage.css';
import NavbarAD from '../NavbarAdmin/Navbar';
import { AiOutlineCamera } from "react-icons/ai";
import { GiSoundWaves } from "react-icons/gi";
import { FaCoffee } from "react-icons/fa";
import { BsBuilding } from "react-icons/bs";
import { HiMoon } from "react-icons/hi";
import { FaHeadphones } from "react-icons/fa";
import { FaRadio } from "react-icons/fa6";
import { FaCloudShowersHeavy } from "react-icons/fa6";
import { PiSunHorizonFill } from "react-icons/pi";
import { SlVolumeUp } from "react-icons/sl";

import chillhopRadio from '../../assets/images/chillhopradio.jpg';
import lateNightVibes from '../../assets/images/latenight.jpg';
import chillStudyBeats from '../../assets/images/chillstudy.jpg';
import sunnyDay from '../../assets/images/sunnyday.jpg';
import essentials from '../../assets/images/essentials.jpg';

import BeachPreview from '../../assets/images/imgBeach.jpg';
import BedroomPreview from '../../assets/images/imgBedroom.jpg';
import CampfirePreview from '../../assets/images/imgCampfire.jpg';
import ChillStudyPreview from '../../assets/images/imgChill.jpg';
import EndlessStrollPreview from '../../assets/images/imgendless.jpg';
import LatenightPreview from '../../assets/images/imglate.png';
import MorningPreview from '../../assets/images/imgMorning.png';
import SummerPreview from '../../assets/images/imgSummer.jpg';
import SummerSunPreview from '../../assets/images/imgSummerSun.jpg';

function PresetPage() {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [presetToDelete, setPresetToDelete] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [presetToEdit, setPresetToEdit] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [images, setImages] = useState([
    { src: BeachPreview, name: 'Beach' },
    { src: BedroomPreview, name: 'Bedroom' },
    { src: CampfirePreview, name: 'Campfire' },
    { src: ChillStudyPreview, name: 'Chill Study' },
    { src: EndlessStrollPreview, name: 'Endless Stroll' },
    { src: LatenightPreview, name: 'Late Night' },
    { src: MorningPreview, name: 'Morning' },
    { src: SummerPreview, name: 'Summer' },
    { src: SummerSunPreview, name: 'Summer Sun' },
  ]);

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

  const stationsData = [
    {
      id: 1,
      name: 'Endless Sunday',
      icon: <FaCoffee />,
      description: 'A selection of smooth jazzy beats'
    },
    {
      id: 2,
      name: 'Headbop Beats',
      icon: <BsBuilding />,
      description: 'Beats to bop your head to'
    },
    {
      id: 3,
      name: 'Late Night Vibes',
      icon: <HiMoon />,
      description: 'Calmer tracks to help you relax or sleep'
    },
    {
      id: 4,
      name: 'lofi hip hop beats',
      icon: <FaHeadphones />,
      description: 'Relaxing beats to help you focus'
    },
    {
      id: 5,
      name: 'Chillhop Radio',
      icon: <FaRadio />,
      description: 'A wide variety of the best tracks from our label'
    },
    {
      id: 6,
      name: 'Melancholic Mood',
      icon: <FaCloudShowersHeavy />,
      description: 'Moody and sad beats'
    },
    {
      id: 7,
      name: 'Sunshine Beat',
      icon: <PiSunHorizonFill />,
      description: 'Uplifting beats to keep you active'
    },
  ];

  const [presets, setPresets] = useState([
    {
      id: 1,
      name: 'Chillhop Radio',
      image: chillhopRadio,
      visual: images.find(img => img.name === 'Summer Sun'),
      sounds: [
        { ...initialSoundsData.find(sound => sound.name === 'Birds'), volume: 0.5 },
        { ...initialSoundsData.find(sound => sound.name === 'City Noise'), volume: 0.7 },
      ],
      playlist: stationsData.find(station => station.name === 'Chillhop Radio')
    },
    {
      id: 2,
      name: 'Late Night Vibes',
      image: lateNightVibes,
      visual: images.find(img => img.name === 'Late Night'),
      sounds: [
        { ...initialSoundsData.find(sound => sound.name === 'Rain'), volume: 0.3 },
        { ...initialSoundsData.find(sound => sound.name === 'City Noise'), volume: 0.2 },
      ],
      playlist: stationsData.find(station => station.name === 'Late Night Vibes')
    },
    {
      id: 3,
      name: 'Chill Study Beats',
      image: chillStudyBeats,
      visual: images.find(img => img.name === 'Chill Study'),
      sounds: [
        { ...initialSoundsData.find(sound => sound.name === 'Page Turning'), volume: 0.8 },
        { ...initialSoundsData.find(sound => sound.name === 'Cosy Cafe'), volume: 0.6 },
      ],
      playlist: stationsData.find(station => station.name === 'lofi hip hop beats')
    },
    {
      id: 4,
      name: 'Sunny Day',
      image: sunnyDay,
      visual: images.find(img => img.name === 'Beach'),
      sounds: [
        { ...initialSoundsData.find(sound => sound.name === 'Birds'), volume: 0.5 },
        { ...initialSoundsData.find(sound => sound.name === 'Ocean'), volume: 0.4 },
      ],
      playlist: stationsData.find(station => station.name === 'Sunshine Beat')
    },
    {
      id: 5,
      name: 'Chillhop Essentials',
      image: essentials,
      visual: images.find(img => img.name === 'Summer'),
      sounds: [
        { ...initialSoundsData.find(sound => sound.name === 'Birds'), volume: 0.2 },
        { ...initialSoundsData.find(sound => sound.name === 'Cicadas'), volume: 0.9 },
      ],
      playlist: stationsData.find(station => station.name === 'Chillhop Radio')
    },
    {
      id: 6,
      name: 'Focus',
      image: ChillStudyPreview,
      visual: images.find(img => img.name === 'Chill Study'),
      sounds: [
        { ...initialSoundsData.find(sound => sound.name === 'Forest'), volume: 0.7 },
        { ...initialSoundsData.find(sound => sound.name === 'Rain'), volume: 0.3 },
      ],
      playlist: stationsData.find(station => station.name === 'lofi hip hop beats')
    },
    {
      id: 7,
      name: 'Chillhop Radio',
      image: chillhopRadio,
      visual: images.find(img => img.name === 'Summer Sun'),
      sounds: [
        { ...initialSoundsData.find(sound => sound.name === 'Birds'), volume: 0.5 },
        { ...initialSoundsData.find(sound => sound.name === 'City Noise'), volume: 0.7 },
      ],
      playlist: stationsData.find(station => station.name === 'Chillhop Radio')
    },
    {
      id: 8,
      name: 'Late Night Vibes',
      image: lateNightVibes,
      visual: images.find(img => img.name === 'Late Night'),
      sounds: [
        { ...initialSoundsData.find(sound => sound.name === 'Rain'), volume: 0.3 },
        { ...initialSoundsData.find(sound => sound.name === 'City Noise'), volume: 0.2 },
      ],
      playlist: stationsData.find(station => station.name === 'Late Night Vibes')
    },
    {
      id: 9,
      name: 'Chill Study Beats',
      image: chillStudyBeats,
      visual: images.find(img => img.name === 'Chill Study'),
      sounds: [
        { ...initialSoundsData.find(sound => sound.name === 'Page Turning'), volume: 0.8 },
        { ...initialSoundsData.find(sound => sound.name === 'Cosy Cafe'), volume: 0.6 },
      ],
      playlist: stationsData.find(station => station.name === 'lofi hip hop beats')
    },
    {
      id: 10,
      name: 'Sunny Day',
      image: sunnyDay,
      visual: images.find(img => img.name === 'Beach'),
      sounds: [
        { ...initialSoundsData.find(sound => sound.name === 'Birds'), volume: 0.5 },
        { ...initialSoundsData.find(sound => sound.name === 'Ocean'), volume: 0.4 },
      ],
      playlist: stationsData.find(station => station.name === 'Sunshine Beat')
    },
    {
      id: 11,
      name: 'Chillhop Essentials',
      image: essentials,
      visual: images.find(img => img.name === 'Summer'),
      sounds: [
        { ...initialSoundsData.find(sound => sound.name === 'Birds'), volume: 0.2 },
        { ...initialSoundsData.find(sound => sound.name === 'Cicadas'), volume: 0.9 },
      ],
      playlist: stationsData.find(station => station.name === 'Chillhop Radio')
    },
    {
      id: 12,
      name: 'Focus',
      image: ChillStudyPreview,
      visual: images.find(img => img.name === 'Chill Study'),
      sounds: [
        { ...initialSoundsData.find(sound => sound.name === 'Forest'), volume: 0.7 },
        { ...initialSoundsData.find(sound => sound.name === 'Rain'), volume: 0.3 },
      ],
      playlist: stationsData.find(station => station.name === 'lofi hip hop beats')
    },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [presetsPerPage] = useState(10);

  const [currentPresets, setCurrentPresets] = useState([]);
  const [selectedSounds, setSelectedSounds] = useState([]);

  useEffect(() => {
    const indexOfLastPreset = currentPage * presetsPerPage;
    const indexOfFirstPreset = indexOfLastPreset - presetsPerPage;
    setCurrentPresets(presets.slice(indexOfFirstPreset, indexOfLastPreset));
  }, [currentPage, presets]);

  const handleAddClick = () => {
    setIsAddModalOpen(true);
    setSelectedSounds([]);
  };

  const handleEdit = (preset) => {
    setPresetToEdit(preset);
    setIsEditModalOpen(true);
    setSelectedSounds(preset.sounds.map(sound => sound.name));
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
    const updatedPlaylist = document.getElementById('editPresetPlaylist').value;
    const updatedVisual = document.getElementById('editPresetVisuals').value;
    const updatedSounds = selectedSounds.map((soundName) => ({
      ...initialSoundsData.find(sound => sound.name === soundName),
      volume: parseFloat(document.getElementById(`volume-${soundName}`).value),
    }));

    const presetIndex = presets.findIndex((p) => p.id === presetToEdit.id);
    const updatedPresets = [...presets];
    updatedPresets[presetIndex] = {
      ...presetToEdit,
      name: updatedName,
      playlist: stationsData.find(station => station.name === updatedPlaylist),
      visual: images.find(img => img.name === updatedVisual),
      sounds: updatedSounds,
    };
    setPresets(updatedPresets);
    setIsEditModalOpen(false);
    setPresetToEdit(null);
  };

  const handleSaveAdd = (event) => {
    event.preventDefault();
    const newPresetName = document.getElementById('newPresetName').value;
    const newPresetPlaylist = document.getElementById('newPresetPlaylist').value;
    const newPresetVisuals = document.getElementById('newPresetVisuals').value;
    const newPresetSounds = selectedSounds.map((soundName) => ({
      ...initialSoundsData.find(sound => sound.name === soundName),
      volume: parseFloat(document.getElementById(`volume-${soundName}`).value),
    }));

    const newPreset = {
      id: presets.length + 1,
      name: newPresetName,
      playlist: stationsData.find(station => station.name === newPresetPlaylist),
      visual: images.find(img => img.name === newPresetVisuals),
      sounds: newPresetSounds,
      isDefault: false
    };

    setPresets([...presets, newPreset]);
    setIsAddModalOpen(false);
  };

  const handleSoundSelection = (event) => {
    const soundName = event.target.value;
    if (event.target.checked) {
      setSelectedSounds([...selectedSounds, soundName]);
    } else {
      setSelectedSounds(selectedSounds.filter(name => name !== soundName));
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(presets.length / presetsPerPage); i++) {
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
            <h2>Add New Preset</h2>
            <form onSubmit={handleSaveAdd}>
              <label htmlFor="newPresetName">Preset Name:</label>
              <input
                type="text"
                id="newPresetName"
                name="newPresetName"
                required
              />

              <label htmlFor="newPresetPlaylist">Genere:</label>
              <select className='choose-song' id="newPresetPlaylist" name="newPresetPlaylist" required>
                {stationsData.map((station) => (
                  <option key={station.id} value={station.name}>
                    {station.name}
                  </option>
                ))}
              </select>

              <label htmlFor="newPresetVisuals">Visuals:</label>
              <select className='choose-song' id="newPresetVisuals" name="newPresetVisuals" required>
                {images.map((image) => (
                  <option key={image.src} value={image.name}>
                    {image.name}
                  </option>
                ))}
              </select>

              <h3>Sounds</h3>
              <div className="sound-list-container">
                <div className="sound-list">
                  {initialSoundsData.map((sound) => (
                    <div key={sound.id} className="sound-item">
                      <input
                        type="checkbox"
                        id={`sound-${sound.name}`}
                        value={sound.name}
                        checked={selectedSounds.includes(sound.name)}
                        onChange={handleSoundSelection}
                      />
                      <label htmlFor={`sound-${sound.name}`}>{sound.name}</label>
                      <input
                        type="number"
                        id={`volume-${sound.name}`}
                        min="0"
                        max="1"
                        step="0.1"
                        placeholder="Volume"
                        defaultValue={0.5}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <button type="submit">Save Preset</button>
            </form>
          </div>
        </div>
      )}

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

              <label htmlFor="editPresetPlaylist">Genre:</label>
              <select className='choose-song' id="editPresetPlaylist" name="editPresetPlaylist" required>
                {stationsData.map((station) => (
                  <option key={station.id} value={station.name}>
                    {station.name}
                  </option>
                ))}
              </select>

              <label htmlFor="editPresetVisuals">Visuals:</label>
              <select className='choose-song' id="editPresetVisuals" name="editPresetVisuals" required>
                {images.map((image) => (
                  <option key={image.src} value={image.name}>
                    {image.name}
                  </option>
                ))}
              </select>

              <h3>Sounds</h3>
              <div className="sound-list-container">
                <div className="sound-list">
                  {initialSoundsData.map((sound) => (
                    <div key={sound.id} className="sound-item">
                      <input
                        type="checkbox"
                        id={`sound-${sound.name}`}
                        value={sound.name}
                        checked={selectedSounds.includes(sound.name)}
                        onChange={handleSoundSelection}
                      />
                      <label htmlFor={`sound-${sound.name}`}>{sound.name}</label>
                      <input
                        type="number"
                        id={`volume-${sound.name}`}
                        min="0"
                        max="1"
                        step="0.1"
                        placeholder="Volume"
                        defaultValue={presetToEdit.sounds.find(s => s.name === sound.name)?.volume || 0.5}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <button type="submit">Save Changes</button>
            </form>
          </div>
        </div>
      )}

      <div className="preset-container">
        {currentPresets.map((preset) => (
          <div key={preset.id} className="preset-card">
            <img src={preset.visual.src} alt={preset.name} />
            <div className="preset-info-ad">
              <h3>{preset.name}</h3>
              <p>
                <GiSoundWaves />
                {preset.sounds.map((sound, index) => (
                  <span key={index}>{sound.name} ({sound.volume})</span>
                ))}
              </p>
              <div className="button-group">
                <button className='btn-edit' onClick={() => handleEdit(preset)}>EDIT</button>
                <button className='btn-dele' onClick={() => handleDelete(preset)}>DELETE</button>
              </div>
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