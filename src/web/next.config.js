// eslint-disable-next-line @typescript-eslint/no-var-requires
const withReactSvg = require('next-react-svg')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

module.exports = withReactSvg({
  future: {
    webpack5: true,
  },
  experimental: {
    externalDir: true,
  },
  include: path.resolve(__dirname, 'assets/svg'),
  sassOptions: {
    includePaths: ['./src'],
    prependData: `@import "style/variables.scss";`,
  },
  webpack(config, options) {
    config.module.rules.push({
      test: /\.graphql$/,
      exclude: /node_modules/,
      use: [options.defaultLoaders.babel, { loader: 'graphql-let/loader' }],
    })

    config.module.rules.push({
      test: /\.graphqls$/,
      exclude: /node_modules/,
      use: ['graphql-let/schema/loader'],
    })

    return config
  },
})