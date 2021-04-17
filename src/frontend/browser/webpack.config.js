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
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 6e31220... add extension
    'background-script': path.resolve(__dirname, 'src/scripts/background-script.ts'),
    'content-script': path.resolve(__dirname, 'src/scripts/content-script.ts'),
    popup: path.resolve(__dirname, 'src/popup/index.tsx'),
    // main: path.resolve(__dirname, 'src/index.tsx'),
<<<<<<< HEAD
=======
    'background-page': path.join(__dirname, './src/background-page.ts'),
    popup: path.join(__dirname, './src/popup/index.tsx'),
    main: path.join(__dirname, './src/index.tsx'),
>>>>>>> 514adbb... .
=======
>>>>>>> 6e31220... add extension
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  output: {
<<<<<<< HEAD
<<<<<<< HEAD
    path: path.resolve(__dirname, 'dist'),
=======
    path: path.join(__dirname, './dist'),
>>>>>>> 514adbb... .
=======
    path: path.resolve(__dirname, 'dist'),
>>>>>>> 6e31220... add extension
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 6e31220... add extension
        // 改用babel-lodaer，ts-loader的type-checking會報錯，但單純跑`tsc`卻沒問題，尚未找到解決辦法
        loader: 'babel-loader',
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
<<<<<<< HEAD
=======
        loader: 'babel-loader',
      },
>>>>>>> 514adbb... .
=======
>>>>>>> 6e31220... add extension
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
<<<<<<< HEAD
<<<<<<< HEAD
          from: path.resolve(__dirname, 'public', '*.json'),
          to: path.resolve(__dirname, 'dist', '[name].json'),
        },
        {
          from: path.resolve(__dirname, 'public', '*.png'),
          to: path.resolve(__dirname, 'dist', '[name].png'),
        },
        {
          from: path.resolve(__dirname, 'public', '*.html'),
          to: path.resolve(__dirname, 'dist', '[name].html'),
        },
      ],
    }),

=======
          from: path.join(__dirname, 'public', '*.json'),
          to: path.join(__dirname, 'dist', '[name].json'),
=======
          from: path.resolve(__dirname, 'public', '*.json'),
          to: path.resolve(__dirname, 'dist', '[name].json'),
>>>>>>> 6e31220... add extension
        },
        {
          from: path.resolve(__dirname, 'public', '*.png'),
          to: path.resolve(__dirname, 'dist', '[name].png'),
        },
        {
          from: path.resolve(__dirname, 'public', '*.html'),
          to: path.resolve(__dirname, 'dist', '[name].html'),
        },
      ],
    }),
<<<<<<< HEAD
>>>>>>> 514adbb... .
=======

>>>>>>> 6e31220... add extension
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
