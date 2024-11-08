import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; // Sử dụng bottom tab
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../Screens/HomeScreen';
import LofiScreen from '../Screens/LofiScreen';
import ChillScreen from '../Screens/ChillScreen';

const Tab = createBottomTabNavigator(); 

const BottomTab = () => {
  return (
    <View style={styles.container}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          unmountOnBlur: false,
          tabBarStyle: {
            position: 'absolute',
            bottom: 20, 
            left: 0,
            right: 0,
            margin: 0,
            paddingTop:5,
            borderTopColor: 'transparent',      
            borderRadius: 35,
            marginHorizontal: 60,
            paddingHorizontal: 10,
            height: 70,
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            justifyContent: 'space-between',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 0,
            },
            shadowOpacity: 0,
            shadowRadius: 0,
            elevation: 2,
          },
          tabBarIcon: ({ color }) => {
            const icons: { [key in 'HOME' | 'LOFI' | 'CHILL']: string } = {
              HOME: 'home',
              LOFI: 'musical-notes',
              CHILL: 'ice-cream',
            };

            const iconName = icons[route.name as keyof typeof icons];
            return <Ionicons name={iconName} size={30} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: '#fff',
          tabBarIconStyle: {
            color: '#fff',
            width: 'auto',
            height: 'auto',
            marginTop: 7,
            alignItems: 'center',
            justifyContent: 'center',
          },
          tabBarItemStyle: {
            alignItems: 'center',
            justifyContent: 'center',
            width: 90,
            paddingBottom:5,
          },
          tabBarLabelStyle: {
            justifyContent: 'center',
            fontFamily: 'Poppins-Bold',
            fontSize: 12,
            color: '#fff',
            alignItems: 'center',
            textAlign: 'center',
          },
          tabBarIndicatorStyle: {
            backgroundColor: 'transparent',
          },
        })}
      >
        <Tab.Screen name="HOME" component={HomeScreen} />
        <Tab.Screen name="LOFI" component={LofiScreen} />
        <Tab.Screen name="CHILL" component={ChillScreen} />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default BottomTab;
