import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import Animated, { useSharedValue, useAnimatedStyle, useAnimatedScrollHandler, interpolate } from "react-native-reanimated";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Song } from '@/data/SongData';
import { useNavigation } from "expo-router";


type Props = {
  itemSong: Song[];
};


// Khai báo kiểu cho Stack Param List
type RootStackParamList = {
  SongDetailScreen: { song: Song };
  Songscreen: undefined; // thêm dòng này nếu màn hình này cũng thuộc stack
};

// Sử dụng NativeStackNavigationProp với kiểu RootStackParamList
type SongscreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Songscreen'>;


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


  const navigation = useNavigation<SongscreenNavigationProp>();


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
        if ('image' in item) {
          const imageStyle = useAnimatedStyle(() => {
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
            //Chuyển hướng trang
            <TouchableOpacity onPress={() => navigation.navigate('SongDetailScreen', { song: item })}>


            <View style={{ width: SIZE }} key={index}>
              <Animated.View style={[styles.imageContainer, imageStyle]}>
                <Image source={item.image} style={styles.image} />
              </Animated.View>
              <View style={styles.titleContainer}> 
                <Text style={styles.title}>{item.name}</Text> 
              </View> 
            </View>

            
            </TouchableOpacity>
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
    position: 'relative', 
    borderWidth: 2,
    borderColor: 'rgba(225, 255, 255, 0.5)',
  },
  image: {
    width: "100%",
    height: undefined,
    aspectRatio: 1,
  },
  titleContainer: { 
    position: 'absolute', 
    bottom: 10, 
    left: 70, 
    right: 70, 
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    padding: 5, 
    borderRadius: 10, 
    alignItems: 'center', 
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center', 
  },
});