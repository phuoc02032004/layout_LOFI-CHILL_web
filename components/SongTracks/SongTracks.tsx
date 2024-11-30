import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';  // Thư viện biểu tượng FontAwesome

interface SongTracksProps {
    songData: Song | Song[];
}

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

const Track: React.FC<SongTracksProps> = ({ songData }) => {
    const isSingleSong = !Array.isArray(songData);
    const data = isSingleSong ? [songData] : songData;
    return (
        <View style={styles.container}>
            <FlatList
                data={data}
                keyExtractor={(item, index) => item.id || index.toString()}
                nestedScrollEnabled={true}
                renderItem={({ item }) => (
                    <View style={styles.trackItem}>
                        <View style={styles.trackLeft}>
                            <Image source={{ uri: item.urlImg }} style={styles.albumCover} />
                            <Text style={styles.songTitle}>{item.Title}</Text>
                        </View>
                        <View style={styles.trackRight}>
                            <Text style={styles.trackDuration}>03:45</Text> {/* Thời lượng tạm thời, nên lấy từ item.duration nếu có */}
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
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    trackDuration: {
        fontSize: 14,
        color: 'gray',
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
