import React from 'react';
import { View, Text, Button } from 'react-native';

interface MusicProps {
  onTabPress: (title: string, content: React.ReactNode) => void;
}

const Music: React.FC<MusicProps> = ({ onTabPress }) => {
  return (
    <View>
      <Text>Music Screen</Text>
      <Button title="Show Music 1" onPress={() => onTabPress('Music 1', <Text>Nội dung Music 1</Text>)} />
      <Button title="Show Music 2" onPress={() => onTabPress('Music 2', <Text>Nội dung Music 2</Text>)} />
    </View>
  );
};

export default Music;
