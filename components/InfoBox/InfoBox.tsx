import React, { useCallback, useMemo, useRef } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

interface InfoBoxProps {
  title: string;
  content: React.ReactNode;
  onClose: () => void;
  isVisible: boolean;
}

const InfoBox: React.FC<InfoBoxProps> = ({ title, content, onClose, isVisible }) => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);

  const handleOpen = useCallback(() => {
    if (isVisible) {
      bottomSheetRef.current?.present();
    }
  }, [isVisible]);

  const handleClose = () => {
    bottomSheetRef.current?.dismiss();
    onClose();
  };

  // Khi `isVisible` thay đổi, mở BottomSheet
  React.useEffect(() => {
    handleOpen();
  }, [handleOpen]);

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        onDismiss={handleClose}
        backgroundStyle={styles.bottomSheetBackground}
      >
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{title}</Text>
          <FontAwesome name="chevron-down" size={20} color="#ffbd6f" onPress={handleClose} />
          <View style={styles.content}>{content}</View>
        </View>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1C2730fc',
    borderRadius: 10,
  },
  title: {
    fontSize: 25,
    fontWeight: '700',
    marginBottom: 10,
    color: 'white',
  },
  content: {
    paddingTop: 10,
  },
  bottomSheetBackground: {
    backgroundColor: '#1C2730fc',
  },
});

export default InfoBox;
