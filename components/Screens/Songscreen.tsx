import React, { useState } from 'react';
import { View, FlatList, Image, Text, StyleSheet,  TouchableOpacity } from 'react-native';
import { Songs, Song } from '@/data/SongData';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
    SongDetailScreen: { song: Song };
    Songscreen: undefined; // thêm dòng này nếu màn hình này cũng thuộc stack
};

type SongscreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Songscreen'>;
    

const Songscreen = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 5; // Số bài hát mỗi trang


    // Lấy dữ liệu cho trang hiện tại
    const currentSongs = Songs.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
    const totalPages = Math.ceil(Songs.length / itemsPerPage);

    //Chuyển hướng trang
    const navigation = useNavigation<SongscreenNavigationProp>();
    

    const renderItem = ({ item }: { item: Song }) => ( // Khai báo kiểu cho item

        <TouchableOpacity onPress={() => navigation.navigate('SongDetailScreen', { song: item })}>
            <View style={styles.card}>
                <Image source={item.image} style={styles.image} />
                <Text style={styles.name}>{item.name}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={currentSongs}
                renderItem={renderItem}
                keyExtractor={(item) => item.name} 
                showsVerticalScrollIndicator={false}
                ListFooterComponent={<View style={styles.footerSpace} />}
            />
            {/* Overlay cho các số trang */}
            <View style={styles.overlay}>
                {Array.from({ length: totalPages }, (_, index) => (
                    <TouchableOpacity key={index} onPress={() => setCurrentPage(index)}>
                        <Text style={[styles.pageButton, currentPage === index && styles.activePage]}>
                            {index + 1}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF4B7',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        margin: 10,
    },
    overlay: {
        position: 'absolute',
        bottom: 90,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    pageButton: {
        marginBottom: 10,
        marginHorizontal: 5,
        padding: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderRadius: 15,
    },
    activePage: {
        backgroundColor: '#34495e', // Màu nền cho trang đang hoạt động
        color: '#fff', // Màu chữ cho trang đang hoạt động
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 16,
        margin: 10,
        elevation: 3,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 10,
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    artist: {
        fontSize: 16,
        color: '#666',
    },
    description: {
        fontSize: 14,
        color: '#888',
    },
    footerSpace: {
        height: 80, // Chiều cao khoảng trống ở cuối
    },
});
export default Songscreen;
