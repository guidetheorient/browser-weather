/*
 * @Author: guidetheorient 
 * @Date: 2018-04-10 17:35:14 
 * @Last Modified by: guidetheorient
 * @Last Modified time: 2018-04-11 09:12:02
 */

const path = require('path');

const htmlWebpackPlugin = require('html-webpack-plugin');

const extractTextPlugin = require('extract-text-webpack-plugin');

const devServer = require('webpack-dev-server');

const webpack = require('webpack');

let cssExtract = new extractTextPlugin({
  filename: 'css/[name]_[contenthash:8].css',
})
let scssExtract = new extractTextPlugin({
  filename: 'css/[name]_[contenthash:8].css',
})

let WEBPACK_ENV = process.env.WEBPACK_ENV || 'dev';

module.exports = {
  entry:{
    index: ['./src/js/index.js'],
    iconfont: ['./src/js/lib/iconfont.js']
  },
  output:{
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].js'
  },
  module:{
    rules:[
      {
        test: /\.css$/,
        use: cssExtract.extract({
          fallback: 'style-loader',
          use: ['css-loader']
        })
      },
      {
        test: /\.scss$/,
        use: scssExtract.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader']
        })
      },
      {
        test: /\.js$/,
        exclude: '/node_modules/',
        use: ['babel-loader']
      }
    ]
  },
  plugins: [
    new htmlWebpackPlugin({
      template: './src/index.html',
      chunks: ['index','iconfont'],
      hash: true,
      favicon: './favicon.ico'
    }),

    cssExtract,
    scssExtract
  ],
  devServer:{

  }
}