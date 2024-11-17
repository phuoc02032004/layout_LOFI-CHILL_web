import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { getAllSound, createSound, updateSound, deleteSound } from '@/services/sound';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';

interface Sound {
  id: string;
  Description: string;
  filePath: string;
  Title: string;
  url: string;
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };
  updatedAt: {
    _seconds: number;
    _nanoseconds: number;
  };
}

interface ApiResponse<T> {
  err: number;
  mes: string;
  data: T;
}

const Sounds: React.FC = () => {
  const [soundsData, setSoundsData] = useState<Sound[]>([]);
  const [soundVolumes, setSoundVolumes] = useState<{ [key: string]: number }>({});
  const [playingSounds, setPlayingSounds] = useState<string[]>([]);
  const [soundPlayers, setSoundPlayers] = useState<{ [key: string]: Audio.Sound }>({});

  useEffect(() => {
    const fetchSoundsData = async () => {
      try {
        const response = await getAllSound();
      } catch (error) {
        console.error('Error fetching sounds data:', error);
      }
    };

    const loadVolumes = async () => {
      try {
        const savedVolumesString = await AsyncStorage.getItem('soundVolumes');
        setSoundVolumes(savedVolumesString ? JSON.parse(savedVolumesString) : {});
      } catch (error) {
        console.error('Error loading sound volumes:', error);
      }
    };

    fetchSoundsData();
    loadVolumes();
  }, []);

  const handleVolumeChange = (id: string, value: number) => {
    setSoundVolumes(prevVolumes => {
      const updatedVolumes = { ...prevVolumes, [id]: value };
      AsyncStorage.setItem('soundVolumes', JSON.stringify(updatedVolumes));
      return updatedVolumes;
    });
    soundPlayers[id]?.setVolumeAsync(value);
  };

  const handlePlayPause = async (url: string) => {
    try {
      const isPlaying = playingSounds.includes(url);
      let sound: Audio.Sound = soundPlayers[url];

      if (isPlaying) {
        if (sound) {
          await sound.pauseAsync();
          console.log('Paused sound:', url);
          setPlayingSounds(prevSounds => prevSounds.filter(s => s !== url));
        }
      } else {
        if (!sound) {
          sound = new Audio.Sound();
          await sound.loadAsync({ uri: url });
          await sound.playAsync();
          setSoundPlayers(prevPlayers => ({ ...prevPlayers, [url]: sound }));
        } else {
          await sound.playAsync();
        }

        console.log('Playing sound:', url);
        setPlayingSounds(prevSounds => [...prevSounds, url]);
      }
    } catch (error) {
      console.error('Error playing or pausing sound:', error);
    }
  };

  return (
    <View style={styles.container}>
      {soundsData.length > 0 ? (
        soundsData.map(sound => (
          <View key={sound.id} style={styles.soundItem}>
            <Text style={styles.soundName}>{sound.Title}</Text>
            <TouchableOpacity onPress={() => handlePlayPause(sound.url)}>
              <Text style={styles.playPauseButton}>
                {playingSounds.includes(sound.url) ? 'Pause' : 'Play'}
              </Text>
            </TouchableOpacity>
            <Slider
              style={styles.sliderContainer}
              minimumValue={0}
              maximumValue={1}
              thumbTintColor='#000'
              minimumTrackTintColor="#FFFFFF"
              maximumTrackTintColor="#000000"
              step={0.01}
              value={soundVolumes[sound.id] || 0}
              onValueChange={value => handleVolumeChange(sound.id, value)}
            />
          </View>
        ))
      ) : (
        <Text>No sounds found.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  soundItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  soundName: {
    flex: 1,
    fontSize: 16,
    color: 'white',
    fontFamily: 'Poppins-Bold',
    zIndex: 10,
  },
  playPauseButton: {
    padding: 5,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    marginRight: 10,
    color: 'white',
    fontFamily: 'Poppins-Bold', 
    zIndex: 5, 
  },
  sliderContainer: {
    flex: 1,
    backgroundColor: '#1DB954',
    borderRadius: 10,
  },
});

export default Sounds;