const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const NODE_ENV = process.env.NODE_ENV;

const setPath = function(folderName) {
  return path.join(__dirname, folderName);
}

const buildingForLocal = () => {
  return (NODE_ENV === 'development');
};

const extractCSS = new ExtractTextPlugin({
  filename: 'styles.[hash].css', //'[name].[contenthash].css',
  disable: buildingForLocal()
});

module.exports = {
  output: {
    filename: buildingForLocal() ? '[name].js' : '[name].[hash].js'
  },

  optimization: {
    runtimeChunk: false,
    splitChunks: {
      chunks: 'all', // Taken from https://gist.github.com/sokra/1522d586b8e5c0f5072d7565c2bee693
    }
  },
  resolveLoader: {
    modules: [setPath('node_modules')]
  },
  mode: buildingForLocal() ? 'development' : 'production',
  devServer: {
    historyApiFallback: true,
    noInfo: false
  },
  plugins: [
    extractCSS,
    new HtmlWebpackPlugin({
      filename: 'index.html',
      inject: 'inline',
      template: setPath('src/index.html'),
      environment: process.env.NODE_ENV,
      isLocalBuild: buildingForLocal(),
    }),
    new CopyWebpackPlugin([{ from: 'public' }]),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"'+NODE_ENV+'"'
      }
    })
  ],
  module: {
    rules: [
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader'
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: [{
          loader: 'babel-loader',
          options: { presets: ['es2015'] }
        }]
      },
      {
        test: /\.css$/,
        use: extractCSS.extract({
          fallback: 'style-loader',
          use: [{
            loader: 'css-loader',
          }]
        })
      },
      {
        test: /\.(png|jpg|gif|webm|ttf|eot|woff|otf|pdf|txt)$/,
        use: [
          {
            loader: 'file-loader',
            options: {}
          }
        ]
      }
    ]
  },
};
