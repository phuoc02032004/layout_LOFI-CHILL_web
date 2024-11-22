import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Audio } from 'expo-av';

interface MusicContextType {
  sound: Audio.Sound | null;
  isPlaying: boolean;
  loadAndPlaySong: (url: string) => Promise<void>;
  pauseSong: () => Promise<void>;
  resumeSong: () => Promise<void>;
  unloadSong: () => Promise<void>;
  togglePlayPause: () => void; 
}

const MusicContext = createContext<MusicContextType | null>(null);

export const MusicProvider = ({ children }: { children: React.ReactNode }) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false); 

  useEffect(() => {
    const initSound = async () => {
      const newSound = new Audio.Sound();
      setSound(newSound);
      return () => {
        if (newSound) newSound.unloadAsync();
      };
    };
    initSound();
  }, []);

  const loadAndPlaySong = useCallback(async (url: string) => {
    if (sound) {
      try {
        await sound.unloadAsync();
        await sound.loadAsync({ uri: url });
        await sound.playAsync();
        setIsPlaying(true);
      } catch (error: any) {
        console.error('Error loading and playing song:', error);
      }
    }
  }, [sound]);

  const pauseSong = useCallback(async () => {
    if (sound && isPlaying) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  }, [sound, isPlaying]);

  const resumeSong = useCallback(async () => {
    if (sound && !isPlaying) {
      await sound.playAsync();
      setIsPlaying(true); 
    }
  }, [sound, isPlaying]);

  const unloadSong = useCallback(async () => {
    if (sound) {
      await sound.unloadAsync();
      setIsPlaying(false); 
    }
  }, [sound]);

  const togglePlayPause = useCallback(() => {
    setIsPlaying(!isPlaying); 
    if (isPlaying) {
      pauseSong();
    } else {
      resumeSong();
    }
  }, [isPlaying, pauseSong, resumeSong]);

  const contextValue: MusicContextType = {
    sound,
    isPlaying,
    loadAndPlaySong,
    pauseSong,
    resumeSong,
    unloadSong,
    togglePlayPause
  };

  return (
    <MusicContext.Provider value={contextValue}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (context === null) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};