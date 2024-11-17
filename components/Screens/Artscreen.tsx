import React, { useState, useEffect } from 'react';
import { View, FlatList, Image, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getAllArtist } from '@/services/artist'; 
import { BlurView } from 'expo-blur';

type RootStackParamList = {
  ArtistDetailscreen: { artistId: string };
  Artscreen: undefined;
};

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

type SongscreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Artscreen'>;

const Artscreen: React.FC = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation<SongscreenNavigationProp>();

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const fetchedArtists = await getAllArtist();
        setArtists(fetchedArtists);
      } catch (err: any) {
        setError("Failed to load artists. Please check your network connection."); // More user-friendly error message.
        Alert.alert("Error", "Failed to load artists. Please check your network connection."); // Show an alert to the user
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, []);

  const renderItem = ({ item }: { item: Artist }) => (
    
    <TouchableOpacity onPress={() => navigation.navigate('ArtistDetailscreen', { artistId: item.id })}>
      <View style={styles.card}>
        <Image source={{ uri: item.urlImg || 'placeholder_image_url' }}
               style={styles.image}
               resizeMode="cover"
        />
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.description} numberOfLines={2}>{item.Description}</Text>
      </View>
    </TouchableOpacity>
    
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={{ flex: 1, justifyContent: 'center' }} />; //Center the indicator
  }

  if (error) {
    return <Text style={{ textAlign: 'center', marginTop: 20 }}>{error}</Text>; // Center the error message
  }

  return (
    <FlatList
      data={artists}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>No artists found.</Text>} //Handle empty list
    />
  );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    blurContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderColor: 'rgba(255, 255, 255, 0.2)',
      },
    card: {
        backgroundColor: '#fff',
        margin: 10,
        padding: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 10,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
    },
    description: {
        fontSize: 14,
        marginTop: 5,
    },
});
export { RootStackParamList };
export default Artscreen;