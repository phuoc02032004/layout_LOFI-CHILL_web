import React, { useState } from 'react';
import './BGPage.css'; 
import NavbarAD from '../NavbarAdmin/Navbar';
import BeachPreview from '../../assets/images/imgBeach.jpg';
import BedroomPreview from '../../assets/images/imgBedroom.jpg';
import CampfirePreview from '../../assets/images/imgCampfire.jpg';
import ChillStudyPreview from '../../assets/images/imgChill.jpg';
import EndlessStrollPreview from '../../assets/images/imgendless.jpg';
import LatenightPreview from '../../assets/images/imglate.png';
import MorningPreview from '../../assets/images/imgMorning.png';
import SummerPreview from '../../assets/images/imgSummer.jpg';
import SummerSunPreview from '../../assets/images/imgSummerSun.jpg';

function BGPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [imageToEdit, setImageToEdit] = useState(null);
  const [imageToDelete, setImageToDelete] = useState(null);

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
  const [currentPage, setCurrentPage] = useState(1);
  const [imagesPerPage] = useState(10);

  const handleEdit = (image) => {
    setImageToEdit(image);
    setIsEditModalOpen(true);
  };

  const handleDelete = (image) => {
    setImageToDelete(image);
    setIsDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDeleteModalOpen(false);
    setImageToDelete(null);
    setIsEditModalOpen(false);
    setImageToEdit(null);
    setIsAddModalOpen(false); 
  };

  const handleConfirmDelete = () => {
    setImages(images.filter((i) => i.src !== imageToDelete.src));
    setIsDeleteModalOpen(false);
    setImageToDelete(null);
  };

  const handleSaveEdit = (event) => {
    event.preventDefault();
    const updatedName = document.getElementById('editImageName').value;

    const imageIndex = images.findIndex((i) => i.src === imageToEdit.src);

    const updatedImages = [...images];
    updatedImages[imageIndex] = { ...imageToEdit, name: updatedName };
    setImages(updatedImages);

    setIsEditModalOpen(false);
    setImageToEdit(null);
  };

  const handleAddClick = () => {
    setIsAddModalOpen(true); 
  };

  const handleSaveAdd = (event) => {
    event.preventDefault();
    const newImageName = document.getElementById('newImageName').value;
    const newImageFile = document.getElementById('newImageFile').files[0]; 

    const reader = new FileReader();
    reader.onloadend = () => {
      setImages([...images, {
        src: reader.result,
        name: newImageName,
      }]);
      setIsAddModalOpen(false);
    };
    if (newImageFile) {
      reader.readAsDataURL(newImageFile);
    }
  };

  const indexOfLastImage = currentPage * imagesPerPage;
  const indexOfFirstImage = indexOfLastImage - imagesPerPage;
  const currentImages = images.slice(indexOfFirstImage, indexOfLastImage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(images.length / imagesPerPage); i++) {
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
            <h2>Add New Image</h2>
            <form onSubmit={handleSaveAdd}>
              <label htmlFor="newImageName">Image Name:</label>
              <input
                type="text"
                id="newImageName"
                name="newImageName"
                required
              />

              <label htmlFor="newImageFile">Select Image:</label>
              <input
                type="file"
                id="newImageFile"
                name="newImageFile"
                accept="image/*"
              />

              <button type="submit">Save Image</button>
            </form>
          </div>
        </div>
      )}

      <div className="image-container"> 
        <div className="image-row">
          {currentImages.slice(0, 5).map((image, index) => (
            <div key={index} className="image-card">
              <img src={image.src} alt={image.name} />
              <div className="image-info">
                <h3>{image.name}</h3>
                <div className="button-group">
                  <button className='btn-edit' onClick={() => handleEdit(image)}>EDIT</button>
                  <button className='btn-dele' onClick={() => handleDelete(image)}>DELETE</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="image-row">
          {currentImages.slice(5, 10).map((image, index) => (
            <div key={index} className="image-card">
              <img src={image.src} alt={image.name} />
              <div className="image-info">
                <h3>{image.name}</h3>
                <div className="button-group">
                  <button className='btn-edit' onClick={() => handleEdit(image)}>EDIT</button>
                  <button className='btn-dele' onClick={() => handleDelete(image)}>DELETE</button>
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
            <div className="edit-content">
              <span className="close-modal" onClick={handleCloseModal}>×</span>
              <h2>Edit Image</h2>
              <form onSubmit={handleSaveEdit}>
                <label htmlFor="editImageName">Image Name:</label>
                <input
                  type="text"
                  id="editImageName"
                  name="editImageName"
                  defaultValue={imageToEdit?.name}
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
              <h2>Are you sure you want to delete this image?</h2>
              <button className='btn-delete' onClick={handleConfirmDelete}>DELETE</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BGPage;