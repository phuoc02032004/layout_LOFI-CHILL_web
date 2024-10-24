import { ImageSourcePropType } from "react-native";

export type ImageSliderType = {
    name: string,
    image: ImageSourcePropType;
    description: String,
};

export const ImageSlider = [
    {
        name: 'Phát',
        image: require('@/assets/images/Aso.jpg'),
        description: 'dep trai'
    },
    {
        name: 'Phuớc',
        image: require('@/assets/images/CYGN.jpg'),
        description: 'dep trai'
    },
    {
        name: 'Phú',
        image: require('@/assets/images/ivention_.jpg'),
        description: 'dep trai'
    },
    {
        name: 'Khánh',
        image: require('@/assets/images/Kupla.jpg'),
        description: 'dep trai'
    },
    {
        name: 'Leavv',
        image: require('@/assets/images/Leavv.jpg'),
        description: 'dep trai'
    },
    {
        name: 'Mama Aiuto',
        image: require('@/assets/images/Mama Aiuto.jpg'),
        description: 'dep trai'
    }
]