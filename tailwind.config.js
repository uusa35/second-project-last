/**
 * @type {import('@types/tailwindcss/tailwind-config').TailwindConfig}
 */
module.exports = {
  content: [
    './src/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}',
    './node_modules/flowbite-react/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        primary_BG: '#189EC9',
        primaryLight: '#24abd6',
        DarkBlue: '#141E3C',
        GreyBG: '#E0E0E0',
        LightGray: '#F8F8F8',
        LightGray2: '#F2F2F2',
        SearchGrey: '#DEDEDE',
        LighterGray: '#FAFAFA',
        InputGray: '#B4B4B4',
        DarkGrey: '#989898',
        TransparentWhite: '#fafafa40',
        customGreen: '#05BA3D',
        CustomRed: '#FF4852',
        HistoryBG: '#EFEFEF',
      },
      boxShadow: {
        custome: '2px 2px 16px #00000029',
        HomeCard: '0px 0px 10px 0px #00000029',
        CardTop: '0px -4px 14px .1px #00000029',
        CardBottom: '0px 6px 10px 0.1px #00000029',
      },
      fontSize: {
        xxs: '.6rem',
      },
      fontFamily: {
        'Tajawal-Medium': ['Tajawal-Medium', 'sans-serif'],
        'Futura-Bold-font': ['Futura-Bold-font', 'sans-serif'],
      },
      minHeight: {
        5: '5rem',
      },
    },
  },
  variants: {
    gridColumn: ['last', 'rtl'],
  },
  plugins: [
    require('flowbite/plugin'),
    require('tailwindcss-rtl'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/typography'),
    require('flowbite/plugin'),
  ],
  debug: false,
};
