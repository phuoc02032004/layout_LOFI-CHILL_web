import React, { useState } from 'react';
import './SongPage_ad.css';
import NavbarAD from '../NavbarAdmin/Navbar';
import SongCarousel from '../../Carousel/SongCarousel';
import ArtistCarousel from '../../Carousel/ArtistCarousel';
import After_hours from '../../assets/images/After-hours.jpg';
import Friends from '../../assets/images/Friends.jpg';
import High_Beams from '../../assets/images/High-Beams.jpg';
import Stay from '../../assets/images/Stay.jpg';
import Tomorrow from '../../assets/images/Tomorrow.jpg';

import winter from '../../assets/images/winter.jpg';
import slinky from '../../assets/images/slinky.jpg';
import night from '../../assets/images/night.jpg';
import meadow from '../../assets/images/Meadow.jpg';
import morning from '../../assets/images/goodmorning.jpg';

import Aso from '../../assets/images/Aso.jpg'
import CYGN from '../../assets/images/CYGN.jpg'
import ivention_ from '../../assets/images/ivention_.jpg'
import Kupla from '../../assets/images/Kupla.jpg'
import Leavv from '../../assets/images/Leavv.jpg'
import Makzo from '../../assets/images/Makzo.png'
import MamaAiuto from '../../assets/images/Mama Aiuto.jpg'
import Misha from '../../assets/images/Misha.jpg'
import mommy from '../../assets/images/mommy.jpg'
import PsalmTrees from '../../assets/images/Psalm Trees.jpg'
import Sadtoi from '../../assets/images/Sadtoi.jpg'
import SleepyFish from '../../assets/images/Sleepy  Fish.jpg'

function SongPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [songToDeleteIndex, setSongToDeleteIndex] = useState(null);
  const [songToEditIndex, setSongToEditIndex] = useState(null);
  const [editingSong, setEditingSong] = useState(null);

  const [songs, setSongs] = useState([
    { title: 'Winter Chill', artist: 'Artist 1', image: winter, description: 'Description 1' },
    { title: 'Slinky Groove', artist: 'Artist 2', image: slinky, description: 'Description 2' },
    { title: 'Night Vibes', artist: 'Artist 3', image: night, description: 'Description 3' },
    { title: 'Meadow Peace', artist: 'Artist 4', image: meadow, description: 'Description 4' },
    { title: 'Good Morning', artist: 'Artist 5', image: morning, description: 'Description 5' },
    { title: 'After Hours', artist: 'Artist 6', image: After_hours, description: 'Description 6' },
    { title: 'Friends', artist: 'Artist 7', image: Friends, description: 'Description 7' },
    { title: 'High Beams', artist: 'Artist 8', image: High_Beams, description: 'Description 8' },
    { title: 'Stay', artist: 'Artist 9', image: Stay, description: 'Description 9' },
    { title: 'Tomorrow', artist: 'Artist 10', image: Tomorrow, description: 'Description 10' },
  ]);

  const [artists, setArtists] = useState([
    { title: 'Aso',image: Aso, description: 'Description 1' },
    { title: 'CYGN',image: CYGN, description: 'Description 2' },
    { title: 'ivention_',image: ivention_, description: 'Description 3' },
    { title: 'Kupla',image: Kupla, description: 'Description 4' },
    { title: 'Leavv',image: Leavv, description: 'Description 5' },
    { title: 'Makzo',image: Makzo, description: 'Description 6' },
    { title: 'Mama Aiuto',image: MamaAiuto, description: 'Description 7' },
    { title: 'Misha',image: Misha, description: 'Description 8' },
    { title: 'mommy',image: mommy, description: 'Description 9' },
    { title: 'Psalm Trees', image: PsalmTrees, description: 'Description 10' },
    { title: 'Sadtoi', image: Sadtoi, description: 'Description 11' },
    { title: 'Sleepy Fish', image: SleepyFish, description: 'Description 12' },
  ]);

  const handleAddClick = () => {
    setIsAddModalOpen(true);
  };

  const handleEditClick = (index) => {
    setSongToEditIndex(index);
    setEditingSong({ ...songs[index] }); 
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setEditingSong(null); 
  };

  const handleDeleteClick = (index) => {
    setSongToDeleteIndex(index);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    const updatedSongs = [...songs];
    updatedSongs.splice(songToDeleteIndex, 1);
    setSongs(updatedSongs);
    setSongToDeleteIndex(null);
    setIsDeleteModalOpen(false);
  };

  const handleSaveEdit = (event) => {
    event.preventDefault();
    const updatedTitle = document.getElementById('editSongName').value;
    const updatedArtist = document.getElementById('editArtist').value;
    const updatedDescription = document.getElementById('editDescribe').value;

    const updatedImage = editingSong.image; 
    const updatedSongFile = editingSong.songFile; 

    setEditingSong({
      title: updatedTitle,
      artist: updatedArtist,
      image: updatedImage,
      description: updatedDescription,
      songFile: updatedSongFile,
    });

    const updatedSongs = [...songs];
    updatedSongs[songToEditIndex] = editingSong;
    setSongs(updatedSongs);

    setIsEditModalOpen(false);
    setEditingSong(null);
  };

  return (
    <div>
      <NavbarAD />
      <button className='btn-add' onClick={handleAddClick}>ADD</button>

      {/* Add Song Modal */}
      {isAddModalOpen && (
        <div className="add-modal"> 
          <div className="modal-content">
            <span className="close-modal" onClick={handleCloseModal}>×</span>
            <h2>ADD SONG</h2>
            <form className='form-box'> 
              <label htmlFor="songName">Song name:</label>
              <input type="text" id="songName" name="songName" />

              <label htmlFor="artist">Artist:</label>

              <select className="choose" id="artist" >
                <option value="india">india</option>
                <option value="pakistan">pakistan</option>
                <option value="africa">africa</option>
                <option value="china">china</option>
                <option value="other">other</option>
              </select>

              <label htmlFor="songImage">Song image:</label>
              <input type="file" id="songImage" name="songImage" />

              <label htmlFor="songFile">Song file:</label>
              <input type="file" id="songFile" name="songFile" />

              <label htmlFor="Describe">Description:</label>
              <input type="text" id="Describe" name="Describe" />

              <button type="submit">Save</button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Song Modal */}
      {isEditModalOpen && (
        <div className="edit-modal"> 
          <div className="edit-content"> 
            <span className="close-modal" onClick={handleCloseModal}>×</span>
            <h2>EDIT SONG</h2>
            <form className='form-box' onSubmit={handleSaveEdit}>
              <label htmlFor="editSongName">Song name:</label>
              <input type="text" 
                id="editSongName" 
                name="editSongName" 
                value={editingSong.title}
                onChange={(e) => setEditingSong({ ...editingSong, title: e.target.value })} 
              />

              <label htmlFor="editArtist">Artist:</label>
              <select className="choose" id="editArtist">
                <option value="india">india</option>
                <option value="pakistan">pakistan</option>
                <option value="africa">africa</option>
                <option value="china">china</option>
                <option value="other">other</option>
              </select>

              <label htmlFor="editSongImage">Song image:</label>
              <input type="file" id="editSongImage" name="editSongImage" />

              <label htmlFor="editSongFile">Song file:</label>
              <input type="file" id="editSongFile" name="editSongFile" />

              <label htmlFor="editDescribe">Description:</label>
              <input type="text" id="editDescribe" name="editDescribe" value={editingSong.description} onChange={(e) => setEditingSong({ ...editingSong, description: e.target.value })} />

              <button type="submit">Save</button>
            </form>
          </div>
        </div>
      )}

      <div className='wrapper-all'>
        <div className="header-row">
          <div className="thumbnail-header">THUMBNAIL</div>
          <div className="name-song-header">NAME SONG</div>
          <div className="button-header">BUTTON</div>
        </div>

        <div className='image-container-song'>
          {songs.map((song, index) => (
            <div key={index} className='image-row-song'>
              <img src={song.image} alt={song.title} className="image-song" />
              <div className='image-name-song'>{song.title}</div>
              <div className="btn">
                <div className="btn-fix" onClick={() => handleEditClick(index)}>EDIT</div>
                <div className="btn-del" onClick={() => handleDeleteClick(index)}>DELETE</div>
              </div>
            </div>
          ))}
        </div>

        <div className="name_a">New Song</div>
        <SongCarousel songs={songs} /> 

        <div className="name_a">Artist</div>
        <ArtistCarousel artists={artists} /> 

        {isDeleteModalOpen && (
          <div className="delete-modal"> 
            <div className="delete-content">
              <span className="close-modal" onClick={handleCloseModal}>×</span>
              <h2>Are you sure you want to delete this song?</h2>
              <button className='btn-delete' onClick={handleConfirmDelete}>DELETE</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SongPage;