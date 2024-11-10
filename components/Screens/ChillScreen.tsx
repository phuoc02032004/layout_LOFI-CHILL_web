import React, { useRef, useState, useEffect } from 'react';
import { View, Dimensions, Text, StyleSheet } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import Loading from '../Loading/Loading';
import Header from '../Header/Header';
import ControlChill from '../navigation/ControlChill'; 
import PlayingBar from '../PlayingBar/PlayingBar';

const ChillScreen: React.FC = () => {
  const { height, width } = Dimensions.get('window');
  const videoRef = useRef<Video>(null);
  const [status, setStatus] = useState<AVPlaybackStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [videoSource, setVideoSource] = useState<string>(require('../../assets/videos/bk.mp4')); 
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null); 

  useEffect(() => {
    const loadVideo = async () => {
      if (videoRef.current) {
        try {
          await videoRef.current.playAsync();
          setIsLoading(false);
        } catch (error) {
          console.error('Error playing video:', error);
          setIsLoading(false); 
        }
      }
    };

    setIsLoading(true);
    loadVideo();
  }, [videoSource, backgroundImage]);

  const handleBackgroundChange = (newVideoUrl: string, newImageUrl: string) => {
    setVideoSource(newVideoUrl);
    setBackgroundImage(newImageUrl);
  };

  return (
    <View style={styles.container}>
      <Header />
      {isLoading && <Loading />}
      <Video
        ref={videoRef}
        source={{ uri: videoSource }} 
        style={[styles.video, { height, width }]}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping
        isMuted
        usePoster={backgroundImage ? { uri: backgroundImage } : require('../../assets/images/imgCampfire.jpg')} 
        onPlaybackStatusUpdate={(status) => setStatus(status as AVPlaybackStatus)}
        onError={(error) => console.error('Video Error:', error)}
      />

      <PlayingBar/>
      <ControlChill 
        showInitially={true}
        onBackgroundChange={handleBackgroundChange} 
      />
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
  },
  text: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: 'white',
  },
});

export default ChillScreen;