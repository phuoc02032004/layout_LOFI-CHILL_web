import React, { useRef, useState, useEffect } from 'react';
import { View, Dimensions, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import Loading from '../Loading/Loading';
import Header from '../Header/Header';

const HomeScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { height, width } = Dimensions.get('window');
  
  // Add explicit type for videoRef
  const videoRef = useRef<Video>(null);
  
  const [status, setStatus] = useState<AVPlaybackStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadVideo = async () => {
      if (videoRef.current) {
        try {
          await videoRef.current.playAsync(); // This will now work
          setIsLoading(false);
        } catch (error) {
          console.error('Error playing video:', error);
          setIsLoading(false); // Important: Set loading to false even on error
        }
      }
    };

    if (isFocused) {
      setIsLoading(true);
      loadVideo();
    } else {
      setIsLoading(false); // Important: reset loading on unfocus
    }
  }, [isFocused]); // Only re-run if isFocused changes

  return (
    <View style={styles.container}>
      <Header />
      {isLoading && <Loading />}
      <Video
        ref={videoRef}
        source={require('../../assets/videos/bk.mp4')}
        style={[styles.video, { height, width }]}
        resizeMode={ResizeMode.COVER}
        shouldPlay={isFocused}
        isLooping
        isMuted
        usePoster={require('../../assets/images/imgCampfire.jpg')}
        onPlaybackStatusUpdate={(status) => setStatus(status as AVPlaybackStatus)}
        onError={(error) => console.error('Video Error:', error)}
      />
      <View style={styles.overlay}>
        <Text style={styles.text}>Home</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('LoginScreen')}>
          <Text style={styles.buttonText}>Quay lại Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  video: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  text: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  button: {
    padding: 10,
    backgroundColor: 'blue',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
  },
});

export default HomeScreen;
