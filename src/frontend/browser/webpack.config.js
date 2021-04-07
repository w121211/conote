/**
 * References:
 * https://github.com/pmmmwh/react-refresh-webpack-plugin/blob/main/examples/typescript-without-babel/webpack.config.js
 * https://github.com/aeksco/react-typescript-web-extension-starter/blob/master/webpack.common.js
 * https://github.com/aeksco/react-typescript-web-extension-starter/blob/master/webpack.dev.js
 */
const path = require('path')
// const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
// const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const isDevelopment = process.env.NODE_ENV !== 'production'

module.exports = {
  mode: isDevelopment ? 'development' : 'production',
  // devtool: 'cheap-module-source-map',
  devtool: 'inline-source-map', // ts-loader, chrome-extension需要這個才不會報錯
  context: __dirname,
  entry: {
    'background-page': path.join(__dirname, './src/background-page.ts'),
    popup: path.join(__dirname, './src/popup/index.tsx'),
    main: path.join(__dirname, './src/index.tsx'),
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  output: {
    path: path.join(__dirname, './dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
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
      // {
      //   exclude: /node_modules/,
      //   test: /\.scss$/,
      //   use: [
      //     {
      //       loader: 'style-loader', // Creates style nodes from JS strings
      //     },
      //     {
      //       loader: 'css-loader', // Translates CSS into CommonJS
      //     },
      //     {
      //       loader: 'sass-loader', // Compiles Sass to CSS
      //     },
      //   ],
      // },
    ],
  },
  // devServer: {
  //   contentBase: path.join(__dirname, 'dist'),
  //   // compress: true,
  //   port: 3000,
  //   writeToDisk: true,
  // },
  plugins: [
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
        {
          from: path.join(__dirname, 'public', '*.json'),
          to: path.join(__dirname, 'dist', '[name].json'),
        },
        {
          from: path.join(__dirname, 'public', '*.png'),
          to: path.join(__dirname, 'dist', '[name].png'),
        },
        {
          from: path.join(__dirname, 'public', '*.html'),
          to: path.join(__dirname, 'dist', '[name].html'),
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
