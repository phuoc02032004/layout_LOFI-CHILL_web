import React, { useState } from 'react';
import { View, FlatList, Image, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { ImageSlider, ImageSliderType } from '@/data/SliderData';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';


type RootStackParamList = {
    ArtistDetailscreen: { artistId: number };
    Artscreen: undefined; // thêm dòng này nếu màn hình này cũng thuộc stack
};

type SongscreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Artscreen'>;

//Chuyển hướng trang


const Artscreen = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 5;

    const navigation = useNavigation<SongscreenNavigationProp>();

    // Lấy dữ liệu cho trang hiện tại
    const currentItems = ImageSlider.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    const renderItem = ({ item }: { item: ImageSliderType }) => (
        <TouchableOpacity onPress={() => navigation.navigate('ArtistDetailscreen', { artistId: item.id })}>
            <View style={styles.card}>
                <Image source={item.image} style={styles.image} />
                <Text style={styles.name}>{item.name}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={currentItems}
                renderItem={renderItem}
                keyExtractor={(item) => item.name}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={<View style={styles.footerSpace} />}
            />

            {/* Overlay cho phân trang */}
            <View style={styles.paginationContainer}>
                {Array.from({ length: Math.ceil(ImageSlider.length / itemsPerPage) }, (_, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.pageButton,
                            index === currentPage && styles.activePage,
                        ]}
                        onPress={() => setCurrentPage(index)}
                    >
                        <Text style={styles.pageText}>{index + 1}</Text>
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
        padding: 10,
    },
    card: {
        backgroundColor: '#FFF6E3',
        borderRadius: 15,
        padding: 16,
        marginBottom: 30,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.1)', // Viền mềm mại
        shadowColor: '#FFEEAD',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15, // Hiệu ứng bóng mờ
        shadowRadius: 10,
        elevation: 5, // Hiệu ứng nổi nhẹ
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: '#BC7C7C', 
        marginBottom: 10,
    },
    name: {
        fontSize: 18,
        fontWeight: '600',
        color: '#34495e',
        marginTop: 8,
    },
    description: {
        fontSize: 14,
        color: '#7f8c8d',
        marginTop: 4,
        textAlign: 'center', // Canh giữa mô tả
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
    },
    pageButton: {
        marginBottom: 70,
        marginHorizontal: 5,
        padding: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderRadius: 15,
    },
    activePage: {
        backgroundColor: '#34495e', // Màu nền cho trang hiện tại
    },
    pageText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    footerSpace: {
        height: 80, // Chiều cao khoảng trống ở cuối
    },
});

export default Artscreen;
