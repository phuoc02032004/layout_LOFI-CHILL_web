import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, FlatList, TouchableOpacity, ImageBackground } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Songs, Song } from '@/data/SongData';
import { ImageSlider, ImageSliderType } from '@/data/SliderData';
import ArtistCarousel from '../Carousel/ArtistCarousel';
import SongCarousel from '../Carousel/SongCarousel';

type RootStackParamList = {
  ArtistDetailscreen: { artistId: number };
};

type ArtistDetailscreenNavigationProp = RouteProp<RootStackParamList, 'ArtistDetailscreen'>;

const ArtistDetailscreen = () => {
  const route = useRoute<ArtistDetailscreenNavigationProp>();
  const { artistId } = route.params;

  const artist = ImageSlider.find(a => a.id === artistId); // Tìm nghệ sĩ dựa trên ID
  const artistSongs = Songs.filter(song => song.artistId === artistId); // Tìm các bài hát của nghệ sĩ

  const renderSongItem = ({ item }: { item: Song }) => (
    <ImageBackground source={item.image} style={styles.songBackground} imageStyle={styles.songBackgroundImage}>
      <TouchableOpacity style={styles.songContainer} onPress={() => {/* handle song press */ }}>
        <View style={styles.overlay}>
          <Image source={item.image} style={styles.songImage} />
        </View>
        <Text style={styles.songName}>{item.name}</Text>
      </TouchableOpacity>
    </ImageBackground>
  );

  return (
    <ScrollView style={styles.container}>
      {artist ? (
        <>
          <View style={styles.artContainer}>
            <Image source={artist.image} style={styles.artistImage} />
            <View style={styles.textContainer}>
              <Text style={styles.artistName}>{artist.name}</Text>
              <Text style={styles.artistDescription}>{artist.description}</Text>
            </View>
          </View>
          <View style={styles.sectionContainer}>
            <Text style={styles.songsHeader}>SONG'S ARTIST:</Text>
            <FlatList
              data={artistSongs}
              renderItem={renderSongItem}
              keyExtractor={song => song.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.flatListContent}
            />
          </View>
          <Text style={styles.newsong}>NEW SONG</Text>
          <SongCarousel itemSong={Songs} />
          <Text style={styles.newsong}>ARTISTS</Text>
          <ArtistCarousel itemArtist={ImageSlider} />
        </>
      ) : (
        <Text style={styles.notFoundText}>Không tìm thấy nghệ sĩ</Text>
      )}
    </ScrollView>
  );
};

// Đoạn mã đầy đủ của ArtistDetailscreen và phong cách đã chỉnh sửa
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#c8ad7f',
    paddingVertical: 20,
  },
  songBackground: {
    width: 250,         
    height: 250,         
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 20,
    borderRadius: 15,
    overflow: 'hidden',
  },
  songBackgroundImage: {
    opacity: 0.75,        // Điều chỉnh độ mờ của ảnh nền
    borderRadius: 15,
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Lớp phủ màu đen với độ mờ 0.4
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  artContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,                       // Sử dụng padding đều cho tất cả các cạnh
    marginBottom: 20,
    backgroundColor: '#f9f9f9',        // Sử dụng màu nền sáng hơn
    borderRadius: 20,                  // Tăng độ bo tròn
    borderWidth: 1,                    // Thêm viền
    borderColor: '#ddd',               // Màu viền nhẹ
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,                // Tăng độ mờ của bóng đổ
    shadowRadius: 4,
    elevation: 5,
  },
  
  artistImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    margin: 15,
  },
  textContainer: {
    flex: 1,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  artistName: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  artistDescription: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  title: {
  
    fontSize: 16,
   

  },
  songsHeader: {
    color: '#fff',
    fontFamily: 'Poppins-Bold',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  songContainer: {
    alignItems: 'center',
    width: 200,
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 10,
    // backgroundColor: '#c8ad7f',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  songImage: {
    width: 100,           
    height: 100,    
    borderRadius: 10,
  },
  songName: {
    fontSize: 16,               
    fontWeight: 'bold',          
    marginTop: 8,
    textAlign: 'center',
    color: '#ffffff',            // Sử dụng màu trắng để nổi bật trên nền tối
    textShadowColor: '#000000',  // Màu bóng đổ
    textShadowOffset: {          // Kích thước và hướng bóng đổ
      width: 1,
      height: 1,
    },
    textShadowRadius: 1,         // Độ mờ của bóng đổ
  },
  flatListContent: {
    paddingHorizontal: 15,
  },
  carouselContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  notFoundText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#888',
    marginTop: 40,
  },
  newsong: {
    fontFamily: 'Poppins-Bold',
    fontSize: 30,
    color: '#fff',
    paddingLeft: 30,
    paddingTop: 30,
    paddingBottom: 5,
  },
});

export default ArtistDetailscreen;
