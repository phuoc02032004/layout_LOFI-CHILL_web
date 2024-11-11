import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';  // Thư viện biểu tượng FontAwesome

import { Songs } from '../../data/SongData'; 
import { ImageSlider } from '../../data/SliderData'; 

const Track = () => {
    return (
        <View style={styles.container}>
            {Songs.map(song => {
                const artist = ImageSlider.filter(artist => song.artistIds.includes(artist.id));

                return (
                    <View key={song.id} style={styles.trackItem}>
                        <View style={styles.trackLeft}>
                            <Image source={song.image} style={styles.albumCover} />

                            <View style={styles.trackInfo}>
                                <Text style={styles.songTitle}>{song.name}</Text>
                                {artist.map((artistInfo) => (
                                    <Text key={artistInfo.id} style={styles.artistName}>{artistInfo.name}</Text>
                                ))}
                            </View>
                        </View>

                        <View style={styles.trackRight}>
                            <View style={styles.trackControls}>
                                <TouchableOpacity style={styles.controlButton}>
                                    <Icon name="play" size={24} color="#000" />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.controlButton}>
                                    <Icon name="heart" size={24} color="#e74c3c" />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.controlButton}>
                                    <Icon name="plus" size={24} color="#3498db" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    trackItem: {
        flexDirection: 'row',
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        paddingBottom: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',  // Màu trắng với độ trong suốt (opacity)
        borderRadius: 8,  
        paddingHorizontal: 15, 
        padding: 10,
    },
    trackLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 2,  // Điều chỉnh flex để tạo khoảng cách hợp lý
    },
    albumCover: {
        width: 70,
        height: 70,
        borderRadius: 5,
        marginRight: 15,
        borderWidth: 1,
        borderColor: '#ddd',  // Thêm border cho album cover
    },
    trackInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    songTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',  // Thêm màu cho tên bài hát
    },
    artistName: {
        fontSize: 14,
        color: '#777',
        marginTop: 5,
    },
    trackRight: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    trackControls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 130,  // Đặt width cố định cho các nút điều khiển
        marginTop: 10,
    },
    controlButton: {
        padding: 8,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',  // Thêm bóng đổ cho nút
        shadowOpacity: 0.4,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
    },
});

export default Track;
