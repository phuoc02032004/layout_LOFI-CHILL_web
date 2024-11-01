import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Songs, Song } from '@/data/SongData'; // Import dữ liệu bài hát
import { ImageSlider, ImageSliderType } from '@/data/SliderData'; // Import dữ liệu nghệ sĩ
import { FlatList } from 'react-native-gesture-handler';

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
    <View style={styles.songContainer}>
      <Image source={item.image} style={styles.songImage} />
      <Text style={styles.songName}>{item.name}</Text>
    </View>
  );


  return (
    <View style={styles.container}>
      {artist ? (
        <>
          <View style={styles.artcontainer}>
            <Image source={artist.image} style={styles.artistImage} />
            <View style={styles.textContainer}>
              <Text style={styles.artistName}>{artist.name}</Text>
              <Text style={styles.artistDescription}>{artist.description}</Text>
            </View>
          </View>
          <View>
            <Text style={styles.songsHeader}>Bài Hát của Nghệ sĩ:</Text>
            <FlatList
              data={artistSongs}
              renderItem={renderSongItem}
              keyExtractor={Song => Song.id.toString()} // Sử dụng ID của bài hát làm key
              horizontal={true} // Thiết lập hướng nằm ngang
              showsHorizontalScrollIndicator={false} // Ẩn chỉ báo cuộn ngang
              contentContainerStyle={styles.flatListContent} // Tùy chỉnh thêm nếu cần // Thêm khoảng trống dưới cùng
            />
          </View>
        </>
      ) : (
        <Text>Không tìm thấy nghệ sĩ</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  artcontainer: {
    flex: 1,
    height: 50,
    flexDirection: 'row', // Để các phần tử nằm ngang
    alignItems: 'center', // Canh giữa theo chiều dọc
    paddingHorizontal: 10, // Thêm khoảng cách bên trái và bên phải
  },
  textContainer: {
    marginLeft: 10, // Khoảng cách giữa hình ảnh và văn bản
    justifyContent: 'center', // Canh giữa theo chiều dọc trong textContainer
  },
  artistImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignSelf: 'center',
  },
  artistName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'left',
    marginVertical: 10,
  },
  artistDescription: {
    textAlign: 'left',
    color: '#555',
    marginBottom: 20,
  },
  songsHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  songContainer: {
    alignItems: 'center',
    marginBottom: 20,
    marginRight: 20, 
    marginLeft: 10,  
  },
  songImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  songName: {
    fontWeight: 'bold',
    marginVertical: 5,
  },
  songDescription: {
    textAlign: 'center',
    color: '#555',
  },
  noSongs: {
    textAlign: 'center',
    color: '#999',
  },

  flatListContent: {
    paddingHorizontal: 10, // Tùy chỉnh khoảng cách bên trái và bên phải
  },
});

export default ArtistDetailscreen;
