import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from '../Header/Header';

const LofiScreen = () => {
  return (
      <View style={styles.container}>
        <Header />
        <Text style={styles.text}>THIS IS LOFI SCREEN</Text>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#213E50',
  },
  text: {
    fontSize: 24,
    fontFamily:'Poppins-Bold',
  },
});

export default LofiScreen;
