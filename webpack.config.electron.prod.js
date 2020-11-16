const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/container/index.js',
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'container.js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js'],
  },
  target: 'electron-main',
  node: {
    __dirname: false,
  },  
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'APP_MODE': JSON.stringify("production")
    })
  ]
};
