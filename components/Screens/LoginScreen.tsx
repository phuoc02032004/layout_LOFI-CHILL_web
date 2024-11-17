import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import CheckBox from 'expo-checkbox';
import { useFonts } from 'expo-font';
import Icon from 'react-native-vector-icons/FontAwesome';
import { BlurView } from 'expo-blur';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser } from '../../services/auth';
import axios from 'axios';

interface RootStackParamList {
  LoginScreen: undefined;
  HomeScreen: undefined;
  RegisterScreen: undefined;
  HeaderNav: undefined;
  [key: string]: undefined | object;
}

const LoginScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);

  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('../../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-SemiBold': require('../../assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-Bold': require('../../assets/fonts/Poppins-Bold.ttf'),
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = await AsyncStorage.getItem('token');
      setIsLoggedIn(!!token);
    };

    checkLoggedIn();
  }, []);

  const handleSubmit = async () => {
    setError(null);
    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ email và mật khẩu!');
      return;
    }
  
    try {
      const response = await loginUser(email, password);
      console.log('Phản hồi từ loginUser:', response);
  
      if (response && response.err === 0 && response.accessToken) {
        try {
          await AsyncStorage.setItem('accessToken', response.accessToken); // Sửa key ở đây
          if (rememberMe) {
            await AsyncStorage.setItem('email', email);
            await AsyncStorage.setItem('password', password);
          }
          navigation.navigate('HomeScreen'); // Di chuyển đến HomeScreen sau khi lưu token
        } catch (storageError) {
          console.error('Lỗi khi lưu token vào AsyncStorage:', storageError);
          setError('Có lỗi khi lưu thông tin đăng nhập. Vui lòng thử lại!');
        }
      } else {
        setError(response?.mes || 'Đăng nhập thất bại. Vui lòng thử lại!');
      }
    } catch (error: any) {
      console.error('Lỗi đăng nhập:', error);
      setError('Có lỗi xảy ra khi đăng nhập. Vui lòng kiểm tra kết nối mạng và thử lại!');
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
      <BlurView intensity={50} tint='dark'  style={styles.blurContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Login</Text>
          {error && <Text style={styles.errorMessage}>{error}</Text>}

          <View style={styles.inputBox}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#fff"
              onChangeText={setEmail}
              value={email}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <View style={styles.iconContainer}>
              <Icon name="user" size={20} color="#fff" />
            </View>
          </View>

          <View style={styles.inputBox}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#fff"
              onChangeText={setPassword}
              value={password}
              secureTextEntry
            />
            <View style={styles.iconContainer}>
              <Icon name="lock" size={20} color="#fff" />
            </View>
          </View>

          <View style={styles.rememberForgot}>
            <View style={styles.rememberMe}>
              <CheckBox
                value={rememberMe}
                onValueChange={setRememberMe}
                style={styles.checkbox}
                color="#fff"
              />
              <Text style={styles.rememberMeText}>Remember me</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <View style={styles.registerLink}>
            <Text style={styles.registerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
              <Text style={styles.registerLinkText}>Register</Text>
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
  rememberForgot: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
  },
  rememberMe: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    marginRight: 8,
    borderColor: '#fff',
    borderRadius: 5,
    width: 18,
    height: 18,
  },
  rememberMeText: {
    fontSize: 14.5,
    fontFamily: 'Poppins-Regular',
    color: '#fff',
  },
  forgotPasswordText: {
    fontSize: 14.5,
    fontFamily: 'Poppins-Regular',
    color: '#fff',
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
  registerText: {
    fontSize: 14.5,
    fontFamily: 'Poppins-Regular',
    color: '#fff',
    lineHeight: 20,
  },
  registerLinkText: {
    fontSize: 14.5,
    fontFamily: 'Poppins-SemiBold',
    color: '#fff',
    lineHeight: 20,
  },
});

export default LoginScreen;