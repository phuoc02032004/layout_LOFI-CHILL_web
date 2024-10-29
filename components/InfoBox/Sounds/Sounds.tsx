import React from 'react';
import { View, Text, Button } from 'react-native';

interface SoundsProps {
  onTabPress: (title: string, content: React.ReactNode) => void;
}

const Sounds: React.FC<SoundsProps> = ({ onTabPress }) => {
  return (
    <View>
      <Text>Sounds Screen</Text>
      <Button title="Show Sound 1" onPress={() => onTabPress('Sound 1', <Text>Nội dung Sound 1</Text>)} />
      <Button title="Show Sound 2" onPress={() => onTabPress('Sound 2', <Text>Nội dung Sound 2</Text>)} />
    </View>
  );
};

export default Sounds;
