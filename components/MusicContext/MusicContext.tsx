import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Audio } from 'expo-av';

interface MusicContextProps {
  isPlaying: boolean;
  currentSong: string | null;
  loadAndPlaySong: (url: string) => void;
  pause: () => void;
  resume: () => void;
}

interface MusicProviderProps {
  children: ReactNode; 
}

const MusicContext = createContext<MusicContextProps | undefined>(undefined);

export const MusicProvider: React.FC<MusicProviderProps> = ({ children }) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState<string | null>(null);

  useEffect(() => {
    const newSound = new Audio.Sound();
    setSound(newSound); 

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []); 

  const loadAndPlaySong = async (url: string) => {
    if (sound) {
      try {
        await sound.unloadAsync(); 
        await sound.loadAsync({ uri: url });
        await sound.playAsync();
        setIsPlaying(true);
        setCurrentSong(url);
      } catch (error) {
        console.error('Lỗi khi phát nhạc:', error);
      }
    }
  };

  const pause = async () => {
    if (sound && isPlaying) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  };

  const resume = async () => {
    if (sound && !isPlaying) {
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  return (
    <MusicContext.Provider value={{ isPlaying, currentSong, loadAndPlaySong, pause, resume }}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = (): MusicContextProps => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};
