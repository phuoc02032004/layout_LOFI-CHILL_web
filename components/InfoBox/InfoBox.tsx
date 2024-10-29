import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

interface InfoBoxProps {
  title: string;
  content: React.ReactNode;
  onClose: () => void;
}

const InfoBox: React.FC<InfoBoxProps> = ({ title, content, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [opacity] = useState(new Animated.Value(1)); // Khởi tạo opacity với giá trị 1
  const [translateY] = useState(new Animated.Value(0)); // Khởi tạo translateY với giá trị 0

  const handleCloseClick = () => {
    setIsClosing(true);
    Animated.parallel([
      Animated.timing(opacity, { toValue: 0, duration: 500, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 100, duration: 500, useNativeDriver: true }), // Dịch chuyển xuống dưới
    ]).start(() => {
      onClose();
    });
  };

  const animationStyle = {
    opacity: opacity,
    transform: [
      {
        translateY: translateY,
      },
    ],
  };

  return (
    <Animated.View style={[styles.infoBox, animationStyle, isClosing ? styles.hide : styles.show]}>
      <TouchableOpacity style={styles.closeButton} onPress={handleCloseClick}>
        <FontAwesome name="chevron-down" size={20} color="#ffbd6f" />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.contentContainer}>{content}</View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  infoBox: {
    position: 'absolute',
    bottom: 120, 
    backgroundColor: '#1C2730fc',
    color: '#fff',
    padding: 20,
    borderRadius: 5,
    zIndex: 1,
    width: 400,
    height: 250,
    overflow: 'scroll',
  },
  show: {
    opacity: 1,
    transform: [{ translateY: 0 }],
  },
  hide: {
    opacity: 0,
    transform: [{ translateY: 100 }],
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 15,
    backgroundColor: 'transparent',
    padding: 10,
  },
  title: {
    fontSize: 25,
    fontWeight: '700',
    textAlign: 'left',
    marginBottom: 10,
  },
  contentContainer: {
    paddingTop: 10,
  },
});

export default InfoBox;
