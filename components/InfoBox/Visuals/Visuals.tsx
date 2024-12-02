import React, { useRef, useEffect, useState, useCallback } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native';
import { Video, ResizeMode } from 'expo-av'; 
import { getAllVisual } from '@/services/visual'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';

interface Visual {
  id: string;
  imgUrl: string;
  videoUrl: string;
  Title: string;
  filePathVideo: string;
  filePathImg: string;
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };
  updatedAt: {
    _seconds: number;
    _nanoseconds: number;
  };
}

interface VisualsProps {
  onBackgroundChange: (videoUrl: string, imageUrl: string) => void;
}

const Visuals: React.FC<VisualsProps> = ({ onBackgroundChange }) => {
  const videoRef = useRef<React.ElementRef<typeof Video> | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [visualData, setVisualData] = useState<Visual[]>([]); 
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const currentBackgroundUrl = useSelector((state: any) => state.player.currentBackgroundUrl);

  useEffect(() => {
    if (currentBackgroundUrl) {
      videoRef.current?.loadAsync({ uri: currentBackgroundUrl });
    }
  }, [currentBackgroundUrl]);

  useEffect(() => {
    const getAccessToken = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        setAccessToken(token);
      } catch (error) {
        console.error('Error retrieving access token:', error);
        Alert.alert('Error', 'Failed to retrieve access token. Please login again.');
      } finally {
        setLoading(false);
      }
    };

    getAccessToken();
  }, []);
  
  useEffect(() => {
    const fetchData = async () => {
      if (accessToken) {
        try {
          const response = await getAllVisual(accessToken); 
          if (Array.isArray(response.visual)) {
            setVisualData(response.visual);
          } else {
            console.error('Invalid visual data received from getAllVisual().', response);
          }
        } catch (error: any) {
          console.error('Error fetching visual data:', error);
          if(error.response && error.response.status === 403){
            Alert.alert('Error', 'Your access token has expired. Please login again.');
          } else {
            Alert.alert('Error', 'Failed to fetch visual data.');
          }
        }
      }
    };

    if (!loading && accessToken) {
      fetchData();
    }
  }, [accessToken, loading]);

  const handleVisualSelect = useCallback(
    (background: Visual) => {
      onBackgroundChange(background.videoUrl, background.imgUrl); 
    },
    [onBackgroundChange]
  );

  return (
    <View style={styles.container}>
      <View style={styles.visualsList}>
        {visualData.length > 0 ? (
          visualData.map((background: Visual) => ( 
            <TouchableOpacity
              key={background.id}
              style={styles.visualItem}
              onPress={() => handleVisualSelect(background)} 
            >
              <Image
                source={{ uri: background.imgUrl }}
                style={styles.visualImage}
              />
              <View style={styles.titleContainer}>
                <Text style={styles.visualName}>{background.Title}</Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.loadingText}>Loading visuals...</Text> 
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  visualsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  visualItem: {
    width: '48%',
    marginBottom: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  visualImage: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  titleContainer:{
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
    borderRadius: 10,
    alignItems: 'center',
  },
  visualName: {
    fontSize: 14,
    color: 'white',
    fontFamily: 'Poppins-Bold',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding:6,
    borderRadius: 10,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Visuals;