import React, { createContext, useState, useRef, useEffect } from 'react';
import '../InfoBox/Sounds/Sounds.css';

export const MusicPlayerContext = createContext();

export const MusicPlayerProvider = ({ children }) => {
    const [currentSongUrl, setCurrentSongUrl] = useState('');
    const [currentTime, setCurrentTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(50);
    const audioRef = useRef(null);
    const [currentSongTitle, setCurrentSongTitle] = useState('');
    const [currentSongArtist, setCurrentSongArtist] = useState('');
    const [currentImgSong, setCurrentImgSong] = useState('');
    const [playlist, setPlaylist] = useState([]); 
    const [currentIndex, setCurrentIndex] = useState(0);

    const playSong = (url, title, artist, img, startTime = 0, playlistData = [], index = 0) => {
        if (playlistData.length > 0) {
            setPlaylist(playlistData); 
            setCurrentIndex(index); 
        }
        if (currentSongUrl !== url) {
            setCurrentSongUrl(url);
            setCurrentSongTitle(title);
            setCurrentSongArtist(artist);
            setCurrentImgSong(img);
            setCurrentTime(startTime);
        }
        setIsPlaying(true);
    };

    const playNextSong = () => {
        if (playlist.length > 0 && currentIndex < playlist.length - 1) {
            const nextIndex = currentIndex + 1;
            const nextSong = playlist[nextIndex];
            setCurrentIndex(nextIndex);
            playSong(
                nextSong.url,
                nextSong.title,
                nextSong.artist,
                nextSong.img,
                0,
                playlist,
                nextIndex
            );
        } else {
            setIsPlaying(false);
        }
    };

    const pauseSong = () => {
        setIsPlaying(false);
    };

    const resumeSong = () => {
        setIsPlaying(true);
    };

    const adjustVolume = (newVolume) => {
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume / 100;
        }
    };

    useEffect(() => {
        if (audioRef.current) {
            if (currentSongUrl && audioRef.current.src !== currentSongUrl) {
                audioRef.current.src = currentSongUrl;
                audioRef.current.currentTime = currentTime;
            }

            audioRef.current.volume = volume / 100;

            // Phát hoặc dừng nhạc tùy thuộc trạng thái
            if (isPlaying) {
                audioRef.current.play().catch((error) => {
                    console.error('Error playing audio:', error);
                });
            } else {
                audioRef.current.pause();
            }
        }
    }, [currentSongUrl, isPlaying, volume, currentTime]);

    return (
        <MusicPlayerContext.Provider
            value={{
                playSong,
                pauseSong,
                resumeSong,
                adjustVolume,
                playNextSong, 
                currentSongUrl,
                currentTime,
                isPlaying,
                volume,
                currentSongTitle,
                currentSongArtist,
                currentImgSong,
                playlist,
                setPlaylist,
                currentIndex,
            }}
        >
            {children}
            <audio
                ref={audioRef}
                onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
                onEnded={playNextSong} 
                style={{ display: 'none' }}
            />
        </MusicPlayerContext.Provider>
    );
};
