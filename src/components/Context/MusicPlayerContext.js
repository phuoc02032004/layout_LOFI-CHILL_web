import React, { createContext, useState, useRef, useEffect } from 'react';
import '../InfoBox/Sounds/Sounds.css';
import { useLocation } from 'react-router-dom';


export const MusicPlayerContext = createContext();

export const MusicPlayerProvider = ({ children }) => {
    const [currentSongUrl, setCurrentSongUrl] = useState('');
    const [currentTime, setCurrentTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);
    
    const playSong = (url, startTime = 0) => {
        if (currentSongUrl !== url) {
            setCurrentSongUrl(url);
            setCurrentTime(startTime);
        }
        setIsPlaying(true);
    };

    const pauseSong = () => {
        setIsPlaying(false);
    };

    const resumeSong = () => {
        setIsPlaying(true);
    };

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.pause(); // Dừng nhạc trước khi thay đổi src
            if (currentSongUrl) {
                audioRef.current.src = currentSongUrl;
                audioRef.current.currentTime = currentTime; // Đặt lại thời gian phát
                if (isPlaying) {
                    audioRef.current.play().catch((error) => console.error('Lỗi khi phát nhạc:', error));
                }
            }
        }
    }, [currentSongUrl, isPlaying]);

    return (
        <MusicPlayerContext.Provider
            value={{
                playSong,
                pauseSong,
                resumeSong,
                currentSongUrl,
                currentTime,
                isPlaying,
            }}
        >
            {children}
            <audio
                ref={audioRef}
                onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
                onEnded={() => setIsPlaying(false)}
                style={{ display: 'none' }}
            />
        </MusicPlayerContext.Provider>
    );
};
