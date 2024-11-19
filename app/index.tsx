import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginScreen from '@/components/Screens/LoginScreen';
import RegisterScreen from '@/components/Screens/RegisterScreen';
import BottomTab from '@/components/navigation/BottomTab';
import SongDetailScreen from '@/components/Screens/SongDetailScreen';
import ArtistDetailscreen from '@/components/Screens/ArtistDetailscreen';

import { MusicProvider } from '@/components/MusicContext/MusicContext';
import SongCarousel from '@/components/Carousel/SongCarousel';

const Stack = createNativeStackNavigator();
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [initialRouteName, setInitialRouteName] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        setAccessToken(token);
        console.log("AccessToken:", token);  // Kiểm tra giá trị token
        setIsLoggedIn(!!token);
        setInitialRouteName(!!token ? "HomeScreen" : "LoginScreen");
      } catch (error) {
        console.error("Error fetching token from AsyncStorage:", error);
      }
    };

    checkLoggedIn();
  }, []);
  
  useEffect(() => {
    if (initialRouteName) {
      console.log("isLoggedIn after check:", isLoggedIn);
    }
  }, [initialRouteName]);
  return (
    <MusicProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
          <NavigationContainer independent={true}>
            <Stack.Navigator initialRouteName={isLoggedIn ? "HomeScreen" : "LoginScreen"}>
              <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
              <Stack.Screen name="HomeScreen" component={BottomTab} options={{ headerShown: false }} />
              <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{ headerShown: false }} />
              <Stack.Screen name="SongDetailScreen" component={SongDetailScreen} />
              <Stack.Screen
                name="Songscreen"
                component={SongCarousel}
                options={{ headerShown: false }}
                initialParams={{ accessToken }}
              />
              <Stack.Screen name="ArtistDetailscreen" component={ArtistDetailscreen} />
            </Stack.Navigator>
          </NavigationContainer>
      </GestureHandlerRootView>
    </MusicProvider>
  );
};

export default App;
