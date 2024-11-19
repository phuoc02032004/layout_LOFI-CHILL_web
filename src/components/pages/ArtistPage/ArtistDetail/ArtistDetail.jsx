import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./ArtistDetail.css";
import Navbar from "../../../Navbar/Navbar";
import Loading from "../../../Loading/Loading";
import Footer from "../../../footer/Footer";
import TrackList from "../../../Tracklist/Tracklist";
import ArtistCarousel from "../../../Carousel/ArtistCarousel";
import { getArtistSong, getAllArtist } from "../../../../services/artist";

function ArtistDetail() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [tracks, setTracks] = useState([]); // Danh sách bài hát
  const [artists, setArtists] = useState([]); // Danh sách nghệ sĩ
  const { artist } = location.state; // Dữ liệu nghệ sĩ từ route state

  // Lấy danh sách bài hát của nghệ sĩ
  useEffect(() => {
    const fetchArtistSongs = async () => {
      try {
        const songs = await getArtistSong(artist.id);
        console.log("Dữ liệu bài hát từ API:", songs);
        // Định dạng lại dữ liệu bài hát để phù hợp với TrackList
        const formattedTracks = songs.map((song) => ({
          id: song.id,
          albumCover: song.urlImg, // Ảnh bài hát
          title: song.Title, // Tên bài hát
          artist: artist.title, // Tên nghệ sĩ
          duration: song.duration || "3:45", // Thời lượng mặc định
          url: song.Url, // URL bài hát
        }));
        setTracks(formattedTracks);
      } catch (error) {
        console.error("Lỗi khi lấy bài hát của nghệ sĩ:", error);
      } finally {
        setIsLoading(false); // Dừng loading
      }
    };

    fetchArtistSongs();
  }, [artist.id, artist.title]);

  // Lấy danh sách tất cả nghệ sĩ
  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const allArtists = await getAllArtist();
        setArtists(allArtists);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách nghệ sĩ:", error);
      }
    };

    fetchArtists();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0); // Cuộn lên đầu trang
  }, []);

  return (
    <div>
      {/* Ảnh nền và thông tin nghệ sĩ */}
      <div
        className="artist-detail-bg"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(28, 39, 48, 0), rgba(28, 39, 48, 0.8)),
                        url(${artist.image})`,
        }}
      ></div>
      <div className="artist-detail-container">
        <Navbar />
        {isLoading && <Loading />} {/* Hiển thị Loading */}
        <p style={{ fontSize: "20px" }}>Artist</p>
        <h1 className="name-artist">{artist.title}</h1>
        <p className="descrep">{artist.description}</p>
      </div>

      {/* Danh sách bài hát */}
      <div className="tracks">
        <div className="name-track">TRACKS</div>
        {isLoading ? (
          <Loading />
        ) : tracks.length > 0 ? (
          <>
            {console.log("Dữ liệu truyền vào TrackList:", tracks)}{" "}
            {/* Kiểm tra dữ liệu */}
            <TrackList tracks={tracks} />
          </>
        ) : (
          <p className="no-tracks">No tracks available for this artist.</p>
        )}
      </div>

      {/* Các nghệ sĩ khác */}
      <div className="more">
        <div className="more-art">MORE ARTISTS</div>
        {artists.length > 0 ? (
          <ArtistCarousel artists={artists} /> // Hiển thị các nghệ sĩ khác
        ) : (
          <p>Loading artists...</p>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default ArtistDetail;
