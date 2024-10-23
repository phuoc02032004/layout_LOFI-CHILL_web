import React, { useState, useEffect } from 'react';
import './ArtistPage_ad.css';
import NavbarAD from '../NavbarAdmin/Navbar';
import { getAllArtist, createArtist, updateArtist, deleteArtist } from '../../../services/artist'; // Đường dẫn tới file `artist.js`

const ArtistPage_ad = () => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [artistToDelete, setArtistToDelete] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [artistToEdit, setArtistToEdit] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [artists, setArtists] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [artistsPerPage] = useState(5);

  useEffect(() => {
    fetchArtists();
  }, []);

  const fetchArtists = async () => {
    try {
      const data = await getAllArtist();
      console.log('Artists to render:', data);
      setArtists(data);
    } catch (error) {
      console.error('Error fetching artists:', error);
    }
  };



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

  const handleConfirmDelete = async () => {
    try {
      await deleteArtist(artistToDelete.id); // Gọi API xóa nghệ sĩ
      setArtists(artists.filter((a) => a.id !== artistToDelete.id)); // Cập nhật danh sách
    } catch (error) {
      console.error('Error during Visual deletion:', error);
    } finally {
      setIsDeleteModalOpen(false);
      setArtistToDelete(null);
    }
  };

  const handleSaveEdit = async (event) => {
    event.preventDefault();
    const updatedName = document.getElementById('editArtistName').value;
    const updatedDescription = document.getElementById('editArtistDescription').value;
    const updatedImageFile = document.getElementById('editArtistImage').files[0];

    try {
      await updateArtist(artistToEdit.id, updatedName, updatedDescription, updatedImageFile); // Gọi API cập nhật
      await fetchArtists();
      setIsEditModalOpen(false);
      setArtistToEdit(null);
    } catch (error) {
      console.error('Error updating artist:', error);
    }
  };

  const handleAddClick = () => {
    setIsAddModalOpen(true);
  };

  const handleSaveAdd = async (event) => {
    event.preventDefault();
    const newArtistName = document.getElementById('newArtistName').value;
    const newArtistDescription = document.getElementById('newArtistDescription').value;
    const newArtistImageFile = document.getElementById('newArtistImage').files[0];

    try {
      await createArtist(newArtistName, newArtistDescription, newArtistImageFile); // Gọi API thêm nghệ sĩ
      await fetchArtists();
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error creating artist:', error);
    }
  };

  const indexOfLastArtist = currentPage * artistsPerPage;
  const indexOfFirstArtist = indexOfLastArtist - artistsPerPage;
  const currentArtists = artists.slice(indexOfFirstArtist, indexOfLastArtist);

  // Tạo số trang
  const totalPages = Math.ceil(artists.length / artistsPerPage); // Số trang tổng
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <NavbarAD />
      <button className='btn-add' onClick={handleAddClick}>ADD</button>

      {isAddModalOpen && (
        <div className="add-modal">
          <div className="modal-content">
            <span className="close-modal" onClick={handleCloseModal}>×</span>
            <h2>Add New Artist</h2>
            <form onSubmit={handleSaveAdd}>
              <label htmlFor="newArtistName">Artist Name:</label>
              <input type="text" id="newArtistName" name="newArtistName" required />

              <label htmlFor="newArtistDescription">Description:</label>
              <textarea id="newArtistDescription" name="newArtistDescription" required />

              <label htmlFor="newArtistImage">Select Image:</label>
              <input type="file" id="newArtistImage" name="newArtistImage" accept="image/*" required />

              <button type="submit">Save Artist</button>
            </form>
          </div>
        </div>
      )}

      <div className="image-container-n">
        <div className="image-row">
          {currentArtists.map((artist, index) => (
            <div key={index} className="image-card">
              <img src={artist.image} alt={artist.title} />
              <div className="image-info">
                <h3>{artist.title}</h3>
                <h4>{artist.description}</h4>
                <div className="button-group">
                  <button className='btn-edit' onClick={() => handleEdit(artist)}>EDIT</button>
                  <button className='btn-dele' onClick={() => handleDelete(artist)}>DELETE</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={currentPage === index + 1 ? 'active' : ''}
            >
              {index + 1}
            </button>
          ))}
        </div>
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
                defaultValue={artistToEdit?.name}
                required
              />

              <label htmlFor="editArtistDescription">Description:</label>
              <textarea
                id="editArtistDescription"
                name="editArtistDescription"
                defaultValue={artistToEdit?.description}
                required
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
            <h2>Are you sure you want to delete {artistToDelete?.name}?</h2>
            <button className='btn-delete' onClick={handleConfirmDelete}>DELETE</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtistPage_ad;