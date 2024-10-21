import { ImageSourcePropType } from "react-native";

export type ImageSliderType = {
    name: string,
    image: ImageSourcePropType;
    decreption: string,
};

export const ImageSlider = [
    {
        name: 'Phát',
        image: require('@/assets/images/Aso.jpg'),
        decreption: 'dep trai'
    },
    {
        name: 'Phuớc',
        image: require('@/assets/images/CYGN.jpg'),
        decreption: 'dep trai'
    },
    {
        name: 'Phú',
        image: require('@/assets/images/ivention_.jpg'),
        decreption: 'dep trai'
    },
    {
        name: 'Khánh',
        image: require('@/assets/images/Kupla.jpg'),
        decreption: 'dep trai'
    },
    {
        name: 'Leavv',
        image: require('@/assets/images/Leavv.jpg'),
        decreption: 'dep trai'
    },
    {
        name: 'Mama Aiuto',
        image: require('@/assets/images/Mama Aiuto.jpg'),
        decreption: 'dep trai'
    }
]