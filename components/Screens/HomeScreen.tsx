import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Video } from 'expo-av';

// Định nghĩa kiểu cho các route trong ứng dụng
type RootStackParamList = {
  LoginScreen: undefined; 
  HomeScreen: undefined;  
  RegisterScreen: undefined; 
};

const HomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'HomeScreen'>>();

  return (
    <View style={styles.container}>
      <Video
        source={require('../../assets/videos/Summer.mp4')} // Đường dẫn tới video
        style={styles.video}
        resizeMode="cover" // Thêm thuộc tính này
        shouldPlay
        isLooping
        isMuted
        onError={(error) => console.log('Video Error: ', error)} // Thêm onError để kiểm tra lỗi
      />
      <View style={styles.overlay}>
        <Text style={styles.text}>Home</Text>
        <TouchableOpacity style={[styles.button, { zIndex: 1 }]} onPress={() => navigation.navigate('LoginScreen')}>
          <Text style={styles.buttonText}>Quay lại Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Màu nền mờ để tăng độ tương phản cho văn bản
  },
  text: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  button: {
    padding: 10,
    backgroundColor: 'blue',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
  },
});

export default HomeScreen;