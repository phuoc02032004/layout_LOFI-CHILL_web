import React, { useRef, useState, useEffect } from 'react';
import { View, Text, Image, ImageBackground, StyleSheet, Platform } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { RouteProp, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import SongCarousel from '../Carousel/SongCarousel';
import ArtistCarousel from '../Carousel/ArtistCarousel';
import { ImageSlider, ImageSliderType } from '@/data/SliderData';
import { FlatList } from 'react-native-gesture-handler';
import SongTracks from '../SongTracks/SongTracks';
import { BlurView } from 'expo-blur';
import { ImageSourcePropType } from 'react-native';

type RootStackParamList = {
    SongDetailScreen: { song: Song };
};

interface SongDetailScreenRouteProp extends RouteProp<RootStackParamList, 'SongDetailScreen'> {
    params: { song: Song; artistId: string };
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
    createdAt: {
        _seconds: number;
        _nanoseconds: number;
    };
    updatedAt: {
        _seconds: number;
        _nanoseconds: number;
    };
}

const SongDetailScreen = () => {
    const route = useRoute<SongDetailScreenRouteProp>();
    const { song, artistId } = route.params;
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const getArtistById = (artistId: number) => ImageSlider.find(artist => artist.id === artistId);
    const imageSource = typeof song.urlImg === 'string' && song.urlImg.trim().length > 0 ? { uri: song.urlImg } : require('@/assets/images/essentials.jpg'); if (!song) {
        return <Text>No song data</Text>;
    }
    useEffect(() => {
        const getAccessToken = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('accessToken');
                console.log(storedToken)
                setAccessToken(storedToken);
            } catch (error) {
                console.error("Error getting access token:", error);
            }
        };
        getAccessToken();
    }, []);



    return (
        <ScrollView scrollEnabled={false} style={styles.scrollView}>
            <ImageBackground
                source={{ uri: song.urlImg }}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <BlurView intensity={50} style={StyleSheet.absoluteFillObject} >
                <View style={styles.song_detail}>
                    <Text style={styles.title}>{song.Title}</Text>
                    <Text style={styles.desc}>{song.Description}</Text>
                </View>
                </BlurView>
            </ImageBackground>

            <View style={styles.container}>
                <Text style={styles.textartist}>Name of Artist</Text>
                <FlatList
                    data={[song.ArtistId]}
                    keyExtractor={(item) => item.toString()}
                    horizontal={true}
                    nestedScrollEnabled={true}
                    renderItem={({ item }) => {
                        const artist = getArtistById(parseInt(item, 10));
                        return artist && artist.image ? ( //Check if artist and image exist
                            <View style={styles.artistContainer}>
                                {/* <Image
                                    source={{ uri: artist.image }} // Corrected source
                                    style={styles.artistImage}
                                /> */}

                                <Text style={styles.artistName}>{artist.name}</Text>
                            </View>
                        ) : null;
                    }}
                    contentContainerStyle={styles.artistList}
                    showsHorizontalScrollIndicator={false}
                />
                <View>
                    <Text style={styles.newsong}>Song Tracks</Text>
                    <View> 
                        <SongTracks songData={song} />
                    </View>
                </View>
                <View>
                    <Text style={styles.newsong}>NEW SONG</Text>
                    <View> 
                        {accessToken && <SongCarousel accessToken={accessToken} />}
                    </View>
                </View>
            </View>

            <View style={styles.spacewhite}></View>
        </ScrollView>
    );
};

export default SongDetailScreen;

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    backgroundImage: {
        flex: 1,
        justifyContent: 'center',
        height: 750,
    },
    song_detail: {
        marginTop:250,
        alignItems: 'center',

        padding: 20,
    },
    title: {
        fontSize: 24,
        fontFamily: 'Poppins-Bold',
        color: '#fff',
        textAlign: 'center',
        marginVertical: 10,
    },
    desc: {
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
        paddingHorizontal: 15,
        marginVertical: 10,
    },
    textartist: {
        color: 'black',
        fontFamily: 'Poppins-Bold',
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 10,
        paddingLeft: 5,
    },
    container: {
        flex: 1,
        backgroundColor: '#FFF4B7',
    },
    newsong: {
        fontFamily: 'Poppins-Bold',
        fontSize: 26,
        color: '#333',
        marginTop: 20,
        paddingLeft: 5,
    },
    artistList: {
        marginVertical: 0,
    },
    artistContainer: {
        alignItems: 'center',
        marginHorizontal: 20,
    },
    artistImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    artistName: {
        fontFamily: 'Poppins-Bold',
        fontSize: 18,
        color: '#333',
    },
    spacewhite: {
        height: 10,
    }
});