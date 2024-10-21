import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { GrNext, GrPrevious } from 'react-icons/gr';

const { width: windowWidth } = Dimensions.get('window');

interface GenreCarouselProps {
  genres: {
    src: any; // Replace 'any' with the actual type of your image source
    title: string;
  }[];
}

const GenreCarousel: React.FC<GenreCarouselProps> = ({ genres }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      flatListRef.current?.scrollToIndex({ index: currentIndex - 1 });
    }
  };

  const handleNext = () => {
    if (currentIndex < genres.length - 1) {
      setCurrentIndex(currentIndex + 1);
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    }
  };

  const renderItem = ({ item }: { item: { src: any; title: string } }) => (
    <View style={styles.imageItem}>
      <Image source={item.src} style={styles.image} />
      <Text style={styles.imageTitle}>{item.title}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePrev} style={styles.carouselButton}>
        <GrPrevious size={20} color="#fff" />
      </TouchableOpacity>
      <FlatList
        ref={flatListRef}
        data={genres}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={windowWidth * 0.75} // Adjust as needed
        decelerationRate="fast"
        onMomentumScrollEnd={(event) => {
          const index = Math.round(
            event.nativeEvent.contentOffset.x / (windowWidth * 0.75) // Adjust as needed
          );
          setCurrentIndex(index);
        }}
        contentContainerStyle={styles.flatListContent}
      />
      <TouchableOpacity onPress={handleNext} style={styles.carouselButton}>
        <GrNext size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    marginVertical: 20,
    marginHorizontal: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingHorizontal: 10,
  },
  flatListContent: {
    paddingHorizontal: 10,
  },
  imageItem: {
    width: windowWidth * 0.7, // Adjust as needed
    marginRight: 10,
    overflow: 'hidden',
    borderRadius: 10,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  imageTitle: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    color: '#fff',
    padding: 5,
    borderRadius: 5,
  },
  carouselButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 10,
    borderRadius: 20,
    marginHorizontal: 10,
  },
});

export default GenreCarousel;