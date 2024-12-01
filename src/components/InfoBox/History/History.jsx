import React, { useEffect, useState } from "react";
import "./History.css";
import { getHistory } from "../../../services/history";
import Cookies from "js-cookie";
function History() {
  const [currentPage, setCurrentPage] = useState(0);
  const [historyData, setHistoryData] = useState([]);
  const songsPerPage = 20; 

  const fetchHistory = async () => {
    const accessToken = Cookies.get("accessToken");
    if (!accessToken) {
      alert("Please log in to view your history");
      return;
    }

    try {
      const history = await getHistory();
      setHistoryData(history.data);
    } catch (error) {
      console.error("Error fetching history:", error);
      alert("Failed to load history. Please try again later.");
    }
  };

  const indexOfLastSong = (currentPage + 1) * songsPerPage;
  const indexOfFirstSong = indexOfLastSong - songsPerPage;
  const currentSongs = historyData.slice(indexOfFirstSong, indexOfLastSong);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="history-container">
      <div className="history-list">
        {currentSongs.map((song, index) => (
          <div key={index} className="history-item">
            <div className="history-song-image-container">
              <img
                src={song.songImg || ""}
                alt={song.title}
                className="song-image"
              />
            </div>
            <div className="history-song-details">
              <h4 className="history-song-name">{song.title}</h4>
              <p className="history-song-artist">Tác giả: {song.songArtist}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination"></div>
    </div>
  );
}

export default History;
