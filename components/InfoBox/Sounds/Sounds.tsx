import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import Slider from '@react-native-community/slider';
import { getAllSound } from '@/services/sound';
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
  data?: T;
}

const Sounds: React.FC = () => {
  const [soundsData, setSoundsData] = useState<Sound[]>([]);
  const [soundVolumes, setSoundVolumes] = useState<{ [key: string]: number }>({});
  const [playingSounds, setPlayingSounds] = useState<string[]>([]);
  const [soundPlayers, setSoundPlayers] = useState<{ [key: string]: Audio.Sound }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSoundsData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response: ApiResponse<Sound[]> = await getAllSound();
      if (response.err === 0 && response.data) {
        setSoundsData(response.data);
      } else {
        setError(response.mes || 'Lỗi khi lấy dữ liệu âm thanh');
      }
    } catch (error: any) {
      setError(`Lỗi không xác định: ${error.message}`);
      console.error('Error fetching sounds data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadState = async () => {
      try {
        const savedVolumesString = await AsyncStorage.getItem('soundVolumes');
        const savedPlayingSoundsString = await AsyncStorage.getItem('playingSounds');
        const volumes = savedVolumesString ? JSON.parse(savedVolumesString) : {};
        const playingSounds = savedPlayingSoundsString ? JSON.parse(savedPlayingSoundsString) : [];
        console.log('Loaded volumes:', volumes);
        console.log('Loaded playing sounds:', playingSounds);
        setSoundVolumes(volumes);
        setPlayingSounds(playingSounds);
      } catch (error) {
        console.error('Error loading saved state:', error);
        Alert.alert('Error', 'Failed to load saved sound settings.'); //Alert user of load failure.
      }
    };
    fetchSoundsData();
    loadState();
  }, [fetchSoundsData]);

  useEffect(() => {
    console.log('Playing sounds updated:', playingSounds);
    const restorePlayingSounds = async () => {
      for (const soundUrl of playingSounds) {
        try {
          if (!soundPlayers[soundUrl]) {
            const soundPlayer = new Audio.Sound();
            await soundPlayer.loadAsync({ uri: soundUrl });
            await soundPlayer.setIsLoopingAsync(true); //Set to looping if needed.
            await soundPlayer.playAsync();
            setSoundPlayers(prevPlayers => ({ ...prevPlayers, [soundUrl]: soundPlayer }));
          }
        } catch (error) {
          console.error('Error restoring sound:', error);
          Alert.alert('Error', `Failed to play sound: ${soundUrl}`); // Alert user of playback failure.
        }
      }
    };

    if (playingSounds.length > 0) {
      restorePlayingSounds();
    }
  }, [playingSounds, soundPlayers]);

  const handleVolumeChange = async (url: string, value: number) => {
    console.log(`Volume change for ${url}: ${value}`);
    setSoundVolumes(prevVolumes => {
      const updatedVolumes = { ...prevVolumes, [url]: value };
      AsyncStorage.setItem('soundVolumes', JSON.stringify(updatedVolumes));
      return updatedVolumes;
    });
    try {
      if (soundPlayers[url]) {
        await soundPlayers[url].setVolumeAsync(value);
      }
    } catch (error) {
      console.error("Error setting volume:", error);
      Alert.alert("Error", "Failed to adjust volume.");
    }
  };

  const handlePlayPause = async (sound: Sound) => {
    console.log(`Play/Pause for ${sound.Title}`);
    try {
      const isPlaying = playingSounds.includes(sound.url);
      let soundPlayer = soundPlayers[sound.url];

      if (isPlaying) {
        if (soundPlayer) {
          await soundPlayer.pauseAsync();
          setPlayingSounds(prevSounds => {
            const updatedSounds = prevSounds.filter(s => s !== sound.url);
            AsyncStorage.setItem('playingSounds', JSON.stringify(updatedSounds));
            return updatedSounds;
          });
        }
      } else {
        if (!soundPlayer) {
          soundPlayer = new Audio.Sound();
          await soundPlayer.loadAsync({ uri: sound.url });
          await soundPlayer.setIsLoopingAsync(false); //Set to not loop unless specified
          await soundPlayer.playAsync();
          setSoundPlayers(prevPlayers => ({ ...prevPlayers, [sound.url]: soundPlayer }));
        } else {
          await soundPlayer.playAsync();
        }

        setPlayingSounds(prevSounds => {
          const updatedSounds = [...prevSounds, sound.url];
          AsyncStorage.setItem('playingSounds', JSON.stringify(updatedSounds));
          return updatedSounds;
        });
      }
    } catch (error) {
      console.error('Error playing or pausing sound:', error);
      Alert.alert('Error', `Failed to play/pause sound: ${sound.Title}`);
    }
  };

  const handleReset = async () => {
    console.log('Resetting sounds...');
    try {
      for (const soundUrl in soundPlayers) {
        const player = soundPlayers[soundUrl];
        if (player) {
          await player.stopAsync();
          await player.unloadAsync();
        }
      }
      setPlayingSounds([]);
      setSoundVolumes({});
      setSoundPlayers({});
      await AsyncStorage.setItem('playingSounds', JSON.stringify([]));
      await AsyncStorage.setItem('soundVolumes', JSON.stringify({}));
      fetchSoundsData(); //Refetches data after reset
    } catch (error) {
      console.error('Error resetting sounds:', error);
      Alert.alert('Error', 'Failed to reset sounds.');
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text style={{ color: 'red' }}>{error}</Text>
      ) : soundsData.length > 0 ? (
        <View>
          {soundsData.map(sound => (
            <View key={sound.url} style={styles.soundItem}>
              <Text style={styles.soundName}>{sound.Title}</Text>
              <TouchableOpacity onPress={() => handlePlayPause(sound)}>
                <Text style={styles.playPauseButton}>
                  {playingSounds.includes(sound.url) ? 'Pause' : 'Play'}
                </Text>
              </TouchableOpacity>
              <View style={styles.sliderContainer}>
                <Slider
                  style={{ flex: 1 }}
                  minimumValue={0}
                  maximumValue={1}
                  step={0.01}
                  value={soundVolumes[sound.url] || 0}
                  onValueChange={value => handleVolumeChange(sound.url, value)}
                  minimumTrackTintColor="white"
                  maximumTrackTintColor="gray"
                />
              </View>
            </View>
          ))}
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text>Không tìm thấy âm thanh nào.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#222', // Added background color for better visibility
    color: 'white' //Added color for better visibility
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
  resetButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  resetButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
});

export default Sounds;
