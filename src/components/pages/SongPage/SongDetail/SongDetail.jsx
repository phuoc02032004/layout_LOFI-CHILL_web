import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./SongDetail.css";
import Navbar from "../../../Navbar/Navbar";
import Loading from "../../../Loading/Loading";
import Footer from "../../../footer/Footer";
import TrackList from "../../../Tracklist/Tracklist";
import SongCarousel from "../../../Carousel/SongCarousel";
import { Link } from "react-router-dom";

import { getAllSong } from "../../../../services/song";
import { getSpecificArtist } from "../../../../services/artist";

function SongDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [song, setSong] = useState(location.state?.song || null);
  const [songs, setSongs] = useState([]);
  const [artist, setArtist] = useState(null);

  useEffect(() => {
    if (!song) {
      console.warn("Không tìm thấy dữ liệu bài hát. Đang lấy bài hát mặc định...");
      getAllSong()
        .then((allSongs) => {
          if (allSongs.length > 0) {
            setSong(allSongs[0]); 
            console.log("Bài hát mặc định:", allSongs[0]); 
            console.log("URL bài hát:", allSongs[0]?.Url); 
          } else {
            console.error("Không có bài hát nào!");
            navigate("/"); 
          }
        })
        .catch((error) => console.error("Lỗi khi lấy danh sách bài hát:", error));
    } else {
      console.log("Bài hát hiện tại:", song); 
      console.log("URL bài hát hiện tại:", song.Url); 
    }
  }, [song, navigate]);
  

  
  useEffect(() => {
    if (song?.ArtistId) {
      getSpecificArtist(song.ArtistId)
        .then((artistData) => {
          setArtist(artistData);
        })
        .catch((error) => {
          console.error("Lỗi khi lấy thông tin nghệ sĩ:", error);
        });
    }
  }, [song]);

  
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const allSongs = await getAllSong();
        setSongs(allSongs); // Gán danh sách bài hát vào state
      } catch (error) {
        console.error("Lỗi khi lấy danh sách bài hát:", error);
      } finally {
        setIsLoading(false); // Tắt trạng thái tải
      }
    };

    fetchSongs();
  }, []);


  if (!song) return null;

  return (
    <div>
      <div
        className="song-detail-bg"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(28, 39, 48, 0), rgba(28, 39, 48, 0.8)),
                    url(${song.image})`,
        }}
      ></div>
      <div className="song-detail-container">
        <Navbar />
        {isLoading && <Loading />}
        <div className="info-song-here">
          <img className="image-song-here" src={song.image} alt={song.title} />
          <div className="detail">
            <h1 className="name-song">{song.title}</h1>
            <p className="name-artist-h">{artist?.name || "Unknown Artist"}</p>
            <p className="descrep">{song.description}</p>
      
            <button
              className="btn-start"
              onClick={() => {
                const audio = new Audio(song.Url);
                audio.play()
                  .then(() => console.log("Đang phát nhạc..."))
                  .catch((error) => console.error("Lỗi khi phát nhạc:", error));
              }}
            >
              START
            </button>
          </div>
        </div>
      </div>

      
      <div className="art-here">
        <div className="art-here-1">ARTIST</div>
        <div className="art-here-2">
          {artist ? (
            <Link
              to={`/ArtistPage/${artist.id}`}
              key={artist.id}
              className="artist-card-pa"
              state={{ artist }}
            >
              <img
                src={artist.image}
                className="art-image-here"
                alt={artist.name}
              />
              <div className="art-name-here">{artist.name}</div>
            </Link>
          ) : (
            <p>Loading artist...</p>
          )}
        </div>
      </div>

      
      <div className="tracks">
        <div className="name-track">TRACKS</div>
        <TrackList
          tracks={[
            {
              id: song.id,
              albumCover: song.image,
              title: song.title,
              artist: artist?.name || "Unknown Artist",
              duration: song.duration || "3:45",
              url: song.url, // Truyền URL vào TrackList
            },
          ]}
        />
      </div>

      
      <div className="more">
        <div className="more-art">MORE SONGS</div>
        <SongCarousel songs={songs} />
      </div>
      <Footer />
    </div>
  );
}

export default SongDetail;
