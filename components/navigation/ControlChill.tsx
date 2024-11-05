import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated } from 'react-native';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';

import InfoBox from '../InfoBox/InfoBox';
import Preset from '../InfoBox/Presets/Preset';
import Music from '../InfoBox/Music/Music';
import Visuals from '../InfoBox/Visuals/VisualsWrapper'; 
import Sounds from '../InfoBox/Sounds/Sounds';

interface ControlChillProps {
  showInitially: boolean;
  onBackgroundChange: (background: string) => void;
}

const ControlChill: React.FC<ControlChillProps> = ({ showInitially, onBackgroundChange }) => {
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const [isInfoBoxVisible, setInfoBoxVisible] = useState(false);
  const [showControls, setShowControls] = useState(false); 
  const animatedValue = new Animated.Value(0); 

  const handleClick = (buttonName: string) => {
    setActiveButton(buttonName);
    setInfoBoxVisible(true);
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
        return <Music onTabPress={() => {}} />;
      case 'Visuals':
        return <Visuals onBackgroundChange={onBackgroundChange} />; 
      case 'Sounds':
        return <Sounds onTabPress={() => {}} />;
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
  };

  const controlHeight = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -200], 
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.addButton} 
        onPress={toggleControls}
      >
        <MaterialIcons name="add" size={40} color="white" />
      </TouchableOpacity>

      <Animated.View style={[styles.controls, { transform: [{ translateY: controlHeight }] }]}>
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
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
    zIndex: 2,
  },
  show: {
    transform: [{ translateY: 0 }],
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