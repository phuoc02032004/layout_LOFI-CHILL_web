import React, { useState, useEffect } from "react";
import { generateSlug } from '../../lib/helper/helper';
import { useParams } from 'react-router-dom';
import './detail.css';
import { songs, artists, details_song } from '../pages/HomePage';
import Navbar from '../Navbar/Navbar';
import Loading from '../Loading/Loading'; // Nếu cần hiển thị loading
import Footer from "../footer/Footer";

const Details = () => {
  const { slug } = useParams(); // Lấy slug từ URL
  const [isLoading, setIsLoading] = useState(true); // Trạng thái loading

  // Tìm bài hát và tác giả dựa trên slug
  const song = songs?.find((song) => {
    const artist = artists.find((artist) => artist.id === song.artistId);
    if (!artist) return false;

    const combinedSlug = generateSlug(`${artist.title} ${song.title}`);
    return combinedSlug === slug; // So sánh slug đã tạo với slug từ URL
  });

  // Tìm nghệ sĩ tương ứng với bài hát
  const artist = artists.find((artist) => artist.id === song?.artistId);
  const songDetails = details_song.find(
    (detail) => detail.title === song?.title && detail.artist === artist?.title
  );

  useEffect(() => {
    const handleScroll = () => {
      const pageContent = document.querySelector('.pageContent');
      // Kiểm tra sự tồn tại của pageContent trước khi truy cập classList
      if (pageContent) {
        if (window.scrollY > 100) { // Số pixel cuộn bạn muốn kiểm tra
          pageContent.classList.add('scrolled');
        } else {
          pageContent.classList.remove('scrolled');
        }
      }
    };
    // Thêm sự kiện cuộn
    window.addEventListener('scroll', handleScroll);

    // Xóa sự kiện khi component bị unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Chỉ chạy một lần khi component được mount

  useEffect(() => {
    setIsLoading(false); // Chuyển trạng thái loading thành false sau khi tải xong
  }, []);

  // Nếu không tìm thấy bài hát hoặc nghệ sĩ
  if (!song || !artist || !songDetails) {
    return <p>Bài hát hoặc thông tin không tồn tại!</p>;
  }

  // Nếu đang loading, hiển thị Loading component
  if (isLoading) {
    return <Loading />; // Hiển thị loading nếu cần
  }

  // Hiển thị thông tin bài hát, nghệ sĩ, và description từ details_song
  return (
    <>
      <Navbar />
      <div className="mainContent">
        <div className="pageContent">
          <div className="top-section">
            <div className="song-container">
              <div className="col section">
                <div className="flex gap-32 m-columns">
                  <div className="song-image">
                    <img src={song.image} alt={song.title} />
                  </div>

                  <div className="release-feat-props">
                    <div className="song-release-date underline mb-0">
                      Ngày phát hành: {songDetails.releaseDate}
                    </div>
                    <div className="song-title">{song.title}</div>

                    <div className="song-details">
                      <h3>Chi tiết bài hát</h3>
                      <div className="song-description">
                        {songDetails.description}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="artist_container">
            <h2 className="artist-title">Nghệ sĩ: {artist.title}</h2>
            <img src={artist.image} alt={artist.title} className="artist-image" />
          </div>

          <Footer />
        </div>
      </div>
    </>
  );
};

export default Details;
