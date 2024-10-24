import { ImageSourcePropType } from "react-native";

export type Background = {
    name: String,
    Thumnail: ImageSourcePropType;
    video: String,
    description: string,
};

export const Backgrounds = [
    {
        name: 'Beach',
        Thumnail: require('@/assets/images/imgBeach.jpg'),
        video: require('@/assets/videos/Beach.mp4'),
        description: "Bien"
    },
    {
        name:'Bedroom',
        Thumnail: require('@/assets/images/imgBedroom.jpg'),
        video: require('@/assets/videos/Bedroom.mp4'),
        description: 'trong phong' 
    },
    {
        name: 'Chill Study',
        Thumnail: require('@/assets/images/imgChill.jpg'),
        video: require('@/assets/videos/ChillStudy.mp4'),
        description: 'hoc'
    },
    {
        name: 'Endlss Stroll',
        Thumnail: require('@/assets/images/imgendless.jpg'),
        video: require('@/assets/videos/EndlessStroll.mp4'),
        description: 'hoc'
    },
    {
        name: 'Late night',
        Thumnail: require('@/assets/images/imglate.jpg'),
        video: require('@/assets/videos/Latenight.mp4'),
        description: 'hoc'
    },
    {
        name: 'Summer',
        Thumnail: require('@/assets/images/imgSummer.jpg'),
        video: require('@/assets/videos/Summer.mp4'),
        description: 'hoc'
    },
]