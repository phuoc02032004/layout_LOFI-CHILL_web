const tintColorLight = 'rgba(10, 126, 164, 0.8)'; // Màu xanh nhạt với độ trong suốt cho hiệu ứng glass
const tintColorDark = 'rgba(255, 255, 255, 0.8)'; // Màu trắng với độ trong suốt cho dark mode

export const Colors = {
  light: {
    text: '#11181C',
    background: 'rgba(255, 255, 255, 0.5)', // Nền trắng mờ với độ trong suốt
    tint: tintColorLight,
    icon: 'rgba(104, 112, 118, 0.8)', // Màu icon mờ
    tabIconDefault: 'rgba(104, 112, 118, 0.6)', // Màu xám mờ cho icon
    tabIconSelected: tintColorLight, // Màu xanh mờ khi chọn
  },
  dark: {
    text: '#ECEDEE',
    background: 'rgba(21, 23, 24, 0.7)', // Nền tối với độ trong suốt để trông giống kính mờ
    tint: tintColorDark,
    icon: 'rgba(155, 161, 166, 0.8)', // Màu icon mờ cho dark mode
    tabIconDefault: 'rgba(155, 161, 166, 0.6)', // Màu xám mờ cho dark mode
    tabIconSelected: tintColorDark, // Màu trắng mờ khi chọn
  },
};
