const colors = require('tailwindcss/colors')

module.exports = {
  // @see https://tailwindcss.com/docs/upcoming-changes
  future: {
    // removeDeprecatedGapUtilities: true,
    // purgeLayersByDefault: true,
  },
  purge: ['./src/components/**/*.tsx', './pages/**/*.tsx'],
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
        gray: colors.coolGray,
        red: colors.rose,
      },
      transformOrigin: {
        'center-left': 'center left',
      },
    },
  },
  variants: {},
  plugins: [require('tailwindcss'), require('precss'), require('autoprefixer'), require('@tailwindcss/line-clamp')],

  darkMode: false, // or 'media' or 'class'
}
