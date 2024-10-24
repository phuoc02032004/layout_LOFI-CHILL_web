import { ImageSourcePropType } from "react-native";

export type Song = {
    name: string;
    image: ImageSourcePropType;
    artist?: string;
    description: string; 
};

export const Songs: Song[] = [
    {
        name: 'Winter Chill',
        image: require('@/assets/images/winter.jpg'),
        artist: 'Psalm Trees',
        description: "Một bản nhạc êm dịu và đầy không khí gợi lên sự yên bình của khung cảnh tuyết rơi. Với giai điệu piano tinh tế, tiếng dây mềm mại, và kết cấu âm thanh ambient, lý tưởng cho việc thư giãn hoặc tạo không khí yên tĩnh."
    },
    {
        name: 'Slinky Groove',
        image: require('@/assets/images/slinky.jpg'),
        artist: 'Makzo',
        description: "Một giai điệu funky và sôi động với giai điệu bắt tai và nhịp điệu mạnh mẽ. Với tiếng bass groovy, guitar funky và một chút brass, hoàn hảo cho việc nhảy múa hoặc thêm năng lượng vào ngày của bạn."
    },
    {
        name: 'Night Vibes',
        image: require('@/assets/images/night.jpg'),
        artist: 'Leavv',
        description: "Một bản nhạc nhẹ nhàng và quyến rũ với cảm giác thoải mái. Với những phím đàn mềm mại, giai điệu saxophone êm ái, và nhịp điệu ổn định, hoàn hảo cho những chuyến lái xe đêm muộn hoặc buổi tối lãng mạn."
    },
    {
        name: 'Meadow Peace',
        image: require('@/assets/images/Meadow.jpg'),
        artist: 'mommy',
        description: "Một bản nhạc bình yên và tươi sáng lấy cảm hứng từ vẻ đẹp của thiên nhiên. Với giai điệu guitar mộc mạc, giai điệu sáo dịu dàng và âm thanh thiên nhiên, lý tưởng cho thiền, yoga hoặc tìm kiếm sự bình yên nội tâm."
    },
    {
        name: 'Good Morning',
        image: require('@/assets/images/goodmorning.jpg'),
        artist: 'FloFilz',
        description: "Một bản nhạc tươi vui và sảng khoái để bắt đầu ngày mới của bạn. Với giai điệu ukulele vui nhộn, tiếng chuông tinh nghịch và năng lượng tươi sáng, hoàn hảo để đánh thức, chuẩn bị hoặc đơn giản là nâng cao tinh thần."
    },
    {
        name: 'Winter Chill',
        image: require('@/assets/images/winter.jpg'),
        description: "Một bản nhạc êm dịu và đầy không khí gợi lên sự yên bình của khung cảnh tuyết rơi. Với giai điệu piano tinh tế, tiếng dây mềm mại, và kết cấu âm thanh ambient, lý tưởng cho việc thư giãn hoặc tạo không khí yên tĩnh."
    },
    {
        name: 'Slinky Groove',
        image: require('@/assets/images/slinky.jpg'),
        artist: 'Makzo',
        description: "Một giai điệu funky và sôi động với giai điệu bắt tai và nhịp điệu mạnh mẽ. Với tiếng bass groovy, guitar funky và một chút brass, hoàn hảo cho việc nhảy múa hoặc thêm năng lượng vào ngày của bạn."
    }
];
