import React from 'react';
import { View, Text, Button } from 'react-native';

interface PresetsProps {
  onTabPress: (title: string, content: React.ReactNode) => void;
}

const Presets: React.FC<PresetsProps> = ({ onTabPress }) => {
  return (
    <View>
      <Text>Presets Screen</Text>
      <Button title="Show Preset 1" onPress={() => onTabPress('Preset 1', <Text>Nội dung Preset 1</Text>)} />
      <Button title="Show Preset 2" onPress={() => onTabPress('Preset 2', <Text>Nội dung Preset 2</Text>)} />
    </View>
  );
};

export default Presets;
