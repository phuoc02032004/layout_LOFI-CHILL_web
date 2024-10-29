import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { MaterialIcons, Octicons } from '@expo/vector-icons'; 
import { BlurView } from 'expo-blur';

const Header = () => {
  const [isMenuVisible, setMenuVisible] = useState(false);

  const handleLogout = () => {
    console.log('Logout');
    setMenuVisible(false); 
  };

  return (
    <View style={styles.headerContainer}> 
      {Platform.OS === 'android' && ( 
        <BlurView intensity={0} tint='dark' style={styles.blurContainer}> 
          <View style={styles.header}>
            <View style={styles.left} /> 

            <Text style={styles.logo}>LOGO</Text>

            <TouchableOpacity onPress={() => setMenuVisible(!isMenuVisible)} style={styles.userIconContainer}>
              <Octicons name="person" size={25} color="black" />
            </TouchableOpacity>

            {isMenuVisible && (
              <View style={styles.dropdownMenu}>
                <TouchableOpacity onPress={handleLogout}>
                  <Text style={styles.menuItem}>Logout</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </BlurView>
      )}

      {Platform.OS === 'android' && ( 
        <View style={[styles.header]}> 
          <View style={styles.left} /> 

          <Text style={styles.logo}>LOGO</Text>

          <TouchableOpacity onPress={() => setMenuVisible(!isMenuVisible)} style={styles.userIconContainer}>
            <Octicons name="person" size={25} color="white" />
          </TouchableOpacity>

          {isMenuVisible && (
            <View style={styles.dropdownMenu}>
              <TouchableOpacity onPress={handleLogout}>
                <Text style={styles.menuItem}>Logout</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    position: 'absolute', 
    top: 10,
    left: 0,
    right: 0,
    zIndex: 10, 
    backgroundColor: 'linear-gradient(to top, rgba(28, 39, 48, 0), rgba(28, 39, 48, 0.8))',

  },
  blurContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0, 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
    alignItems: 'center', 
    height: 60, 
    marginHorizontal: 60,
    backgroundColor: 'linear-gradient(to top, rgba(28, 39, 48, 0), rgba(28, 39, 48, 0.8))',
  },
  left: {
    width: 50, 
    height: 50, 
  },
  logo: {
    fontFamily:'Poppins-Bold',
    fontSize:30,
    color: 'white'
  },
  userIconContainer: {
    padding: 10, 
    
  },
  dropdownMenu: {
    position: 'absolute',
    right: 10,
    top: 60, 
    backgroundColor: 'white',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    width: 100,
    zIndex: 1,
    
  },
  menuItem: {
    fontSize: 16,
    color: 'black',
    padding: 5,
    fontFamily: 'Poppins-Bold',
  },
});

export default Header;