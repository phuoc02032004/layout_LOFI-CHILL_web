import React, { useRef, useEffect, useState, useCallback } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { Backgrounds } from '@/data/BackgroundData';
import Video from 'react-native-video';

interface VisualsWrapperProps {
  onBackgroundChange: (newBackground: string) => void;
  onTabPress?: (title: string, content: React.ReactNode) => void;
}

const VisualsWrapper: React.FC<VisualsWrapperProps> = ({ onBackgroundChange }) => {
  const videoRef = useRef<React.ElementRef<typeof Video> | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  useEffect(() => {
    if (selectedVideo) {
      videoRef.current?.seek(0);
    }
  }, [selectedVideo]);

  const handleBackgroundChange = useCallback(
    (videoSrc: string) => {
      setSelectedVideo(videoSrc);
      onBackgroundChange(videoSrc);
    },
    [onBackgroundChange]
  );

  return (
    <View style={styles.container}>
      {selectedVideo && (
        <Video
          ref={videoRef}
          source={{ uri: selectedVideo }}
          style={styles.video}
          repeat={true}
          muted={true}
          resizeMode={'cover'}
          paused={!selectedVideo}
        />
      )}

      <View style={styles.visualsList}>
        {Backgrounds.map((background: any) => (
          <TouchableOpacity
            key={background.name}
            style={styles.visualItem}
            onPress={() => handleBackgroundChange(background.video)}
          >
            <Image
              source={background.Thumbnail}
              style={styles.visualImage}
            />
            <Text style={styles.visualName}>{background.name}</Text>
          </TouchableOpacity>
        ))}
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
    bottom: 0,
    right: 0,
  },
  visualsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  visualItem: {
    width: '50%',
    aspectRatio: 1,
    margin: 5,
  },
  visualImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  visualName: {
    textAlign: 'center',
    marginTop: 5,
  },
});

export default VisualsWrapper;
