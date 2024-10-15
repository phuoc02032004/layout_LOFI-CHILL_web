import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ArtistPage.css';
import Navbar from '../../Navbar/Navbar';
import Loading from '../../Loading/Loading';
import Footer from '../../footer/Footer';

// Import hình ảnh nghệ sĩ
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

function ArtistPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [artists] = useState([
        { id: 1, title: 'Aso', image: Aso, description: 'Nghệ sĩ tài năng với phong cách âm nhạc độc đáo...' },
        { id: 2, title: 'CYGN', image: CYGN, description: 'Nổi tiếng với giai điệu electronic sôi động...' },
        { id: 3, title: 'ivention_', image: ivention_, description: 'Mang đến âm hưởng experimental đầy mới lạ...' },
        { id: 4, title: 'Kupla', image: Kupla, description: 'Âm nhạc là sự kết hợp tinh tế giữa...' },
        { id: 5, title: 'Leavv', image: Leavv, description: 'Leavv mang đến âm nhạc đầy cảm xúc...' },
        { id: 6, title: 'Makzo', image: Makzo, description: 'Makzo với phong cách âm nhạc độc đáo...' },
        { id: 7, title: 'Mama Aiuto', image: MamaAiuto, description: 'Mama Aiuto nổi tiếng với...' },
        { id: 8, title: 'Misha', image: Misha, description: 'Misha mang đến âm nhạc đầy nội lực...' },
        { id: 9, title: 'mommy', image: mommy, description: 'mommy với phong cách âm nhạc đặc biệt...' },
        { id: 10, title: 'Psalm Trees', image: PsalmTrees, description: 'Psalm Trees là một nghệ sĩ...' },
        { id: 11, title: 'Sadtoi', image: Sadtoi, description: 'Sadtoi với âm nhạc đầy cảm xúc...' },
        { id: 12, title: 'Sleepy Fish', image: SleepyFish, description: 'Sleepy Fish mang đến không gian âm nhạc thư giãn...' },
    ]);
    const [currentPage, setCurrentPage] = useState(1);
    const artistsPerPage = 6;

    useEffect(() => {
        const delay = Math.random() * 2000;
        setTimeout(() => setIsLoading(false), delay);

        document.body.classList.add('artist-page-bg');
        return () => document.body.classList.remove('artist-page-bg');
    }, []);

    const indexOfLastArtist = currentPage * artistsPerPage;
    const indexOfFirstArtist = indexOfLastArtist - artistsPerPage;
    const currentArtists = artists.slice(indexOfFirstArtist, indexOfLastArtist);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const pageNumbers = Array.from({ length: Math.ceil(artists.length / artistsPerPage) }, (_, i) => i + 1);

    return (
        <div className='artists-container'>
            {isLoading && <Loading />}
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
