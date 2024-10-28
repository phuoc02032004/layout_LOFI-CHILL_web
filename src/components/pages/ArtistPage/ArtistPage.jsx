import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ArtistPage.css';
import Navbar from '../../Navbar/Navbar';
import Loading from '../../Loading/Loading';
import Footer from '../../footer/Footer';
import { getAllArtist } from '../../../services/artist'; // Import API

function ArtistPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [artists, setArtists] = useState([]); // Khởi tạo state rỗng để lưu danh sách nghệ sĩ từ API
    const artistsPerPage = 6;

    useEffect(() => {
        // Lấy dữ liệu nghệ sĩ từ API
        const fetchArtists = async () => {
            try {
                const artistsData = await getAllArtist();
                setArtists(artistsData);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu nghệ sĩ:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchArtists(); // Gọi hàm lấy dữ liệu nghệ sĩ
        document.body.classList.add('artist-page-bg');
        return () => document.body.classList.remove('artist-page-bg');
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0); 
    }, []); 

    const indexOfLastArtist = currentPage * artistsPerPage;
    const indexOfFirstArtist = indexOfLastArtist - artistsPerPage;
    const currentArtists = artists.slice(indexOfFirstArtist, indexOfLastArtist);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const pageNumbers = Array.from({ length: Math.ceil(artists.length / artistsPerPage) }, (_, i) => i + 1);

    return (
        <div className='artists-container'>
            {isLoading && <Loading />} {/* Hiển thị màn hình Loading khi đang fetch dữ liệu */}
            <Navbar />
            <div className="artists-grid">
                <h1 className="title">Featured Artists</h1>
                <div className="grid">
                    {currentArtists.map((artist) => (
                        <Link 
                            to={`/ArtistPage/${artist.id}`} 
                            key={artist.id} 
                            className="artist-card-pa"
                            state={{ artist }}
                        >
                            <img src={artist.image} alt={artist.title} className="artist-image" />
                            <div className="artist-title">{artist.title}</div>
                        </Link>
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
            </div>
            <Footer />
        </div>
    );
}

export default ArtistPage;
