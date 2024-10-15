import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './ArtistDetail.css';
import Navbar from '../../../Navbar/Navbar';
import Loading from '../../../Loading/Loading';
import Footer from '../../../footer/Footer';
import TrackList from '../../../Tracklist/Tracklist';
import ViewAllTracksButton from '../../../Tracklist/ViewAllTrack/ViewAllTrack';
import ArtistCarousel from '../../../Carousel/ArtistCarousel'

import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { IoLogoTwitter } from "react-icons/io5";
import { FaGooglePlus } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";

import winter from '../../../assets/images/winter.jpg';
import slinky from '../../../assets/images/slinky.jpg';
import night from '../../../assets/images/night.jpg';
import meadow from '../../../assets/images/Meadow.jpg';
import morning from '../../../assets/images/goodmorning.jpg';

import Aso from '../../../assets/images/Aso.jpg';
import CYGN from '../../../assets/images/CYGN.jpg';
import ivention_ from '../../../assets/images/ivention_.jpg';
import Kupla from '../../../assets/images/Kupla.jpg';
import Leavv from '../../../assets/images/Leavv.jpg';
import Makzo from '../../../assets/images/Makzo.png';
import MamaAiuto from '../../../assets/images/Mama Aiuto.jpg';
import Misha from '../../../assets/images/Misha.jpg';
import mommy from '../../../assets/images/mommy.jpg';
import PsalmTrees from '../../../assets/images/Psalm Trees.jpg';
import Sadtoi from '../../../assets/images/Sadtoi.jpg';
import SleepyFish from '../../../assets/images/Sleepy  Fish.jpg';

function ArtistDetail() {
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true);
    const { artist } = location.state;

    const tracks = [
        {
          id: 1,
          title: 'Meadows',
          artist: 'Psalm Trees',
          duration: '02:30',
          albumCover: winter,
        },
        {
          id: 2,
          title: 'Babyyy',
          artist: 'Psalm Trees',
          duration: '02:06',
          albumCover: slinky,
        },
        {
          id: 3,
          title: 'Wherever You Are',
          artist: 'Psalm Trees',
          duration: '02:06',
          albumCover: night,
        },
        {
          id: 4,
          title: 'Prayer',
          artist: 'Psalm Trees',
          duration: '02:31',
          albumCover: meadow,
        },
        {
          id: 5,
          title: 'Smooth Wit\' Any Groove',
          artist: 'FloFilz',
          duration: '02:41',
          albumCover: morning,
        },
        {
          id: 6,
          title: 'Clocks Forward',
          artist: 'Psalm Trees',
          duration: '02:21',
          albumCover: winter,
        },
        {
          id: 7,
          title: 'Lazy French Beagles',
          artist: 'Psalm Trees',
          duration: '02:48',
          albumCover: slinky,
        },
        {
          id: 8,
          title: 'Rain',
          artist: 'Psalm Trees',
          duration: '02:31',
          albumCover: night,
        },
        {
          id: 9,
          title: 'Make You Hers',
          artist: 'Psalm Trees',
          duration: '02:02',
          albumCover: meadow,
        },
        {
          id: 10,
          title: 'Céleste',
          artist: 'Psalm Trees',
          duration: '02:24',
          albumCover: morning,
        },
      ];
    
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
      

    useEffect(() => {
        window.scrollTo(0, 0); 
      }, [location.pathname]);

    useEffect(() => {
        const delay = Math.random() * 2000;
        setTimeout(() => setIsLoading(false), delay);
    }, []);

    return (
        <div>
            <div 
                className="artist-detail-bg"
                style={{
                    backgroundImage: 
                    `linear-gradient(to bottom, rgba(28, 39, 48, 0), rgba(28, 39, 48, 0.8)),
                    url(${artist.image})`
                }}
            ></div>
            <div className="artist-detail-container">
                <Navbar />
                {isLoading && <Loading />}
                <p>Artist</p>
                <h1 className='name-artist'>{artist.title}</h1>
                <p className='descrep'>{artist.description}</p>
                <div class="socialIcons">
                    <a href=""><FaFacebook /></a>
                    <a href=""><FaInstagram /></a>
                    <a href=""><IoLogoTwitter /></a>
                    <a href=""><FaGooglePlus /></a>
                    <a href=""><FaYoutube /></a>
                </div>
            </div>
            <div className='tracks'>
                <div className='name-track'>TRACKS</div>
                <TrackList tracks={tracks} />
                <ViewAllTracksButton />
            </div>

            <div class='more'>
            <div className="more-art">MORE ARTISTS</div>
            <ArtistCarousel artists={artists} />
            </div>
            <Footer />
        </div>
    );
}

export default ArtistDetail;