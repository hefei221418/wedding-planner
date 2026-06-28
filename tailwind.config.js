/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // 暖调深色主题
        bg:      '#1B1918',   // 主背景
        surf:    '#242221',   // 卡片背景
        elev:    '#302D2C',   // 弹窗/悬浮
        border:  '#3A3634',   // 边框
        ink:     '#EDE9E3',   // 主文字（暖白）
        soft:    '#9A9490',   // 次要文字
        mute:    '#6B6662',   // 最淡文字

        mauve:   '#C9A9A9',   // 主色 灰粉
        deepmauve:'#A87E7E',  // 深粉（强调）
        sage:    '#8A9E85',   // 绿灰（确认/成功）
        amber:   '#C4A882',   // 暖金（待处理）
        blush:   '#D4B5A0',   // 暖粉
        red:     '#C47A7A',   // 错误/删除

        // 保留旧名兼容
        cream:   '#1B1918',
        warm:    '#2A2827',
        deeprose:'#A87E7E',
        rose:    '#C9A9A9',
        softink: '#9A9490',
        water:   '#8A9E95',
      },
      fontFamily: {
        sans: ['"PingFang SC"', '"Noto Sans SC"', '"Microsoft YaHei"', 'sans-serif'],
        serif: ['"Noto Serif SC"', '"SimSun"', 'serif'],
      },
      borderRadius: {
        'xl': '14px', '2xl': '18px', '3xl': '24px',
      },
    },
  },
  plugins: [],
}
