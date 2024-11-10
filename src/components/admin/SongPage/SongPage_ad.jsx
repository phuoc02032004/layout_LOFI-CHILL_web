import React, { useEffect, useState } from "react";
import "./SongPage_ad.css";
import {
  getAllSong,
  deleteSong,
  updateSong,
  createSong,
} from "../../../services/song";
import { getAllArtist } from "../../../services/artist";
import { getAllPlaylists } from "../../../services/playlist";
import NavbarAD from "../NavbarAdmin/Navbar";

function SongPage_ad() {
  const [songs, setSongs] = useState([]);
  const [artists, setArtists] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [songToEdit, setSongToEdit] = useState(null);
  const [songToDelete, setSongToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [songsPerPage] = useState(5);

  const fetchSongs = async () => {
    try {
      const data = await getAllSong();
      setSongs(data);
    } catch (error) {
      console.error("Error fetching songs:", error);
    }
  };

  const fetchArtistsAndPlaylists = async () => {
    try {
      const artistData = await getAllArtist();
      setArtists(artistData);

      const playlistData = await getAllPlaylists();
      setPlaylists(playlistData);
    } catch (error) {
      console.error("Error fetching artists or playlists:", error);
    }
  };

  useEffect(() => {
    fetchSongs();
    fetchArtistsAndPlaylists();
  }, []);

  const handleAddClick = () => setIsAddModalOpen(true);

  const handleEditClick = (index) => {
    setSongToEdit(songs[index]);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (index) => {
    setSongToDelete(songs[index]);
    setIsDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    try {
      console.log(
        "Deleting song with id:",
        songToDelete._id,
        "from playlist:",
        songToDelete.idPlaylist
      );
      await deleteSong(songToDelete.idPlaylist, songToDelete._id);
      setSongs(songs.filter((song) => song._id !== songToDelete._id));
      handleCloseModal();
    } catch (error) {
      console.error("Error deleting song:", error);
    }
  };

  const handleSaveEdit = async (event) => {
    event.preventDefault();
    if (!songToEdit) {
      console.error("Song data is undefined");
      return;
    }
    const title = event.target.editSongTitle.value;
    const description = event.target.editSongDescription.value;
    const genre = event.target.station.value;
    const imgFile = event.target.editSongImage.files[0];
    const musicFile = event.target.editMusicFile.files[0];
    const artist = event.target.artist.value;
    try {
      await updateSong(
        artist, 
        genre, 
        songToEdit.id, 
        title,
        description,
        imgFile,
        musicFile
      );
      alert("Song updated successfully!");
      fetchSongs();
      handleCloseModal();
    } catch (error) {
      console.error("Failed to update song:", error);
      alert("Failed to update song.");
    }
  };

  const handleSaveAdd = async (event) => {
    event.preventDefault();
    const title = document.getElementById("songName").value;
    const description = document.getElementById("Describe").value;
    const imgFile = document.getElementById("songImage").files[0];
    const musicFile = document.getElementById("songFile").files[0];
    const idPlaylist = document.getElementById("station").value;
    const artist = document.getElementById("artist").value;

    if (!title || !imgFile || !musicFile || !idPlaylist || !artist) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      await createSong(
        artist,
        idPlaylist,
        title,
        description,
        imgFile,
        musicFile
      );
      await fetchSongs();
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Error creating song:", error);
      alert("Failed to create song.");
    }
  };

  const indexOfLastSong = currentPage * songsPerPage;
  const indexOfFirstSong = indexOfLastSong - songsPerPage;
  const currentSongs = songs.slice(indexOfFirstSong, indexOfLastSong);

  const totalPages = Math.ceil(songs.length / songsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <NavbarAD />
      <button className="btn-add" onClick={handleAddClick}>
        ADD
      </button>

      {isAddModalOpen && (
        <div className="add-modal">
          <div className="modal-content">
            <span className="close-modal" onClick={handleCloseModal}>
              ×
            </span>
            <h2>ADD SONG</h2>
            <form onSubmit={handleSaveAdd}>
              <label htmlFor="songName">Song name:</label>
              <input type="text" id="songName" name="songName" required />

              <label htmlFor="Describe">Description:</label>
              <textarea
                id="Describe"
                name="Describe"
                rows="5"
                cols="40"
              ></textarea>

              <label htmlFor="songImage">Song image:</label>
              <input type="file" id="songImage" name="songImage" required />

              <label htmlFor="songFile">Song file:</label>
              <input type="file" id="songFile" name="songFile" required />

              <label htmlFor="genre">Genre:</label>
              <select className="choose" id="station" required>
                {playlists.map((playlist) => (
                  <option key={playlist.id} value={playlist.id}>
                    {playlist.name}
                  </option>
                ))}
              </select>

              <label htmlFor="artist">Artist:</label>
              <select className="choose" id="artist" required>
                {artists.map((artist) => (
                  <option key={artist.id} value={artist.id}>
                    {artist.title}
                  </option>
                ))}
              </select>

              <button type="submit">Save</button>
            </form>
          </div>
        </div>
      )}

      {/* Render song list and pagination */}
      <div className="wrapper-all">
        <div className="header-row">
          <div className="thumbnail-header">THUMBNAIL</div>
          <div className="name-song-header">NAME SONG</div>
          <div className="button-header">BUTTON</div>
        </div>
        <div className="image-container-song">
          {currentSongs.map((song, index) => (
            <div key={index} className="image-row-song">
              <img src={song.image} alt={song.title} className="image-song" />
              <div className="image-name-song">{song.title}</div>
              <div className="btn">
                <div className="btn-fix" onClick={() => handleEditClick(index)}>
                  EDIT
                </div>
                <div
                  className="btn-del"
                  onClick={() => handleDeleteClick(index)}
                >
                  DELETE
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
              className={currentPage === index + 1 ? "active" : ""}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {/* Edit modal */}
        {isEditModalOpen && (
          <div className="edit-modal">
            <div className="modal-content">
              <span className="close-modal" onClick={handleCloseModal}>
                ×
              </span>
              <h2>Edit Song</h2>
              <form onSubmit={handleSaveEdit}>
                <label htmlFor="editSongTitle">Song Name:</label>
                <input
                  type="text"
                  id="editSongTitle"
                  name="editSongTitle"
                  defaultValue={songToEdit?.title}
                  required
                />

                <label htmlFor="editSongDescription">Description:</label>
                <textarea
                  id="editSongDescription"
                  name="editSongDescription"
                  defaultValue={songToEdit?.description}
                  required
                />

                <label htmlFor="genre">Genre:</label>
                <select
                  className="choose"
                  id="station"
                  defaultValue={songToEdit?.genre} // Đặt giá trị mặc định của genre
                  required
                >
                  {playlists.map((playlist) => (
                    <option key={playlist.id} value={playlist.id}>
                      {playlist.name}
                    </option>
                  ))}
                </select>

                <label htmlFor="artist">Artist:</label>
                <select
                  className="choose"
                  id="artist"
                  defaultValue={songToEdit?.artist} // Đặt giá trị mặc định của artist
                  required
                >
                  {artists.map((artist) => (
                    <option key={artist.id} value={artist.id}>
                      {artist.title}
                    </option>
                  ))}
                </select>

                <label htmlFor="editSongImage">Select Image:</label>
                <input
                  type="file"
                  id="editSongImage"
                  name="editSongImage"
                  accept="image/*"
                />

                <label htmlFor="editMusicFile">Select Music File:</label>
                <input
                  type="file"
                  id="editMusicFile"
                  name="editMusicFile"
                  accept="audio/*"
                />

                <button type="submit">Save Changes</button>
              </form>
            </div>
          </div>
        )}

        {/* Delete modal */}
        {isDeleteModalOpen && (
          <div className="delete-modal">
            <div className="delete-content">
              <span className="close-modal" onClick={handleCloseModal}>
                ×
              </span>
              <h2>Are you sure you want to delete {songToDelete?.title}?</h2>
              <button className="btn-delete" onClick={handleConfirmDelete}>
                DELETE
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SongPage_ad;
