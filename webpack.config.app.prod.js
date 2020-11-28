const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const MONACO_DIR = path.resolve(__dirname, './node_modules/monaco-editor');

module.exports = {
  entry: './src/app/index.tsx',
  output: {
    path: path.resolve(__dirname, "dist")
  },
  resolve: {
    extensions: ['.tsx', '.tsx', '.js', 'css', 'scss']
  },
  target: 'electron-renderer',
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
      }, {
        test: /\.css$/,
        include: path.resolve(__dirname, 'src', 'app'),
        use: [{
          loader: 'style-loader',
        }, {
          loader: 'css-loader',
          options: {
            modules: true,
            namedExport: true,
          },
        }],
      }, {
        test: /\.css$/,
        include: MONACO_DIR,
        use: ['style-loader', 'css-loader'],
      },
      { test: /\.m?js/, type: "javascript/auto" },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack', 'url-loader']
      },
      {
        test: /\.(woff|woff2|ttf)$/,
        use: {
          loader: 'url-loader',
        },
      },
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
      'APP_MODE': JSON.stringify("production")
    }),
    new MonacoWebpackPlugin({
      // available options are documented at https://github.com/Microsoft/monaco-editor-webpack-plugin#options
      languages: ['json', 'javascript', 'java', 'php', 'shell', 'xml', 'typescript', 'yaml', 'css', 'scss', 'hcl', 'markdown', 'sql', 'html', 'plaintext'],
    })
  ]
};
