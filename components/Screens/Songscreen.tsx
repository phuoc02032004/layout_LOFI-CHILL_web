import React, { useState, useEffect } from 'react';
import { View, FlatList, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getAllSong } from '@/services/song'; 

type RootStackParamList = {
  SongDetailScreen: { song: Song; artistId: string };
  Songscreen: undefined; 
};

interface Timestamp {
  _seconds: number;
  _nanoseconds: number;
}

interface Song {
  id: string;
  ArtistId: string;
  Title: string;
  Url: string;
  Description: string;
  urlImg: string;
  filePath: string;
  filePathImg: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
type SongscreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Songscreen'>;

const Songscreen = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5; 
  const currentSongs = songs.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );
  const totalPages = Math.ceil(songs.length / itemsPerPage);
  const navigation = useNavigation<SongscreenNavigationProp>();
  const renderItem = ({ item }: { item: Song }) => (
    <TouchableOpacity
    onPress={() =>
      navigation.navigate("SongDetailScreen", { song: item, artistId: item.ArtistId })
    }     >
      <View style={styles.card}>
        <Image
          source={{ uri: item.urlImg }}
          style={[styles.image, { borderRadius: 10 }]}
        />
        <View style={styles.titleContainer}>
          <Text style={styles.name}>{item.Title}</Text> 
        </View>
      </View>
    </TouchableOpacity>
  );

  useEffect(() => {
    const fetchSongs = async () => {
      const accessToken = 'your_access_token'; 
      try {
        const fetchedSongs = await getAllSong(accessToken);
        setSongs(fetchedSongs);
      } catch (error) {
        console.error('Error fetching songs:', error);
      }
    };

    fetchSongs();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={currentSongs}
        renderItem={renderItem}
        keyExtractor={(item) => item.id} 
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<View style={styles.footerSpace} />}
      />
      <View style={styles.overlay}>
        {Array.from({ length: totalPages }, (_, index) => (
          <TouchableOpacity
            key={index.toString()}
            onPress={() => setCurrentPage(index)}
          >
            <Text
              style={[styles.pageButton, currentPage === index && styles.activePage]}
            >
              {index + 1}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#213E50',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 10,
  },
  overlay: {
    position: 'absolute',
    bottom: 90,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  pageButton: {
    marginBottom: 10,
    marginHorizontal: 5,
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 15,
  },
  activePage: {
    backgroundColor: '#34495e', 
    color: '#fff', 
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    margin: 10,
    elevation: 3,
    overflow: 'hidden', 
  },
  image: {
    width: '100%',
    height: 200,
  },
  name: {
    fontSize: 15,
    fontFamily: 'Poppins-Bold',
    color: '#fff',
    textAlign: 'center', 
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    padding: 5,
    borderRadius: 10, 
  },
  titleContainer: {
    position: 'absolute', 
    bottom: 20, 
    left: 90, 
    right: 90, 
    alignItems: 'center', 
  },
  artist: {
    fontSize: 16,
    color: '#666',
  },
  description: {
    fontSize: 14,
    color: '#888',
  },
  footerSpace: {
    height: 80,
  },
});
export default Songscreen;