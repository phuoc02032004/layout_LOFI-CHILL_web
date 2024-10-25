import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Artistscreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Artscreen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Makes the container take up the full screen
    justifyContent: 'center', // Center the content vertically
    alignItems: 'center', // Center the content horizontally
    backgroundColor: '#f0f0f0', // Background color for the screen
  },
  text: {
    fontSize: 24, // Size of the text
    fontFamily: 'Poppins-Bold', // Font family for the text
    color: '#333', // Text color
  },
});

export default Artistscreen;
