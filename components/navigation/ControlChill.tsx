import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';

import InfoBox from '../InfoBox/InfoBox';
import Presets from '../InfoBox/Presets/Presets';
import Music from '../InfoBox/Music/Music';
import Visuals from '../InfoBox/Visuals/VisualsWrapper';
import Sounds from '../InfoBox/Sounds/Sounds';

interface ControlChillProps {
  showInitially: boolean;
  onBackgroundChange: (background: string) => void;
}

const ControlChill: React.FC<ControlChillProps> = ({ showInitially, onBackgroundChange }) => {
  const [activeButton, setActiveButton] = useState<string | null>(null);
  
  const handleClick = (buttonName: string) => setActiveButton(buttonName);
  const handleClose = () => setActiveButton(null);

  const getContent = () => {
    switch (activeButton) {
      case 'Presets':
        return <Presets onTabPress={() => {}} />;
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

  return (
    <View style={[styles.navigationBar, showInitially ? styles.show : {}]}>
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

      {activeButton && (
        <InfoBox title={activeButton} content={getContent()} onClose={handleClose} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  navigationBar: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(225, 255, 255, 0.2)',
    borderRadius: 10,
    padding: 30,
    zIndex: 2,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
  },
  show: {
    transform: [{ translateY: 0 }],
  },
  navigationItems: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  navItem: {
    backgroundColor: 'transparent',
    margin: 15,
    alignItems: 'center',
    padding: 2,
  },
  navItemText: {
    color: 'white',
    fontSize: 14,
  },
});

export default ControlChill;
