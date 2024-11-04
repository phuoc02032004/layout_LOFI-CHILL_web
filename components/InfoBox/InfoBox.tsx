import React from 'react';
import { Modal, StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';

interface InfoBoxProps {
  title: string;
  content: React.ReactNode;
  onClose: () => void;
  isVisible: boolean;
}

const InfoBox: React.FC<InfoBoxProps> = ({ title, content, onClose, isVisible }) => {
  if (!isVisible) return null;

  return (
    <Modal transparent={true} animationType="slide" visible={isVisible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>
          <ScrollView style={styles.content}>{content}</ScrollView> 
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialIcons name="close" size={40} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    height: 400,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    overflow: 'hidden',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  content: {
    marginBottom: 20, // Giữ khoảng cách dưới cùng của content
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    borderRadius: 10,
  },
});

export default InfoBox;