import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import CheckBox from 'expo-checkbox';
import { useFonts } from 'expo-font';
import Icon from 'react-native-vector-icons/FontAwesome';
import { BlurView } from 'expo-blur';
import axios from 'axios';
import { loginUser } from '@/services/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface RootStackParamList {
  LoginScreen: undefined;
  HomeScreen: undefined;
  RegisterScreen: undefined;
  [key: string]: undefined | object;
}
const RegisterScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [verificationCode, setVerificationCode] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('../../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-SemiBold': require('../../assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-Bold': require('../../assets/fonts/Poppins-Bold.ttf'),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegisterSubmit = async () => {
    setError(null);

    if (
      formData.username === '' ||
      formData.email === '' ||
      formData.password === '' ||
      formData.confirmPassword === ''
    ) {
      setError('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu không khớp!');
      return;
    }

    try {
      const response = await axios.post('http://192.168.63.124:3002/users/register', formData);
      setMessage(response.data.message);
      setIsRegistered(true);
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Có lỗi xảy ra, vui lòng thử lại!');
      }
    }
  };

  const handleVerifySubmit = async () => {
    setError(null);

    if (verificationCode === '') {
      setError('Vui lòng nhập mã xác thực!');
      return;
    }

    try {
      const response = await axios.post('http://192.168.63.124:3002/users/verify', {
        email: formData.email,
        code: verificationCode,
      });
      setMessage(response.data.message);
      if (response.data.message === 'Email verified successfully!') {
        navigation.navigate('LoginScreen');
      }
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Có lỗi xảy ra, vui lòng thử lại!');
      }
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ImageBackground
      source={require('../../assets/images/te.jpg')}
      style={[styles.backgroundImage, StyleSheet.absoluteFill]}
    >
      <BlurView intensity={50} tint='dark' style={styles.blurContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>{isRegistered ? 'Verify Email' : 'Register'}</Text>
          {message && <Text style={styles.message}>{message}</Text>}
          {error && <Text style={styles.errorMessage}>{error}</Text>}
          {!isRegistered ? (
            <View>
              <View style={styles.inputBox}>
                <TextInput
                  style={styles.input}
                  placeholder="Username"
                  placeholderTextColor="#fff"
                  onChangeText={(text) => setFormData({ ...formData, username: text })}
                  value={formData.username}
                  keyboardType="default"
                  autoCapitalize="none"
                />
                <View style={styles.iconContainer}>
                  <Icon name="user" size={20} color="#fff" />
                </View>
              </View>
              <View style={styles.inputBox}>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="#fff"
                  onChangeText={(text) => setFormData({ ...formData, email: text })}
                  value={formData.email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <View style={styles.iconContainer}>
                  <Icon name="envelope" size={20} color="#fff" />
                </View>
              </View>
              <View style={styles.inputBox}>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#fff"
                  onChangeText={(text) => setFormData({ ...formData, password: text })}
                  value={formData.password}
                  secureTextEntry
                />
                <View style={styles.iconContainer}>
                  <Icon name="lock" size={20} color="#fff" />
                </View>
              </View>
              <View style={styles.inputBox}>
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  placeholderTextColor="#fff"
                  onChangeText={(text) =>
                    setFormData({ ...formData, confirmPassword: text })
                  }
                  value={formData.confirmPassword}
                  secureTextEntry
                />
                <View style={styles.iconContainer}>
                  <Icon name="lock" size={20} color="#fff" />
                </View>
              </View>
              <TouchableOpacity style={styles.button} onPress={handleRegisterSubmit}>
                <Text style={styles.buttonText}>Register</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <View style={styles.inputBox}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter verification code"
                  placeholderTextColor="#fff"
                  onChangeText={setVerificationCode}
                  value={verificationCode}
                  keyboardType="default"
                  autoCapitalize="none"
                />
              </View>
              <TouchableOpacity style={styles.button} onPress={handleVerifySubmit}>
                <Text style={styles.buttonText}>Verify</Text>
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.registerLink}>
            <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
              <Text style={styles.registerLinkText}>Already have an account? Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurContainer: {
    width: '90%',
    maxWidth: 420,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 30,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  formContainer: {
    width: '100%',
  },
  title: {
    fontSize: 36,
    fontFamily: 'Poppins-Bold',
    color: '#fff',
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    color: 'green',
    marginTop: 10,
    marginBottom: 10,
  },
  errorMessage: {
    textAlign: 'center',
    color: 'red',
    marginTop: 10,
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#fff',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 2,
    borderRadius: 40,
    paddingHorizontal: 20,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
  },
  inputBox: {
    width: '100%',
    height: 50,
    marginBottom: 30,
  },
  iconContainer: {
    position: 'absolute',
    right: 20,
    top: 15,
  },
  button: {
    width: '100%',
    height: 45,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#fff',
  },
  registerLink: {
    alignItems: 'center',
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  registerLinkText: {
    fontSize: 14.5,
    fontFamily: 'Poppins-SemiBold',
    color: '#fff',
    lineHeight: 20,
  },
});

export default RegisterScreen;