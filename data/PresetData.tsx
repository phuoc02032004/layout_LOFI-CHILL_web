import { ImageSourcePropType } from "react-native";

export type Preset = {
    id: number;
    name: string,
    image: ImageSourcePropType;
    description: string,
};

export const Presets = [
    {
        id: 1,
        name: 'ChillHop Radio',
        image: require('@/assets/images/chillhopradio.jpg'),
        description: 'dep trai'
    },
    {
        id: 2,
        name: 'Chill Study Beat',
        image: require('@/assets/images/chillstudy.jpg'),
        description: 'dep trai'
    },
    {
        id: 3,
        name: 'Essentials',
        image: require('@/assets/images/essentials.jpg'),
        description: 'dep trai'
    },
    {
        id: 4,
        name: 'Sunny Day',
        image: require('@/assets/images/sunnyday.jpg'),
        description: 'dep trai'
    },
    {
        id: 5,
        name: 'Late Night',
        image: require('@/assets/images/latenight.jpg'),
        description: 'dep trai'
    },
    {
        id: 6,
        name: 'Test',
        image: require('@/assets/images/Mama Aiuto.jpg'),
        description: 'dep trai'
    }
]