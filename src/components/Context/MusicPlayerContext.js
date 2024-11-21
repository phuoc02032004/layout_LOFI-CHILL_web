import React, { createContext, useState, useRef, useEffect } from 'react';
import '../InfoBox/Sounds/Sounds.css';
import { useLocation } from 'react-router-dom';

export const MusicPlayerContext = createContext();

export const MusicPlayerProvider = ({ children }) => {
    const [currentSongUrl, setCurrentSongUrl] = useState('');
    const [currentTime, setCurrentTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(50); // Giá trị âm lượng mặc định là 50%
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

    const adjustVolume = (newVolume) => {
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume / 100; // Chuyển đổi từ 0-100 sang 0-1
        }
    };

    useEffect(() => {
        if (audioRef.current) {
            // Nếu nguồn thay đổi, đặt lại src và thời gian
            if (currentSongUrl && audioRef.current.src !== currentSongUrl) {
                audioRef.current.src = currentSongUrl;
                audioRef.current.currentTime = currentTime;
            }

            // Cập nhật âm lượng
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
                adjustVolume, // Thêm phương thức điều chỉnh âm lượng
                currentSongUrl,
                currentTime,
                isPlaying,
                volume,
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
