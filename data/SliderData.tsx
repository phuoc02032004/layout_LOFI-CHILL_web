import { ImageSourcePropType } from "react-native";

export type ImageSliderType = {
    id: number; // ID nghệ sĩ
    name: string;
    image: ImageSourcePropType;
    description: string;
};

export const ImageSlider: ImageSliderType[] = [
    {
        id: 1,
        name: 'Phát',
        image: require('@/assets/images/Aso.jpg'),
        description: 'Đẹp trai'
    },
    {
        id: 2,
        name: 'Phước',
        image: require('@/assets/images/CYGN.jpg'),
        description: 'Đẹp trai'
    },
    {
        id: 3,
        name: 'Phú',
        image: require('@/assets/images/ivention_.jpg'),
        description: 'Đẹp trai'
    },
    {
        id: 4,
        name: 'Khánh',
        image: require('@/assets/images/Kupla.jpg'),
        description: 'Đẹp trai'
    },
    {
        id: 5,
        name: 'Leavv',
        image: require('@/assets/images/Leavv.jpg'),
        description: 'Đẹp trai'
    },
    {
        id: 6,
        name: 'Mama Aiuto',
        image: require('@/assets/images/Mama Aiuto.jpg'),
        description: 'Đẹp trai'
    }
];
