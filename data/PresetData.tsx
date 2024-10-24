import { ImageSourcePropType } from "react-native";

export type Preset = {
    name: string,
    image: ImageSourcePropType;
    description: string,
};

export const Presets = [
    {
        name: 'ChillHop Radio',
        image: require('@/assets/images/chillhopradio.jpg'),
        description: 'dep trai'
    },
    {
        name: 'Chill Study Beat',
        image: require('@/assets/images/chillstudy.jpg'),
        description: 'dep trai'
    },
    {
        name: 'Essentials',
        image: require('@/assets/images/essentials.jpg'),
        description: 'dep trai'
    },
    {
        name: 'Sunny Day',
        image: require('@/assets/images/sunnyday.jpg'),
        description: 'dep trai'
    },
    {
        name: 'Late Night',
        image: require('@/assets/images/latenight.jpg'),
        description: 'dep trai'
    },
    {
        name: 'Test',
        image: require('@/assets/images/Mama Aiuto.jpg'),
        description: 'dep trai'
    }
]