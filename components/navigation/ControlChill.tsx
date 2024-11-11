import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated, TouchableWithoutFeedback } from 'react-native';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';

import InfoBox from '../InfoBox/InfoBox';
import Preset from '../InfoBox/Presets/Preset';
import Music from '../InfoBox/Music/Music';
import Visuals from '../InfoBox/Visuals/Visuals'; 
import Sounds from '../InfoBox/Sounds/Sounds';

interface ControlChillProps {
  showInitially: boolean;
  onBackgroundChange: (videoUrl: string, imageUrl: string) => void; 
  onCurrentSongUrlChange: (url: string) => void;
}

const ControlChill: React.FC<ControlChillProps> = ({ showInitially, onBackgroundChange, onCurrentSongUrlChange }) => {
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const [isInfoBoxVisible, setInfoBoxVisible] = useState(false);
  const [showControls, setShowControls] = useState(false); 
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const animatedValue = new Animated.Value(0); 
  const iconAnimatedValue = new Animated.Value(0); 

  const handleClick = (buttonName: string) => {
    setActiveButton(buttonName);
    setInfoBoxVisible(true);
    resetAutoHideTimer();
  };

  const handleClose = () => {
    setInfoBoxVisible(false);
    setActiveButton(null);
  };

  const getContent = () => {
    switch (activeButton) {
      case 'Presets':
        return <Preset onTabPress={() => {}} />;
      case 'Music':
        return (
          <Music 
            onTabPress={() => {}} 
            onCurrentSongUrlChange={onCurrentSongUrlChange}
          /> 
        );
      case 'Visuals':
        return <Visuals onBackgroundChange={onBackgroundChange} />; 
      case 'Sounds':
        return <Sounds/>; 
      default:
        return null;
    }
  };

  const toggleControls = () => {
    setShowControls(!showControls);
    Animated.timing(animatedValue, {
      toValue: showControls ? 1 : 0, 
      duration: 200,
      useNativeDriver: true,
    }).start();
    resetAutoHideTimer(); 
  };

  const controlTranslateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 200], 
  });

  const iconTranslateX = iconAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 100], 
  });

  const resetAutoHideTimer = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const newTimeoutId = setTimeout(() => {
      setShowControls(false); 
      Animated.timing(animatedValue, {
        toValue: 1, 
        duration: 200,
        useNativeDriver: true,
      }).start();
      Animated.timing(iconAnimatedValue, {
        toValue: 1, 
        duration: 300, 
        useNativeDriver: true,
      }).start();
    }, 10000);

    setTimeoutId(newTimeoutId);
  };

  const handlePressIn = () => {
    resetAutoHideTimer();
  };

  const handlePressOut = () => {
    resetAutoHideTimer();
  };

  return (
    <TouchableWithoutFeedback onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <View style={styles.container}>
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={toggleControls}
        >
          <MaterialIcons name="add" size={40} color="white" />
        </TouchableOpacity>

        <Animated.View style={[styles.controls, { transform: [{ translateX: controlTranslateX }] }]}>
          {showControls && ( 
            <View style={styles.navigationItems}>
              <TouchableOpacity style={styles.navItem} onPress={() => handleClick('Presets')}>
                <MaterialIcons name="tune" size={28} color="white" />
                <Text style={styles.navItemText}>Presets</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.navItem} onPress={() => handleClick('Music')}>
                <Ionicons name="radio-outline" size={28} color="white" />
                <Text style={styles.navItemText}>Music</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.navItem} onPress={() => handleClick('Visuals')}>
                <Ionicons name="image-outline" size={28} color="white" />
                <Text style={styles.navItemText}>Visuals</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.navItem} onPress={() => handleClick('Sounds')}>
                <Ionicons name="musical-notes-outline" size={28} color="white" />
                <Text style={styles.navItemText}>Sounds</Text>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>

        {activeButton && (
          <InfoBox
            title={activeButton}
            content={getContent()}
            onClose={handleClose}
            isVisible={isInfoBoxVisible}
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
    zIndex: 2,
  },
  controls: {
    width: 'auto',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
    padding: 5,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'column',
    position: 'absolute',
    top: -390,
    right: 20,
    overflow: 'hidden',
    zIndex: 2,
  },
  addButton: {
    position: 'absolute',
    bottom: 50,
    right: 20,
    backgroundColor: 'rgba(225, 255, 255, 0.2)',
    padding: 15,
    borderRadius: 50,
    zIndex: 3,
    transform: [{ translateX: 0 }],
  },
  navigationItems: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
  navItem: {
    backgroundColor: 'transparent',
    margin: 5,
    alignItems: 'center',
    padding: 2,
  },
  navItemText: {
    color: 'white',
    fontSize: 14,
  },
});

export default ControlChill;