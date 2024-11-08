import { StyleSheet, Text, View, TouchableOpacity, Animated, PanResponder } from 'react-native';
import Slider from '@react-native-community/slider';
import React, { useState, useRef, useEffect } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

const PlayingBar = () => {
  const [isPlaying, setIsPlaying] = useState(false); 
  const [volume, setVolume] = useState(0.5); 
  const [showSlider, setShowSlider] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false); 
  const sliderRef = useRef<Animated.Value>(new Animated.Value(0)); 
  const panRef = useRef<Animated.Value>(new Animated.Value(0)); 
  const [isTouched, setIsTouched] = useState(false); 

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (value: number) => { 
    setVolume(value);
  };

  const handleShowSlider = () => {
    setShowSlider(true);
    Animated.timing(sliderRef.current, {
      toValue: 1, 
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handleHideSlider = () => {
    setShowSlider(false);
    Animated.timing(sliderRef.current, {
      toValue: 0, 
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const sliderTranslateY = sliderRef.current.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -100], 
  });

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponderCapture: () => true, 
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      setIsTouched(true); 
      Animated.timing(panRef.current, {
        toValue: 0, 
        duration: 300, 
        useNativeDriver: true,
      }).start();
    },
    onPanResponderRelease: () => {
      setIsTouched(false); 
    },
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!isTouched) {
        Animated.timing(panRef.current, {
          toValue: -300, 
          duration: 300,
          useNativeDriver: true,
        }).start();
        setIsCollapsed(true); 
      }
    }, 5000); 

    return () => clearTimeout(timeoutId);
  }, [isTouched]);

  const panTranslateX = panRef.current.interpolate({
    inputRange: [-300, 0],
    outputRange: [-300, 0],
  });

  const handlePress = () => {
    Animated.timing(panRef.current, {
      toValue: 0, 
      duration: 300,
      useNativeDriver: true,
    }).start();
    setIsCollapsed(false); 
  };

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Animated.View 
      style={[styles.container, { transform: [{ translateX: panTranslateX }] }]}

      {...panResponder.panHandlers}
      onStartShouldSetResponder={() => true}
      onResponderGrant={handlePress} 
    >
      {!isCollapsed ? (
        <View style={styles.playingInfo}>
          <Text style={styles.songTitle}>Tên Bài Hát</Text>
          <Text style={styles.artistName}>Tên Tác Giả</Text>
        </View>
      ) : (
        <TouchableOpacity onPress={handleToggleCollapse} style={styles.toggleButton}>
          <Icon name="play" size={30} color="white" />
        </TouchableOpacity>
      )}

      {!isCollapsed && (
        <View style={styles.controls}>
          <TouchableOpacity onPress={handlePlayPause} style={styles.controlButton}>
            <Icon name={isPlaying ? 'pause' : 'play'} size={20} color="white" />
          </TouchableOpacity>

          <TouchableOpacity onPress={showSlider ? handleHideSlider : handleShowSlider} style={styles.controlButton}>
            <Icon name="volume-up" size={20} color="white" />
          </TouchableOpacity>

          {showSlider && (
            <Animated.View style={[styles.volumeSliderContainer, { transform: [{ translateY: sliderTranslateY }] }]}>
              <Slider
                style={styles.volumeSlider}
                minimumValue={0}
                maximumValue={1}
                step={0.1}
                value={volume}
                onValueChange={handleVolumeChange}
                minimumTrackTintColor="#fff"
                maximumTrackTintColor="#ccc"
                thumbTintColor="#fff"
              />
            </Animated.View>
          )}
        </View>
      )}

      {isCollapsed && (
        <TouchableOpacity onPress={handleToggleCollapse} style={styles.revealButton}>
          <Icon name="angle-right" size={30} color="white" />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    left: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    width: 300,
  },
  playingInfo: {
    flex: 1,
    marginRight: 10,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'Poppins-Bold'
  },
  artistName: {
    fontSize: 14,
    color: 'white',
    fontFamily: 'Poppins-Regular'
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlButton: {
    padding: 8,
    borderRadius: 5,
    marginRight: 10,
  },
  volumeSlider: {
    width: 100,
  },
  volumeSliderContainer: {
    position: 'absolute',
    top: 60, 
    left: -5,
    width: 100,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 5,
    overflow: 'hidden', 
  },
  toggleButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  revealButton: {
    position: 'absolute',
    bottom: 10,
    right: -10,
    padding: 10,
    borderRadius: 50,
  },
});

export default PlayingBar;
