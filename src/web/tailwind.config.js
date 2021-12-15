const colors = require('tailwindcss/colors')
const plugin = require('tailwindcss/plugin')
module.exports = {
  // @see https://tailwindcss.com/docs/upcoming-changes
  future: {
    // removeDeprecatedGapUtilities: true,
    // purgeLayersByDefault: true,
  },
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      flex: {
        2: '2 2 0%',
        3: '3 3 0%',
      },
      flexGrow: {
        3: 3,
      },
      colors: {
        gray: colors.neutral,
        red: colors.rose,
        cyan: colors.cyan,
        sky: colors.sky,
        pink: colors.pink,
      },
      transformOrigin: {
        'center-left': 'center left',
      },
      boxShadow: {
        l2xl: '0 0 50px rgba(0, 0, 0, 0.25)',
        underline: '0 1px 0 rgba(0, 0, 0, 0.25)',
      },
    },
  },
  variants: {
    overflow: ['responsive', 'hover'],
  },
  plugins: [
    require('tailwindcss'),
    require('precss'),
    require('autoprefixer'),
    require('@tailwindcss/line-clamp'),
    plugin(function ({ addComponents }) {
      addComponents({
        '.text-shadow': {
          textShadow: '1px 1px 0 white',
        },
      })
    }),
  ],

  darkMode: false, // or 'media' or 'class'
}
