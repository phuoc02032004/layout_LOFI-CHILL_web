import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { getAllSound } from '@/services/sound';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';

// Interface for sound data
interface Sound {
  id: string;
  Description: string;
  filePath: string;
  title: string;
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

const Sounds: React.FC = () => {
  // State variables
  const [soundsData, setSoundsData] = useState<Sound[]>([]);
  const [soundVolumes, setSoundVolumes] = useState<{ [key: string]: number }>({});
  const [playingSounds, setPlayingSounds] = useState<string[]>([]);
  const [soundPlayers, setSoundPlayers] = useState<{ [key: string]: Audio.Sound }>({});

  // Fetch sounds data and load saved volumes on component mount
  useEffect(() => {
    const fetchSoundsData = async () => {
      try {
        const response = await getAllSound();
        setSoundsData(response.soundEffect || []);
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

  // Handle volume change for a sound
  const handleVolumeChange = (id: string, value: number) => {
    setSoundVolumes(prevVolumes => {
      const updatedVolumes = { ...prevVolumes, [id]: value };
      AsyncStorage.setItem('soundVolumes', JSON.stringify(updatedVolumes));
      return updatedVolumes;
    });

    // Update the sound player's volume
    soundPlayers[id]?.setVolumeAsync(value);
  };

  // Handle play/pause functionality for a sound
  const handlePlayPause = async (url: string) => {
    try {
      const isPlaying = playingSounds.includes(url);
      let sound: Audio.Sound = soundPlayers[url];

      if (isPlaying) {
        // Pause the sound if it's playing
        if (sound) {
          await sound.pauseAsync();
          console.log('Paused sound:', url);
          setPlayingSounds(prevSounds => prevSounds.filter(s => s !== url));
        }
      } else {
        // Create a new sound player or use the existing one
        if (!sound) {
          sound = new Audio.Sound();
          await sound.loadAsync({ uri: url });
          await sound.playAsync(); // Start playing immediately
          setSoundPlayers(prevPlayers => ({ ...prevPlayers, [url]: sound }));
        } else {
          // If sound player exists, just play it
          await sound.playAsync();
        }

        console.log('Playing sound:', url);
        setPlayingSounds(prevSounds => [...prevSounds, url]);
      }
    } catch (error) {
      console.error('Error playing or pausing sound:', error);
    }
  };

  // Render the sounds list
  return (
    <View style={styles.container}>
      {soundsData.length > 0 ? (
        soundsData.map(sound => (
          <View key={sound.id} style={styles.soundItem}>
            <Text style={styles.soundName}>{sound.title}</Text>
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
  },
  playPauseButton: {
    padding: 5,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    marginRight: 10,
    color: 'white',
    fontFamily: 'Poppins-Bold',
  },
  sliderContainer: {
    flex: 1,
    backgroundColor: '#1DB954',
    borderRadius: 10,
  },
});

export default Sounds;