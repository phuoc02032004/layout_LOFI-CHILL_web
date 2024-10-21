import React, { useRef, useState, useEffect } from 'react';
import { View, Dimensions, Text, TouchableOpacity, StyleSheet, Animated, ScrollView } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { Video, ResizeMode } from 'expo-av';
import Loading from '../Loading/Loading';
import Header from '../Header/Header';
import GenreCarousel from '../Carousel/GenreCarousel';
import SongCarousel from '../Carousel/SongCarousel';
import ArtistCarousel from '../Carousel/ArtistCarousel';
import { ImageSlider } from '@/data/SliderData';
import { Songs } from '@/data/SongData';

const HomeScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { width } = Dimensions.get('window');

  const videoRef = useRef<Video>(null);
  const introduceRef = useRef(new Animated.Value(0)).current;

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadVideo = async () => {
      if (videoRef.current) {
        try {
          await videoRef.current.playAsync();
        } catch (error) {
          console.error('Error playing video:', error);
        } finally {
          setIsLoading(false); 
        }
      }
    };

    if (isFocused) {
      loadVideo();
    } 
  }, [isFocused]);

  useEffect(() => {
    Animated.timing(introduceRef, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const slideIn = introduceRef.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, 0],
  });

  const handleChillClick = () => {
    console.log('Start listening!');
  };

  return (
    <View style={styles.container}>
      <Header />
      <Video
        ref={videoRef}
        source={require('../../assets/videos/bk.mp4')}
        style={[styles.video, { width, height: '100%' }]}
        resizeMode={ResizeMode.COVER}
        shouldPlay={isFocused}
        isLooping
        isMuted
        usePoster={require('../../assets/images/imgCampfire.jpg')} 
      />
      {/* Bao bọc nội dung cần cuộn */}
      <View style={styles.contentContainer}>
        <ScrollView style={styles.scrollView}>
          {isLoading && <Loading />}
          <Animated.View style={[styles.introduce, { transform: [{ translateX: slideIn }] }]}>
            <Text style={styles.introduceP}>
              Welcome to{'\n'}LOFI - CHILL
            </Text>
            <Text style={styles.introduceDiv}>
              Choose your preferred station, visual, and sound effects to match
              your mood, and save your settings for easy access.
            </Text>
            <TouchableOpacity onPress={handleChillClick} style={styles.btnStart}>
              <Text style={styles.btnStartText}>START LISTENING</Text>
            </TouchableOpacity>
          </Animated.View>
          <Text style={styles.newsong}>NEW SONG</Text>
          <SongCarousel itemSong={Songs}/> 
          <Text style={styles.newsong}>ARTISTS</Text>
          <ArtistCarousel itemArtist={ImageSlider}/> 
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  video: {
    position: 'absolute', 
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  contentContainer: {
    flex: 1,
    marginTop: 100, // Adjust the margin to position the content container correctly
  },
  scrollView: {
    flex: 1, 
  },
  introduce: {
    color: 'white',
    textAlign: 'left',
    width: '90%',
    backgroundColor: 'rgba(21, 23, 24, 0.5)',
    borderRadius: 10,
    padding: 30,
    borderWidth: 2,
    borderColor: 'rgba(225, 255, 255, 0.3)',
    zIndex: 1,
    marginTop: 200,
    marginLeft: '5%',
    shadowColor: "#000",
    alignItems: 'center', 
    justifyContent: 'center', 
  },
  introduceP: {
    fontSize: 48,
    color: 'white',
    fontFamily: 'Poppins-Bold', 
  },
  introduceDiv: {
    marginBottom: 20,
    fontSize: 16,
    color: 'white',
    fontFamily: 'Poppins-Regular', 
    textAlign: 'center', 
  },
  btnStart: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  btnStartText: {
    color: '#1d2021',
    fontSize: 16,
    fontFamily: 'Poppins-Bold' 
  },
  newsong:{
    fontFamily: 'Poppins-Bold',
    fontSize: 30,
    color: '#fff',
    paddingLeft:30,
    paddingTop:30,
  }
});

export default HomeScreen;