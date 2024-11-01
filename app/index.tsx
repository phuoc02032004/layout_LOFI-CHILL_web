import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'; // Import BottomSheetModalProvider
import { GestureHandlerRootView } from 'react-native-gesture-handler'; // Import GestureHandlerRootView

import LoginScreen from '@/components/Screens/LoginScreen';
import RegisterScreen from '@/components/Screens/RegisterScreen';
import BottomTab from '@/components/navigation/BottomTab';
import SongDetailScreen from '@/components/Screens/SongDetailScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = await AsyncStorage.getItem('token');
      setIsLoggedIn(!!token);
    };

    checkLoggedIn();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <NavigationContainer independent={true}>
          <Stack.Navigator initialRouteName={isLoggedIn ? "HomeScreen" : "LoginScreen"}> 
            <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="HomeScreen" component={BottomTab} options={{ headerShown: false }} />
            <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{ headerShown: false }}  /> 
            <Stack.Screen name="SongDetailScreen" component={SongDetailScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default App;
