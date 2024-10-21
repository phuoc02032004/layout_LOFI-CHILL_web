import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  useWindowDimensions,
} from "react-native";
import React, { useState } from "react";
import { ImageSliderType } from "@/data/SliderData";
import Animated, { useSharedValue, useAnimatedStyle, useAnimatedScrollHandler, interpolate } from "react-native-reanimated";

type Props = {
  itemSong: ImageSliderType[];
};

const SongCarousel = ({ itemSong }: Props) => {
  const [newData] = useState([{ key: "spacer-left" }, ...itemSong, { key: "spacer-right" }]);
  const { width } = useWindowDimensions();
  const SIZE = width * 0.7;
  const SPACER = (width - SIZE) / 2;
  const x = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler({
    onScroll: event => {
      x.value = event.contentOffset.x;
    }
  });

  return (
    <Animated.ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      bounces={false}
      scrollEventThrottle={16}
      snapToInterval={SIZE}
      decelerationRate="fast"
      onScroll={onScroll}
    >
      {newData.map((item, index) => {
        // Kiểm tra kiểu
        if ('image' in item) { // Kiểm tra xem item có thuộc tính 'image'
          const style = useAnimatedStyle(() => {
            const scale = interpolate(
              x.value,
              [(index - 2) * SIZE, (index - 1) * SIZE, index * SIZE],
              [0.8, 1, 0.8],
            );
            return {
              transform: [{ scale }],
            };
          });

          return (
            <View style={{ width: SIZE }} key={index}>
              <Animated.View style={[styles.imageContainer, style]}>
                <Image source={item.image} style={styles.image} />
              </Animated.View>
            </View>
          );
        } else {
          return <View style={{ width: SPACER }} key={index} />;
        }
      })}
    </Animated.ScrollView>
  );
};

export default SongCarousel;

const styles = StyleSheet.create({
  imageContainer: {
    borderRadius: 34,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: undefined,
    aspectRatio: 1,
  },
});
