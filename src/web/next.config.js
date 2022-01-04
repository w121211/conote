// eslint-disable-next-line @typescript-eslint/no-var-requires
const withReactSvg = require('next-react-svg')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

module.exports = withReactSvg({
  include: path.resolve(__dirname, 'assets/svg'),
  experimental: {
    externalDir: true,
  },
  // trailingSlash: true,
  // webpackDevMiddleware: config => {
  //   config.watchOptions = {
  //     poll: 1000,
  //     aggregateTimeout: 300,
  //   }
  //   return config
  // },
  sassOptions: {
    includePaths: ['./src'],
    // prependData: `@import "style/variables.scss";`,
  },
  webpack(config, options) {
    config.module.rules.push({
      test: /\.graphql$/,
      exclude: /node_modules/,
      use: [options.defaultLoaders.babel, { loader: 'graphql-let/loader' }],
    })
    // config.module.rules.push({
    //   test: /\.graphqls$/,
    //   exclude: /node_modules/,
    //   use: ['graphql-let/schema/loader'],
    // })
    return config
  },
})
