import {
  StyleSheet,
  Text,
  View,
  Image,
  useWindowDimensions,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { getNewSong } from '@/services/song';
import { useNavigation } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';

interface Song {
  id: string;
  ArtistId: string;
  Title: string;
  Url: string;
  Description: string;
  urlImg: string;
  filePath: string;
  filePathImg: string;
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };
  updatedAt: {
    _seconds: number;
    _nanoseconds: number;
  };
}

interface SongCarouselProps {
  accessToken: string | null;
}

type RootStackParamList = {
  SongDetailScreen: { song: Song; artistId: string };
  Songscreen: undefined;
};

type SongscreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Songscreen'>;


const SongCarousel: React.FC<SongCarouselProps> = ({ accessToken }) => {  
  const { width } = useWindowDimensions();
  const SIZE = width * 0.7;
  const SPACER = (width - SIZE) / 2;
  const navigation = useNavigation<SongscreenNavigationProp>();
  const [songData, setSongData] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDebugButton, setShowDebugButton] = useState(true);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setIsLoading(true);
        if (accessToken) {
          const data = await getNewSong(accessToken);
          if (data) {
            setSongData(data);
          } else {
            setError("Failed to fetch songs. Please check your network connection.");
          }
        } else {
          setError("Please sign in to view songs.");
        }
      } catch (err: any) {
        setError(`Error fetching songs: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };


    if (accessToken) {
      fetchSongs();
    }
  }, [accessToken]);
  const renderItem = ({ item }: { item: Song }) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("SongDetailScreen", { song: item, artistId: item.ArtistId })}
        style={{ width: SIZE, marginHorizontal: SPACER - 40, zIndex: 10 }}
      >
        <Image source={{ uri: item.urlImg }} style={styles.image} />
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{item.Title}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text style={{ color: 'red' }}>{error}: {error}</Text>;
  }

  if (songData.length === 0) {
    return <Text>No songs found</Text>;
  }


  return (
    <PaperProvider>
      <FlatList
        data={songData}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToAlignment="center"
        snapToInterval={SPACER}
        decelerationRate="normal"
        contentContainerStyle={{ paddingHorizontal: 40 }}
        keyExtractor={(item) => item.id}
      />
    </PaperProvider>
  );
};

export default SongCarousel;

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 280,
    aspectRatio: 1,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: 'rgba(225, 255, 255, 0.5)',
  },
  titleContainer: {
    position: "absolute",
    bottom: 10,
    left: 20,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: 5,
    borderRadius: 10,
  },
  title: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    fontFamily: 'Poppins-Bold'
  },
});