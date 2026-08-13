const brand = {
  centerName: 'Trung tâm Tiếng Trung Thư Mẫn',
  shortName: 'Thư Mẫn HSK',
  tagline: 'Học chắc nền tảng · Luyện HSK hiệu quả',

  // Logo tạm theo bộ nhận diện Thư Mẫn.
  // Khi có logo chính thức, chỉ cần thay public/logo.svg hoặc đổi đường dẫn bên dưới.
  logo: '/logo.jpg',

  // Bộ màu thương hiệu: Trắng + Xanh #015291.
  // #00000 được hiểu là màu trắng #FFFFFF theo mô tả của trung tâm.
  colors: {
    primary: '#015291',
    primaryDark: '#003B69',
    secondary: '#2F7FB5',
    secondarySoft: '#EAF3F9',

    // Màu nền/chữ trung tính: ưu tiên khả năng đọc, không ép theo màu thương hiệu.
    background: '#FFFFFF',
    surface: '#FFFFFF',
    surfaceDeep: '#F7F9FB',
    card: '#FFFFFF',
    ink: '#111111',
    muted: '#667085',
    border: '#D7DEE5',

    // Màu trạng thái chức năng.
    success: '#16A34A',
    successSoft: '#DCFCE7',
    danger: '#DC2626',
    dangerSoft: '#FEE2E2',
  },

  // Font Việt và font Trung dùng độc lập.
  fonts: {
    vietnamese: "'Roboto', Arial, sans-serif",
    chinese: "'Noto Serif SC', 'Songti SC', SimSun, serif",
    display: "'Roboto', Arial, sans-serif",
  },
}

export default brand
