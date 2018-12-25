const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// const WebappWebpackPlugin = require('webapp-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

const IS_PROD = process.env.NODE_ENV === 'production';

// CONFIG
const config = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/',
    filename: 'build.js',
  },
  module: {
    rules: [
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader'
      },
      {
        enforce: 'post',
        test: /\.css$/,
        loader: IS_PROD ? ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader',
        }) : 'style-loader!css-loader?sourceMap',
      }, {
        enforce: 'pre',
        test: /\.(js)$/,
        loader: 'eslint-loader',
        options: {
          emitWarning: true,
          failOnError: false,
          failOnWarning: false,
        },
        exclude: /node_modules/,
      }, {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      }, {
        test: /\.(png|jpg|gif|ttf|woff|eot)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]',
        },
      }, {
        test: /\.(html)$/,
        use: {
          loader: 'html-loader',
          options: {
            interpolate: true,
          },
        },
      },
    ],
  },
  resolve: {
    modules: ['node_modules', 'src'],
    extensions: ['*', '.js', '.json'],
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    overlay: true,
  },
  performance: {
    hints: false,
  },
  devtool: '#eval-source-map',
  plugins: [
    // new WebappWebpackPlugin({
    //   logo: path.resolve(__dirname, './src/assets/Versus.svg'),
    //   favicons: {
    //     background: '#333',
    //     theme_color: '#f9690e',
    //   }
    // }),
    new CopyWebpackPlugin([{ from: 'public' }]),
    new FaviconsWebpackPlugin('./src/assets/Versus.svg'),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.ejs',
    }),
  ],
};

if (IS_PROD) {
  config.plugins.push(
    new ExtractTextPlugin('bundle.css'),
  );
}

module.exports = config;
