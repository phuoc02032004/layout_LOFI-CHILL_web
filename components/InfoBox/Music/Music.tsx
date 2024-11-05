import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Button } from 'react-native';

interface MusicProps {
  onTabPress: (title: string, content: React.ReactNode) => void;
}

const Music: React.FC<MusicProps> = ({ onTabPress }) => {
  return (
    <View>
      <Text>Sounds Screen</Text>
      <Button title="Show Sound 1" onPress={() => onTabPress('Sound 1', <Text>Nội dung Sound 1</Text>)} />
      <Button title="Show Sound 2" onPress={() => onTabPress('Sound 2', <Text>Nội dung Sound 2</Text>)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
    padding: 20,
  },
  musicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#333',
    borderRadius: 10,
  },
  iconContainer: {
    marginRight: 15,
  },
  musicInfo: {
    flex: 1,
  },
  musicName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  musicDescription: {
    color: 'white',
  },
});

export default Music;