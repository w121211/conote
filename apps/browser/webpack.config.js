/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * References
 * - https://github.com/pmmmwh/react-refresh-webpack-plugin/blob/main/examples/typescript-without-babel/webpack.config.js
 * - https://github.com/aeksco/react-typescript-web-extension-starter/blob/master/webpack.common.js
 * - https://github.com/aeksco/react-typescript-web-extension-starter/blob/master/webpack.dev.js
 */

const path = require('path')
// const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
// const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
// const TransformRuntimePlugin = require('@babel/plugin-transform-runtime')
const Dotenv = require('dotenv-webpack')
const JSONC = require('jsonc-parser')
require('dotenv').config({ path: './.env' })

const isDevelopment = process.env.NODE_ENV !== 'production'
const isManifestV3 = process.env.MANIFEST_V3 !== undefined

console.log(
  `Webpack build params: isManifestV3 ${isManifestV3} isDevelopment ${isDevelopment}`,
)

const manifestPath = isManifestV3
  ? path.resolve(__dirname, 'src/manifest.v3.jsonc')
  : path.resolve(__dirname, 'src/manifest.v2.jsonc')
const outDist = isDevelopment ? 'devdist' : 'dist'

module.exports = {
  mode: isDevelopment ? 'development' : 'production',
  // devtool: 'cheap-module-source-map',
  devtool: 'inline-source-map', // ts-loader, chrome-extension requires this
  context: __dirname,
  entry: {
    'background-script': path.resolve(__dirname, 'src/chrome/background.ts'),

    // 'content-script': path.resolve(__dirname, 'src/scripts/content-script.ts'),
    // popup: path.resolve(__dirname, 'src/popup/index.tsx'),
    // main: path.resolve(__dirname, 'src/index.tsx'),
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  output: {
    path: path.resolve(__dirname, outDist),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader', // Use babel-lodaer instead, ts-loader encounter type-checking error (while tsc run successfully, unknwon reason)
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.graphql$/,
        exclude: /node_modules/,
        use: [
          { loader: 'babel-loader' },
          {
            loader: 'graphql-let/loader',
            // options: { configFile: path.resolve(__dirname, '../web/.graphql-let.yml') },
          },
        ],
      },
      // {
      //   test: /\.graphqls$/,
      //   exclude: /node_modules/,
      //   use: ['graphql-let/schema/loader'],
      // },
      // {
      //   test: /\.tsx?$/,
      //   include: path.join(__dirname, 'src'),
      //   exclude: /node_modules/,
      //   use: [
      //     // isDevelopment && {
      //     //   loader: 'babel-loader',
      //     //   options: { plugins: ['react-refresh/babel'] },
      //     // },
      //     isDevelopment && {
      //       loader: 'babel-loader',
      //     },
      //     {
      //       loader: 'ts-loader',
      //       options: { transpileOnly: true },
      //     },
      //   ].filter(Boolean),
      // },
      {
        exclude: /node_modules/,
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader', // Creates style nodes from JS strings
          },
          {
            loader: 'css-loader', // Translates CSS into CommonJS
          },
        ],
      },
      {
        test: /\.svg$/,
        exclude: /node_modules/,
        use: {
          loader: 'svg-react-loader',
        },
      },
    ],
  },
  // devServer: {
  //   contentBase: path.join(__dirname, 'dist'),
  //   // compress: true,
  //   port: 3000,
  //   writeToDisk: true,
  // },
  plugins: [
    // Warning! No secerts should store in .env file. See https://github.com/mrsteele/dotenv-webpack
    new Dotenv({ path: './.env' }),

    // isDevelopment && new ReactRefreshPlugin(),

    new ForkTsCheckerWebpackPlugin({
      typescript: {
        diagnosticOptions: {
          semantic: true,
          syntactic: true,
        },
        mode: 'write-references',
      },
    }),

    new CopyWebpackPlugin({
      patterns: [
        // {
        //   from: path.resolve(__dirname, 'public', '*.json'),
        //   to: path.resolve(__dirname, outDist, '[name].json'),
        // },
        {
          from: path.resolve(__dirname, 'public', '*.png'),
          to: path.resolve(__dirname, outDist, '[name].png'),
        },
        {
          from: path.resolve(__dirname, 'public', '*.html'),
          to: path.resolve(__dirname, outDist, '[name].html'),
        },
        {
          from: manifestPath,
          to: path.resolve(__dirname, outDist, 'manifest.json'),
          transform(content, path) {
            const manifest = JSONC.parse(content.toString()) // Use jsonc parser, https://github.com/microsoft/node-jsonc-parser
            // var manifest = JSON.parse(content.toString()) // Copy-webpack-plugin passes a buffer
            // manifest.version = package.version // make any modifications you like, such as
            return JSON.stringify(manifest, null, 2) // Pretty print to JSON with two spaces
          },
        },
      ],
    }),

    // new HtmlWebpackPlugin({
    //   filename: './index.html',
    //   template: './public/index.html',
    //   chunks: ['main'],
    // }),
    // new HtmlWebpackPlugin({
    //   filename: './popup.html',
    //   template: './public/popup.html',
    //   chunks: ['popup'],
    // }),
  ].filter(Boolean),
}
