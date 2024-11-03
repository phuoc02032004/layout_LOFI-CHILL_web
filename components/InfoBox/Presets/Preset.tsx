import React from 'react';
import { View, Text, Button } from 'react-native';
import { Presets } from '@/data/PresetData';

interface PresetProps {
  onTabPress: (content: React.ReactNode) => void;
}

const Preset: React.FC<PresetProps> = ({ onTabPress }) => {
  return (
    <View>
      <Text>Preset Screen</Text>
      <Button title="Show Preset 1" onPress={() => onTabPress(<Text>Nội dung Preset 1</Text>)} />
      <Button title="Show Preset 2" onPress={() => onTabPress(<Text>Nội dung Preset 2</Text>)} />
    </View>
  );
};

export default Preset;
