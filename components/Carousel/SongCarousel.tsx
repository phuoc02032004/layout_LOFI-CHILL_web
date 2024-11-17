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
import { useNavigation } from "expo-router";
import { getNewSong } from '@/services/song';
import { Provider as PaperProvider } from 'react-native-paper';


interface Song {
  id: string;
  ArtistId: string;
  Title: string;
  Url: string;
  Description: string;
  urlImg: string;
}

interface Props {
  accessToken: string;
}

type RootStackParamList = {
  SongDetailScreen: { song: Song };
  Songscreen: undefined;
};

type SongscreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Songscreen"
>;

const SongCarousel = ({ accessToken }: Props) => {
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
        console.log("Fetching songs with accessToken:", accessToken);
        const data = await getNewSong(accessToken);
        console.log("Received data from getNewSong:", data);
        if (data !== null) {
          setSongData(data); // Only set data if it's not null
        } else {
          setError("Failed to fetch songs."); // Set an error if data is null
        }
      } catch (err: any) {
        setError(err.message);
        console.error("Error fetching songs:", err);
      } finally {
        setIsLoading(false);
      }
    };
    console.log("accessToken in useEffect:", accessToken);
    if (accessToken) {
      fetchSongs();
    }
  }, [accessToken]);

  const renderItem = ({ item }: { item: Song }) => {
    console.log("Rendering item:", item);
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("SongDetailScreen", { song: item })}
        style={{ width: SIZE, marginHorizontal: SPACER - 40 }}
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
  },
});