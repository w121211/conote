const withReactSvg = require('next-react-svg')
const path = require('path')

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  /* config options here */
  include: path.resolve(__dirname, 'assets/svg'),

  typescript: {
    tsconfigPath: 'tsconfig.build.json',
  },
  // experimental: {
  //   externalDir: true,
  // },
  // trailingSlash: true,
  // webpackDevMiddleware: config => {
  //   config.watchOptions = {
  //     poll: 1000,
  //     aggregateTimeout: 300,
  //   }
  //   return config
  // },
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
}

module.exports = withReactSvg(nextConfig)
