import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Presets } from '@/data/PresetData';

interface PresetProps {
  onTabPress: (content: React.ReactNode) => void;
}

const Preset: React.FC<PresetProps> = ({ onTabPress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {Presets.map((preset) => (
          <View key={preset.id} style={styles.presetBox}>
            <Image source={preset.image} style={styles.presetImage} />
            <TouchableOpacity
              style={styles.titleContainer}
              onPress={() => onTabPress(<Text>Nội dung {preset.name}</Text>)}
            >
              <Text style={styles.presetName}>{`${preset.name}`}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  grid: {
    flexDirection: 'row', // Arrange elements in a row
    flexWrap: 'wrap', // Allow elements to wrap onto the next line if needed
    justifyContent: 'space-between', // Distribute elements evenly with space between them
  },
  presetBox: {
    width: '48%', // Each box takes up 48% of the available width
    marginBottom: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 5,
  },
  presetImage: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
  },
  titleContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    borderRadius: 10,
    alignItems: 'center',
  },
  presetName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default Preset;