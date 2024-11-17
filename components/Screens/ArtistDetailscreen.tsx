import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator, ImageBackground, Dimensions, Alert, Platform } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { getSpecificArtist } from '@/services/artist';
import { BlurView } from 'expo-blur';

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
  const [error, setError] = useState<string | null>(null);
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        if (isRouteParams(route.params)) {
          const { artistId } = route.params;
          const response = await getSpecificArtist(artistId);
          if (response.err === 0) {
            setArtist(response.artist);
          } else {
            setError(`Failed to load artist details: ${response.mes}`);
            Alert.alert("Error", `Failed to load artist details: ${response.mes}`);
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  if (!artist) {
    return <Text style={styles.errorText}>Artist not found</Text>;
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: artist.urlImg || 'placeholder_image_url' }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <BlurView intensity={50} style={styles.blur} /> {/* Blurred overlay */}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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