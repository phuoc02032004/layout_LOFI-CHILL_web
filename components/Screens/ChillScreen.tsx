import React, { useRef, useState, useEffect } from 'react';
import { View, Dimensions, Text, StyleSheet } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import Loading from '../Loading/Loading';
import Header from '../Header/Header';
import ControlChill from '../navigation/ControlChill'; 
import PlayingBar from '../PlayingBar/PlayingBar';
import { useSelector } from 'react-redux';

interface ChillScreenProps {
  currentSongUrl: string;
}

const ChillScreen: React.FC<ChillScreenProps> = ({ currentSongUrl }) => {
  const { height, width } = Dimensions.get('window');
  const videoRef = useRef<Video>(null);
  const [status, setStatus] = useState<AVPlaybackStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [videoSource, setVideoSource] = useState<string>(
    'https://storage.googleapis.com/music-52602.appspot.com/Visuals/9baaf4af-b632-44cb-a3c9-65576fbe5ef6_CampfireChill.mp4?GoogleAccessId=firebase-adminsdk-fax9b%40music-52602.iam.gserviceaccount.com&Expires=16730298000&Signature=G%2BQaKtfixzhp5Htxro0Ggy96uy2c5dSEYfNev1nsNjnOx49sQTx1J1TPDDVfJZKmXNuYGYtvDYmSp5t4UmEZG%2BPMClKXuJ%2FiZaiBQ5bNjSWhZPwe6%2BYvm%2F%2FSctuXkqzPoCr33nV9bXGqZJbkM9T4ak0XkCxPMaghtQmiy%2FZX34HkwqT2hNuMdTvFaRMyq9fSqpV%2FaMdh88MiojvxeCJfTBXSEpUTrotwnkJ017hbpdKPr2NWJ9hd4LAovphkFjNDbllMBryH3YXPpiNvCXAjsUHwhgpc%2F4IiP%2FvjgYAj4ODiPIoLaVIZwTvEw43vvtJNe6MEpgYaEwLXp5uorutGZQ%3D%3D' 
  );
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null); 
  const { currentBackgroundUrl } = useSelector((state: any) => state.player);

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

  useEffect(() => {
    const loadVideo = async () => {
      if (videoRef.current && currentBackgroundUrl) {
        try {
          await videoRef.current.loadAsync({ uri: currentBackgroundUrl }); // Load video từ currentBackgroundUrl
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
  }, [currentBackgroundUrl]);
  
  const handleCurrentSongUrlChange = (url: string) => {
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

      <ControlChill 
        showInitially={true}
        onBackgroundChange={handleBackgroundChange} 
        onCurrentSongUrlChange={handleCurrentSongUrlChange}
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