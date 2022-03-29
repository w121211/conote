// module.exports = {
//   "stories": [
//     "../stories/**/*.stories.mdx",
//     "../stories/**/*.stories.@(js|jsx|ts|tsx)"
//   ],
//   "addons": [
//     "@storybook/addon-links",
//     "@storybook/addon-essentials"
//   ]
// }
const path = require('path')

const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

// module.exports = {

// }
// Export a function. Accept the base config as the only param.
module.exports = {
  stories: ['../stories/**/*.stories.tsx'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-viewport',
    {
      name: '@storybook/addon-docs',
      options: {
        configureJSX: true,
        babelOptions: {},
        sourceLoaderOptions: null,
        transcludeMarkdown: true,
      },
    },
    '@storybook/addon-controls',
    '@storybook/addon-backgrounds',
    '@storybook/addon-toolbars',
    '@storybook/addon-measure',
    '@storybook/addon-outline',
    '@storybook/addon-actions',
    'storybook-addon-apollo-client',
    'storybook-addon-next-router',
    {
      /**
       * Fix Storybook issue with PostCSS@8
       * @see https://github.com/storybookjs/storybook/issues/12668#issuecomment-773958085
       */
      name: '@storybook/addon-postcss',
      options: {
        cssLoaderOptions: {
          // When you have splitted your css over multiple files
          // and use @import('./other-styles.css')
          importLoaders: 1,
        },
        postcssLoaderOptions: {
          implementation: require('postcss'),
        },
      },
    },
  ],
  framework: '@storybook/react',
  // include: path.resolve(__dirname, 'assets/svg'),
  // typescript: {
  //   tsconfigPath: 'tsconfig.build.json',
  // },

  webpackFinal: async config => {
    config.module.rules.push(
      {
        test: /\.(tsx|graphql)$/,
        use: [
          { loader: 'babel-loader', options: { presets: ['@babel/preset-typescript', '@babel/preset-react'] } },
          { loader: 'graphql-let/loader' },
        ],
      },
      //   {
      //   test: /\.graphql$/,
      //   exclude: /node_modules/,
      //   loader: 'graphql-tag/loader',
      // }
    )
    // add SCSS support for CSS Modules
    // config.module.rules.push({
    //   test: /\.scss$/,
    //   use: [
    //     'style-loader',
    //     'css-loader?modules&importLoaders',
    //     {
    //       loader: 'sass-loader',
    //       options: {
    //         sassOptions: { includePaths: ['./src'] },
    //         additionalData: `@import "style/variables.scss";`,
    //       },
    //     },
    //   ],
    //   include: path.resolve(__dirname, '../'),
    // })
    // config.module.rules.unshift({
    //   test: /\.svg$/,
    //   use: ['@svgr/webpack'],
    //   include: path.resolve(__dirname, '../'),
    // })
    // const fileLoaderRule = config.module.rules.find(rule => rule.test && rule.test.test('.svg'))
    // fileLoaderRule.exclude = /\.svg$/

    // config.module.rules.push({
    //   test: /\.svg$/,
    //   enforce: 'pre',
    //   loader: require.resolve('@svgr/webpack'),
    // })
    // config.module.rules.push({
    //   test: /\,css&/,
    //   use: [
    //     {
    //       loader: 'postcss-loader',
    //       options: {
    //         ident: 'postcss',
    //         plugins: [require('tailwindcss'), require('autoprefixer')],
    //       },
    //     },
    //   ],
    //   include: path.resolve(__dirname, '../'),
    // })
    return config
  },
}
