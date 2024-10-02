import React, { useState } from 'react';
import './ArtistPage_ad.css';
import Navbar from '../NavbarAdmin/Navbar';
import Aso from '../../assets/images/Aso.jpg';
import CYGN from '../../assets/images/CYGN.jpg';
import ivention_ from '../../assets/images/ivention_.jpg';
import Kupla from '../../assets/images/Kupla.jpg';
import Leavv from '../../assets/images/Leavv.jpg';
import Makzo from '../../assets/images/Makzo.png';
import MamaAiuto from '../../assets/images/Mama Aiuto.jpg';
import Misha from '../../assets/images/Misha.jpg';
import mommy from '../../assets/images/mommy.jpg';
import PsalmTrees from '../../assets/images/Psalm Trees.jpg';
import Sadtoi from '../../assets/images/Sadtoi.jpg';
import SleepyFish from '../../assets/images/Sleepy  Fish.jpg';

const ArtistPage_ad = () => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [artistToDelete, setArtistToDelete] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [artistToEdit, setArtistToEdit] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [artists, setArtists] = useState([
    { title: 'Aso', image: Aso, description: 'Description 1' },
    { title: 'CYGN', image: CYGN, description: 'Description 2' },
    { title: 'ivention_', image: ivention_, description: 'Description 3' },
    { title: 'Kupla', image: Kupla, description: 'Description 4' },
    { title: 'Leavv', image: Leavv, description: 'Description 5' },
    { title: 'Makzo', image: Makzo, description: 'Description 6' },
    { title: 'Mama Aiuto', image: MamaAiuto, description: 'Description 7' },
    { title: 'Misha', image: Misha, description: 'Description 8' },
    { title: 'mommy', image: mommy, description: 'Description 9' },
    { title: 'Psalm Trees', image: PsalmTrees, description: 'Description 10' },
    { title: 'Sadtoi', image: Sadtoi, description: 'Description 11' },
    { title: 'Sleepy Fish', image: SleepyFish, description: 'Description 12' },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [artistsPerPage] = useState(10);

  const handleEdit = (artist) => {
    setArtistToEdit(artist);
    setIsEditModalOpen(true);
  };

  const handleDelete = (artist) => {
    setArtistToDelete(artist);
    setIsDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDeleteModalOpen(false);
    setArtistToDelete(null);
    setIsEditModalOpen(false);
    setArtistToEdit(null);
    setIsAddModalOpen(false);
  };

  const handleConfirmDelete = () => {
    setArtists(artists.filter((a) => a.title !== artistToDelete.title));
    setIsDeleteModalOpen(false);
    setArtistToDelete(null);
  };

  const handleSaveEdit = (event) => {
    event.preventDefault();
    const updatedTitle = document.getElementById('editArtistName').value;
    const updatedDescription = document.getElementById('editArtistDescription').value;
    const updatedImageFile = document.getElementById('editArtistImage').files[0];

    const artistIndex = artists.findIndex((a) => a.title === artistToEdit.title);

    const updatedArtists = [...artists];

    if (updatedImageFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updatedArtists[artistIndex] = {
          title: updatedTitle,
          image: reader.result,
          description: updatedDescription,
        };
        setArtists(updatedArtists);
        setIsEditModalOpen(false);
        setArtistToEdit(null);
      };
      reader.readAsDataURL(updatedImageFile);
    } else {
      updatedArtists[artistIndex] = {
        ...artistToEdit,
        title: updatedTitle,
        description: updatedDescription,
      };
      setArtists(updatedArtists);
      setIsEditModalOpen(false);
      setArtistToEdit(null);
    }
  };

  const handleAddClick = () => {
    setIsAddModalOpen(true);
  };

  const handleSaveAdd = (event) => {
    event.preventDefault();
    const newArtistName = document.getElementById('newArtistName').value;
    const newArtistDescription = document.getElementById('newArtistDescription').value;
    const newArtistImageFile = document.getElementById('newArtistImage').files[0];

    const reader = new FileReader();
    reader.onloadend = () => {
      setArtists([...artists, {
        title: newArtistName,
        image: reader.result,
        description: newArtistDescription,
      }]);
      setIsAddModalOpen(false);
    };
    if (newArtistImageFile) {
      reader.readAsDataURL(newArtistImageFile);
    }
  };

  const indexOfLastArtist = currentPage * artistsPerPage;
  const indexOfFirstArtist = indexOfLastArtist - artistsPerPage;
  const currentArtists = artists.slice(indexOfFirstArtist, indexOfLastArtist);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(artists.length / artistsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div>
      <Navbar />
      <button className='btn-add' onClick={handleAddClick}>ADD</button> 

      {isAddModalOpen && (
        <div className="add-modal">
          <div className="modal-content">
            <span className="close-modal" onClick={handleCloseModal}>×</span>
            <h2>Add New Artist</h2>
            <form onSubmit={handleSaveAdd}>
              <label htmlFor="newArtistName">Artist Name:</label>
              <input
                type="text"
                id="newArtistName"
                name="newArtistName"
                required
              />

              <label htmlFor="newArtistDescription">Description:</label>
              <textarea
                id="newArtistDescription"
                name="newArtistDescription"
              />

              <label htmlFor="newArtistImage">Select Image:</label>
              <input
                type="file"
                id="newArtistImage"
                name="newArtistImage"
                accept="image/*"
              />

              <button type="submit">Save Artist</button>
            </form>
          </div>
        </div>
      )}

      <div className="artist-container">
        <div className="artist-row">
          {currentArtists.slice(0, 5).map((artist, index) => (
            <div key={index} className="artist-card">
              <img src={artist.image} alt={artist.title} />
              <div className="artist-info">
                <h3>{artist.title}</h3>
                <div className="button-group">
                  <button className='btn-edit' onClick={() => handleEdit(artist)}>EDIT</button>
                  <button className='btn-dele' onClick={() => handleDelete(artist)}>DELETE</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="artist-row">
          {currentArtists.slice(5, 10).map((artist, index) => (
            <div key={index} className="artist-card">
              <img src={artist.image} alt={artist.title} />
              <div className="artist-info">
                <h3>{artist.title}</h3>
                <div className="button-group">
                  <button className='btn-edit' onClick={() => handleEdit(artist)}>EDIT</button>
                  <button className='btn-dele' onClick={() => handleDelete(artist)}>DELETE</button>
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

        {isEditModalOpen && (
          <div className="edit-modal">
            <div className="modal-content">
              <span className="close-modal" onClick={handleCloseModal}>×</span>
              <h2>Edit Artist</h2>
              <form onSubmit={handleSaveEdit}>
                <label htmlFor="editArtistName">Artist Name:</label>
                <input
                  type="text"
                  id="editArtistName"
                  name="editArtistName"
                  defaultValue={artistToEdit?.title}
                  required
                />

                <label htmlFor="editArtistDescription">Description:</label>
                <textarea
                  id="editArtistDescription"
                  name="editArtistDescription"
                  defaultValue={artistToEdit?.description}
                />

                <label htmlFor="editArtistImage">Select Image:</label>
                <input
                  type="file"
                  id="editArtistImage"
                  name="editArtistImage"
                  accept="image/*"
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
              <h2>Are you sure you want to delete {artistToDelete?.title}?</h2>
              <button className='btn-delete' onClick={handleConfirmDelete}>DELETE</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtistPage_ad;