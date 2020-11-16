const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

require('dotenv').config();

module.exports = {
  entry: './src/app/index.tsx',
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'main.js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.tsx', '.tsx', '.js', 'css', 'scss']
  },
  target: 'web',
  devServer: {
    clientLogLevel: 'warning',
    open: true,
    historyApiFallback: true,
    stats: 'errors-only',
    contentBase: path.resolve(__dirname, 'src', 'app'),
    watchContentBase: true,
    hot: true,
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: false,
          }
        },
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: false
            }
          },
        ],
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack', 'url-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: './src/container/index.html',
    }),
    new MiniCssExtractPlugin(),
    new ForkTsCheckerWebpackPlugin({
      eslint: {
        enabled: false,
        files: '*',
      }
    }),
    new webpack.DefinePlugin({
      'APP_MODE': JSON.stringify("development")
    })
  ]
};
