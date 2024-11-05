import { ImageSourcePropType } from "react-native";

export type Song = {
    id: number; // ID bài hát
    name: string;
    image: ImageSourcePropType;
    artistId: number; // ID nghệ sĩ
    description: string; 
};

export const Songs: Song[] = [
    {
        id: 1,
        name: 'Winter Chill1',
        image: require('@/assets/images/winter.jpg'),
        artistId: 1, // ID tương ứng với nghệ sĩ
        description: "Một bản nhạc êm dịu và đầy không khí gợi lên sự yên bình của khung cảnh tuyết rơi. Với giai điệu piano tinh tế, tiếng dây mềm mại, và kết cấu âm thanh ambient, lý tưởng cho việc thư giãn hoặc tạo không khí yên tĩnh."
    },
    {
        id: 2,
        name: 'Slinky Groove1',
        image: require('@/assets/images/slinky.jpg'),
        artistId: 2,
        description: "Một giai điệu funky và sôi động với giai điệu bắt tai và nhịp điệu mạnh mẽ. Với tiếng bass groovy, guitar funky và một chút brass, hoàn hảo cho việc nhảy múa hoặc thêm năng lượng vào ngày của bạn."
    },
    {
        id: 3,
        name: 'Night Vibes',
        image: require('@/assets/images/night.jpg'),
        artistId: 3,
        description: "Một bản nhạc nhẹ nhàng và quyến rũ với cảm giác thoải mái. Với những phím đàn mềm mại, giai điệu saxophone êm ái, và nhịp điệu ổn định, hoàn hảo cho những chuyến lái xe đêm muộn hoặc buổi tối lãng mạn."
    },
    {
        id: 4,
        name: 'Meadow Peace',
        image: require('@/assets/images/Meadow.jpg'),
        artistId: 4,
        description: "Một bản nhạc bình yên và tươi sáng lấy cảm hứng từ vẻ đẹp của thiên nhiên. Với giai điệu guitar mộc mạc, giai điệu sáo dịu dàng và âm thanh thiên nhiên, lý tưởng cho thiền, yoga hoặc tìm kiếm sự bình yên nội tâm."
    },
    {
        id: 5,
        name: 'Good Morning',
        image: require('@/assets/images/goodmorning.jpg'),
        artistId: 2,
        description: "Một bản nhạc tươi vui và sảng khoái để bắt đầu ngày mới của bạn. Với giai điệu ukulele vui nhộn, tiếng chuông tinh nghịch và năng lượng tươi sáng, hoàn hảo để đánh thức, chuẩn bị hoặc đơn giản là nâng cao tinh thần."
    },
    {
        id: 6,
        name: 'Good Morning1',
        image: require('@/assets/images/goodmorning.jpg'),
        artistId: 2,
        description: "Một bản nhạc tươi vui và sảng khoái để bắt đầu ngày mới của bạn. Với giai điệu ukulele vui nhộn, tiếng chuông tinh nghịch và năng lượng tươi sáng, hoàn hảo để đánh thức, chuẩn bị hoặc đơn giản là nâng cao tinh thần."
    },
    {
        id: 7,
        name: 'Meadow Peace1',
        image: require('@/assets/images/Meadow.jpg'),
        artistId: 2,
        description: "Một bản nhạc bình yên và tươi sáng lấy cảm hứng từ vẻ đẹp của thiên nhiên. Với giai điệu guitar mộc mạc, giai điệu sáo dịu dàng và âm thanh thiên nhiên, lý tưởng cho thiền, yoga hoặc tìm kiếm sự bình yên nội tâm."
    },
];