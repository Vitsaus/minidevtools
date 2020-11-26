const path = require('path');
const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');


module.exports = {
  entry: './src/container/index.ts',
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'container.js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  target: 'electron-main',
  mode: 'production',
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
      { test: /\.m?js/, type: "javascript/auto" },
    ]
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      eslint: {
        enabled: false,
        files: '',
      },
    }),
    new webpack.DefinePlugin({
      'APP_MODE': JSON.stringify("production")
    })
  ],
};
