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
import { useNavigation } from '@react-navigation/native';
import { getAllArtist } from "@/services/artist";
import { Provider as PaperProvider } from 'react-native-paper';


type RootStackParamList = {
  ArtistDetailscreen: { artistId: string };
  Artscreen: undefined;
};

type SongscreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Artscreen"
>;

interface Artist {
  id: string;
  Description: string;
  name: string;
  urlImg: string;
  filePathImg: string;
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };
  updatedAt: {
    _seconds: number;
    _nanoseconds: number;
  };
  songs: string;
}
const ArtistCarousel = () => {
  const { width } = useWindowDimensions();
  const SIZE = width * 0.7;
  const SPACER = (width - SIZE) / 2;
  const navigation = useNavigation<SongscreenNavigationProp>();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        setIsLoading(true);
        const fetchedArtists = await getAllArtist();
        setArtists(fetchedArtists);
      } catch (err: any) {
        setError(err.message);
        console.error("Error fetching artists:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchArtists();
  }, []);

  const renderItem = ({ item }: { item: Artist }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("ArtistDetailscreen", { artistId: item.id })}
      style={{ width: SIZE, marginHorizontal: SPACER - 40 }} // Adjust margin as needed
    >
      <Image source={{ uri: item.urlImg }} style={styles.image} />
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text style={{ color: "red" }}>{error}</Text>;
  }

  if (artists.length === 0) {
    return <Text>No artists found</Text>;
  }

  return (
    <PaperProvider>
      <FlatList
        data={artists}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToAlignment="center"
        snapToInterval={SIZE + SPACER * 2} // Adjust snap interval
        decelerationRate="normal"
        contentContainerStyle={{ paddingHorizontal: 40 }}
        keyExtractor={(item) => item.id}
        nestedScrollEnabled={true}

      />
    </PaperProvider>
  );
};

export default ArtistCarousel;

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 280, // Adjust height as needed
    aspectRatio: 1,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "rgba(225, 255, 255, 0.5)",
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
    fontFamily: "Poppins-Bold", // Ensure you have this font installed
  },
});