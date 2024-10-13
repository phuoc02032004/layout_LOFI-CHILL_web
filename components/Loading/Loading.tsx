import React from 'react';
import { StyleSheet,Text, View, ActivityIndicator } from 'react-native';

const Loading = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#fff" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1d2021', // Màu nền giống như body của bạn
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 999, // Đảm bảo loading nằm trên cùng
  },
});

export default Loading;