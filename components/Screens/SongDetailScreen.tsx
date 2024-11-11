import React from 'react';
import { View, Text, Image, ImageBackground, StyleSheet, ScrollView } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Song, Songs } from '@/data/SongData';
import SongCarousel from '../Carousel/SongCarousel';
import ArtistCarousel from '../Carousel/ArtistCarousel';
import { ImageSlider, ImageSliderType } from '@/data/SliderData';
import { FlatList } from 'react-native-gesture-handler';
import SongTracks from '../SongTracks/SongTracks';

type RootStackParamList = {
    SongDetailScreen: { song: Song };
};

type SongDetailScreenRouteProp = RouteProp<RootStackParamList, 'SongDetailScreen'>;



const SongDetailScreen = () => {
    const route = useRoute<SongDetailScreenRouteProp>();
    const { song } = route.params;

    const getArtistById = (artistId: number) => ImageSlider.find(artist => artist.id === artistId);

    return (
        <ScrollView style={styles.scrollView}>
            <ImageBackground
                source={song.image}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <View>
                    <View style={styles.song_detail}>
                        <View style={styles.overlay} />
                        <Text style={styles.title}>{song.name}</Text>
                        <Text style={styles.desc}>{song.description}</Text>
                    </View>

                </View>
            </ImageBackground>

            <View style={styles.container}>
                <Text style={styles.textartist}>Name of Artist</Text>
                <FlatList
                    data={song.artistIds}
                    keyExtractor={(item) => item.toString()}
                    horizontal={true}
                    renderItem={({ item }) => {
                        const artist = getArtistById(item);
                        return artist ? (
                            <View style={styles.artistContainer}>
                                <Image source={artist.image} style={styles.artistImage} />
                                <Text style={styles.artistName}>{artist.name}</Text>
                            </View>
                        ) : null;
                    }}
                    contentContainerStyle={styles.artistList}
                    showsHorizontalScrollIndicator={false}
                />
                <Text style={styles.newsong}>Song Tracks</Text>
                <SongTracks />
                <Text style={styles.newsong}>NEW SONG</Text>
                <SongCarousel itemSong={Songs} />
                <Text style={styles.newsong}>ARTISTS</Text>
                <ArtistCarousel itemArtist={ImageSlider} />
            </View>
        </ScrollView>
    );
};

export default SongDetailScreen;

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    backgroundImage: {
        height: 500, // Chiều cao của ảnh nền, điều chỉnh theo ý muốn
        justifyContent: 'center',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.7,
        shadowRadius: 6,
        elevation: 7,
        opacity: 0.5,
    },
    artistList: {
        marginVertical: 10,
    },
    textartist: {
        color: '#fffff',
        fontFamily: 'Poppins-Bold',
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 10,
        paddingLeft: 5,
    },

    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#FFF4B7',
    },
    song_detail: {
        alignItems: 'center',
        marginBottom: 20,

    },
    title: {
        fontSize: 24,
        fontFamily: 'Poppins-Bold',
        color: '#333',
        textAlign: 'center',
        marginVertical: 10,
    },
    desc: {
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        paddingHorizontal: 15,
        marginVertical: 10,
    },
    newsong: {
        fontFamily: 'Poppins-Bold',
        fontSize: 26,
        color: '#333',
        marginTop: 30,
        marginBottom: 10,
        paddingLeft: 10,
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
});
