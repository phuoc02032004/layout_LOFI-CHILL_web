import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Song } from '@/data/SongData';

type RootStackParamList = {
    SongDetailScreen: { song: Song };
};

type SongDetailScreenRouteProp = RouteProp<RootStackParamList, 'SongDetailScreen'>;

const SongDetailScreen = () => {
    const route = useRoute<SongDetailScreenRouteProp>();
    const { song } = route.params;

    return (
        <View style={styles.container}>
            <View style={styles.song_detail}>
                <View style={styles.image}>
                    <Image source={song.image} style={{ width: 200, height: 200 }} />
                </View>
                <Text style={styles.title}>{song.name}</Text>
                <Text style={styles.desc} >{song.description}</Text>
            </View>
            <View style={styles.art_detail}>
                 {/* <Text style={styles.art_name}>{song.}</Text> */}
            </View>
        </View>
    );
};

export default SongDetailScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    image: {
        width: 500,
        height: 220,
    },
    title: {
        fontSize: 24,
        fontFamily: 'Poppins-Bold',
        
    },
    art_name: {
        fontFamily: 'Poppins-Bold',
        fontSize: 18
    },
    desc: {
        fontFamily: 'Poppins',
        paddingTop:10 ,
        paddingBottom:20 ,
    },
    song_detail: {

    },
    art_detail: {

    }
});

