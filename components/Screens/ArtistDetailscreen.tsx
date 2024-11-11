import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, FlatList, TouchableOpacity, ImageBackground } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Songs, Song } from '@/data/SongData';
import { ImageSlider, ImageSliderType } from '@/data/SliderData';
import ArtistCarousel from '../Carousel/ArtistCarousel';
import SongCarousel from '../Carousel/SongCarousel';
import { Tracks } from '@/data/tracks'; 
import SongTracks from '../SongTracks/SongTracks';


type RootStackParamList = {
  ArtistDetailscreen: { artistId: number };
};

type ArtistDetailscreenNavigationProp = RouteProp<RootStackParamList, 'ArtistDetailscreen'>;

const ArtistDetailscreen = () => {
  const route = useRoute<ArtistDetailscreenNavigationProp>();
  const { artistId } = route.params;

  const artist = ImageSlider.find(a => a.id === artistId); // Tìm nghệ sĩ dựa trên ID
  const artistSongs = Songs.filter(song => song.artistIds.includes(artistId)); 


  
  const renderSongItem = ({ item }: { item: Song }) => (
    <TouchableOpacity style={styles.songContainer} onPress={() => {/* handle song press */ }}>
      <ImageBackground source={item.image} style={styles.songBackground} imageStyle={styles.songBackgroundImage}>
        <View style={styles.overlay}>
          <Image source={item.image} style={styles.songImage} />
        </View>
        <Text style={styles.songName}>{item.name}</Text>
      </ImageBackground>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {artist ? (
        <>
          <View style={styles.artContainer}>
            <ImageBackground source={artist.image} style={styles.artistBackgroundImage}>
              <View style={styles.overlay}>
                <Image source={artist.image} style={styles.artistimage}
                />
                <View style={styles.textContainer}>
                  <Text style={styles.artistName}>{artist.name}</Text>
                  <Text style={styles.artistDescription}>{artist.description}</Text>
                </View>
              </View>
            </ImageBackground>
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
          <Text style={styles.newsong}>Song Tracks</Text>
          <SongTracks />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF4B7',
    paddingVertical: 20,
  },

  songContainer: {
    width: 250,
    height: '100%',
    alignItems: 'center',
    marginHorizontal: 10,
    padding: 10,

  },
  songBackground: {
    width:'100%',
    height:220,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    overflow: 'hidden',
  },
  songBackgroundImage: {
    opacity: 0.7,        
    borderRadius: 15,
  },
  overlay: {
    flexDirection: 'row',
    alignItems: 'center',
    
    shadowRadius: 10,
    shadowColor: '#000',
    
    padding:8,
    borderRadius: 15,

  },
  artContainer: {
    alignItems: 'center',
    marginBottom: 20,
    marginHorizontal: 20,
    shadowOffset: { width: 0, height: 10 },
    justifyContent: 'center',
    elevation: 15, 
    width: 380,
    height: 300,
    shadowColor: '#000',               
    shadowOpacity: 1,                
    shadowRadius: 15,
    borderWidth: 2,                  
    borderRadius: 20,
  },
  artistBackgroundImage: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
    overflow: 'hidden',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Màu đen mờ 50%
  },
  artistimage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#E4C087',
    marginLeft: 'auto',
  },
  textContainer: {
    flex: 1,
    width: 200,
    height: 160,
    paddingRight: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 10,
    fontFamily: 'Poppins-Bold',
    opacity: 0.85,

  },
  artistName: {
    textAlign:'center',
    fontSize: 25,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
    color: '#333',
    marginBottom: 2,
    textShadowColor: 'rgba(0, 0, 0, 1)', // Thêm bóng cho chữ
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  artistDescription: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
    fontFamily: 'Poppins-Bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)', // Thêm bóng cho chữ
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  songsHeader: {
    color: '#fffff',
    fontFamily: 'Poppins-Bold',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  
  songImage: {
    width: '80%',
    height: 150,
    borderRadius: 10,
  },
  songName: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
    color: '#ffffff',
    textShadowColor: '#000000',
    textShadowOffset: {
      width: 1,
      height: 1,
    },
    textShadowRadius: 1,
  },
  flatListContent: {
    paddingHorizontal: 20,
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
    fontSize: 26,
    color: '#333',
    marginTop: 30,
    marginBottom: 10,
    paddingLeft: 25,
},
});

export default ArtistDetailscreen;
