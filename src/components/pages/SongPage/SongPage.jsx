import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SongPage.css";
import Navbar from "../../Navbar/Navbar";
import Loading from "../../Loading/Loading";
import Footer from "../../footer/Footer";
import { Link } from "react-router-dom";

function SongPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [songs, setSongs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const songsPerPage = 6;

  const fetchSongs = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3002/api/v1/song/getAllSong"
      );
      const data = response.data.map((song) => ({
        id: song.id,
        title: song.Title,
        image: song.urlImg,
        idPlaylist: song.idPlaylist,
        description: song.description,
        ArtistId: song.ArtistId,
        url: song.Url,
      }));
      setSongs(data);
    } catch (error) {
      console.error("Error fetching music:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSongs(); 
    document.body.classList.add("song-page-bg");
    return () => {
      document.body.classList.remove("song-page-bg");
    };
  }, []);

  const indexOfLastSong = currentPage * songsPerPage;
  const indexOfFirstSong = indexOfLastSong - songsPerPage;
  const currentSongs = songs.slice(indexOfFirstSong, indexOfLastSong);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(songs.length / songsPerPage); i++) {
    pageNumbers.push(i);
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="songs-container">
      {isLoading && <Loading />}
      <Navbar />
      <div className="songs-grid">
        <h1 className="title">SONGS</h1>
        <div className="grid">
          {currentSongs.map((song) => (
            <Link
              to={`/SongPage/${song.id}`}
              key={song.id}
              className="song-card-pa"
              state={{ song }}
            >
              <img src={song.image} alt={song.title} className="song-image" />
              <div className="song-title-p">{song.title}</div>
            </Link>
          ))}
        </div>
        <div className="pagination">
          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={currentPage === number ? "active" : ""}
            >
              {number}
            </button>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default SongPage;
