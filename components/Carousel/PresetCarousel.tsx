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
    itemPreset: ImageSliderType[];
  };

  const PresetCarousel = ({ itemPreset }: Props) => {
    const [newData] = useState([{ key: "spacer-left" }, ...itemPreset, { key: "spacer-right" }]);
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
    <View style={styles.back}>
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
                <View style={styles.titleContainer}> 
                <Text style={styles.title}>{item.name}</Text> 
              </View> 
              </View>
            );
          } else {
            return <View style={{ width: SPACER }} key={index} />;
          }
        })}
      </Animated.ScrollView>
      </View>
    );
  };
  
  export default PresetCarousel;
  
  const styles = StyleSheet.create({
    imageContainer: {
      borderRadius: 34,
      overflow: "hidden",
      borderWidth: 2,
      borderColor: 'rgba(225, 255, 255, 0.5)',
      
    },
    image: {
      width: "100%",
      height: 500,
      aspectRatio: 1,
    },
    back: {
  
       
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
  