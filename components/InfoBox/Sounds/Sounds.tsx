import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
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

const Sounds: React.FC = () => {
  const [soundsData, setSoundsData] = useState<Sound[]>([]);
  const [soundVolumes, setSoundVolumes] = useState<{ [key: string]: number }>({});
  const [currentPlaying, setCurrentPlaying] = useState<string | null>(null);

  useEffect(() => {
    const fetchSoundsData = async () => {
      try {
        const response = await getAllSound();
        if (response.soundEffect) {
          setSoundsData(response.soundEffect);
        } else {
          console.error('soundEffect is undefined. API response might be invalid.');
        }
      } catch (error) {
        console.error('Failed to fetch sounds data:', error);
      }
    };

    const loadVolumes = async () => {
      try {
        const savedVolumesString = await AsyncStorage.getItem('soundVolumes');
        const savedVolumes = savedVolumesString ? JSON.parse(savedVolumesString) : {};
        setSoundVolumes(savedVolumes);
      } catch (error) {
        console.error('Failed to load saved sound volumes:', error);
      }
    };

    fetchSoundsData();
    loadVolumes();

    return () => {
      // Dọn dẹp nếu cần
    };
  }, []);

  const handleVolumeChange = (id: string, value: number) => {
    setSoundVolumes(prevVolumes => {
      const updatedVolumes = { ...prevVolumes, [id]: value };
      AsyncStorage.setItem('soundVolumes', JSON.stringify(updatedVolumes));
      return updatedVolumes;
    });

    // Không cần điều chỉnh âm lượng ở đây
    // Vì `Audio.Sound` tự động điều chỉnh âm lượng khi tải
  };

  const handlePlayPause = async (url: string) => {
    try {
      console.log('Playing sound from URL:', url);

      const sound = new Audio.Sound();

      if (currentPlaying === url) {
        // Tạm dừng âm thanh hiện tại
        await sound.pauseAsync();
        setCurrentPlaying(null);
      } else {
        // Khởi tạo và phát âm thanh
        await sound.loadAsync({ uri: url });
        await sound.playAsync();
        setCurrentPlaying(url);
      }
    } catch (error) {
      console.error('Error playing sound:', error);
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
                {currentPlaying === sound.url ? 'Pause' : 'Play'}
              </Text>
            </TouchableOpacity>
            <Slider
              style={styles.sliderContainer}
              minimumValue={0}
              maximumValue={1}
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
    padding: 20,
  },
  soundItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  soundName: {
    flex: 1,
    fontSize: 16,
  },
  playPauseButton: {
    padding: 5,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    marginRight: 10,
  },
  sliderContainer: {
    flex: 1,
  },
});

export default Sounds;