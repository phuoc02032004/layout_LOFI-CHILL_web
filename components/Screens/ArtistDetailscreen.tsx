import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
  Dimensions,
  Alert,
  Platform,
  ScrollView,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { BlurView } from 'expo-blur';

import { getSpecificArtist, getArtistSong } from '@/services/artist';

import SongTracks from '../SongTracks/SongTracks';
import ArtistCarousel from '../Carousel/ArtistCarousel';


// Define interfaces separately for better readability
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

interface Artist {
  id: string;
  Description: string;
  name: string;
  urlImg: string;
  filePathImg: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  songs: Song[];
}

interface RouteParams {
  artistId: string;
}

const isRouteParams = (params: any): params is RouteParams => {
  return params && typeof params.artistId === 'string';
};


const ArtistDetailsScreen: React.FC = () => {
  const route = useRoute();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const [songs, setSongs] = useState<Song[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { width: windowWidth, height: windowHeight } = Dimensions.get('window'); // Destructuring for brevity


  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        if (isRouteParams(route.params)) {
          const { artistId } = route.params;

          // Fetch artist details first
          const artistResponse = await getSpecificArtist(artistId);
          if (artistResponse.err === 0) {
            setArtist(artistResponse.artist);

            // Fetch songs after getting artist data
            const songsResponse = await getArtistSong(artistId);
            if (songsResponse && songsResponse.songs) {
              setSongs(songsResponse.songs);
            } else {
              setError("Failed to load artist's songs");
              Alert.alert("Error", "Failed to load artist's songs");
            }
          } else {
            setError(`Failed to load artist details: ${artistResponse.mes}`);
            Alert.alert("Error", `Failed to load artist details: ${artistResponse.mes}`);
          }
        } else {
          setError("Invalid route parameters");
          Alert.alert("Error", "Invalid route parameters");
        }
      } catch (error: any) {
        setError(`An unexpected error occurred: ${error.message}`);
        Alert.alert("Error", `An unexpected error occurred: ${error.message}`);
        console.error('Error fetching artist details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtistData();
  }, [route.params]);

  // Improved conditional rendering with early exits
  if (loading) return <LoadingIndicator />;
  if (error) return <ErrorDisplay error={error} />;
  if (!artist) return <ErrorDisplay error="Artist not found" />;

  // Extract this into a separate component for better readability.
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ImageBackground
        source={{ uri: artist.urlImg || 'placeholder_image_url' }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <BlurView intensity={50} style={styles.blur} />
        <View style={styles.content}>
          <Image
            source={{ uri: artist.urlImg || 'placeholder_image_url' }}
            style={styles.artistImage}
            resizeMode="contain"
          />
          <Text style={styles.artistName}>{artist.name}</Text>
          <Text style={styles.artistDescription}>{artist.Description}</Text>
        </View>
      </ImageBackground>
      <View>
        <View>
          <View  style={styles.sectionContainer}> 
            <Text style={styles.sectionTitle}>Song Tracks</Text>
            <SongTracks songData={songs} />
          </View>
        </View>
        <View  style={styles.sectionContainer} >
          <Text style={styles.newsong}>ARTISTS</Text>
          <ArtistCarousel />
        </View>
      </View>
    </ScrollView>
  );
};


const LoadingIndicator = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#0000ff" />
  </View>
);

const ErrorDisplay = ({ error }: { error: string }) => (
  <Text style={styles.errorText}>{error}</Text>
);

const styles = StyleSheet.create({
  blursongstrack: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionContainer: {
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 7,
    elevation: 6, 
    paddingBottom:20,
  },
  container: {
    flexGrow: 1,
    backgroundColor: '#FFF4B7'
  },
  white: {
    height: 100,
  },
  newsong: {
    fontFamily: 'Poppins-Bold',
    fontSize: 30,
    color: '#333',
    paddingLeft: 30,
    paddingTop: 30,
    paddingBottom: 5,
  },
  songItem: {
    fontSize: 16,
    color: 'white',
    marginBottom: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    flex: 1,
    width: null,
    height: null,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blur: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  artistImage: {
    width: 200,
    height: 200,
    borderRadius: 75,
    marginBottom: 20,
    borderColor: '#fff',
  },
  artistName: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    marginBottom: 10,
  },
  artistDescription: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    lineHeight: 24,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 20,
    color: 'red',
  },
});

export default ArtistDetailsScreen;