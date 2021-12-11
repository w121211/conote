const colors = require('tailwindcss/colors')
// const plugin = require('tailwindcss/plugin')
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
        gray: colors.trueGray,
        red: colors.rose,
      },
      transformOrigin: {
        'center-left': 'center left',
      },
      boxShadow: {
        l2xl: '0 0 50px rgba(0, 0, 0, 0.25)',
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
    // plugin(function({addVariant,e,postcss}){
    //   addVariant('parent',({modifySelectors,seperator})=>{
    //     modifySelectors(({className})=>{return ``})
    //   })
    // })
  ],

  darkMode: false, // or 'media' or 'class'
}
