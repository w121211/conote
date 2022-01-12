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
  stories: ['../components/**/*.stories.tsx'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',

    // '@storybook/addon-actions',
  ],

  webpackFinal: async config => {
    // add SCSS support for CSS Modules
    config.module.rules.push({
      test: /\.scss$/,
      use: [
        'style-loader',
        'css-loader?modules&importLoaders',
        {
          loader: 'sass-loader',
          options: {
            sassOptions: { includePaths: ['./src'] },
            additionalData: `@import "style/variables.scss";`,
          },
        },
      ],
      include: path.resolve(__dirname, '../'),
    })
    // config.module.rules.unshift({
    //   test: /\.svg$/,
    //   use: ['@svgr/webpack'],
    //   include: path.resolve(__dirname, '../'),
    // })
    const fileLoaderRule = config.module.rules.find(rule => rule.test && rule.test.test('.svg'))
    fileLoaderRule.exclude = /\.svg$/

    config.module.rules.push({
      test: /\.svg$/,
      enforce: 'pre',
      loader: require.resolve('@svgr/webpack'),
    })

    return config
  },
}
