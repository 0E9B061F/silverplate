'use strict';

const path = require('path');
const env = require('./scripts/env.js');

module.exports = {
  entry: './scripts/entry.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: env.clientscript
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      },
      {
        test: /\.styl$/,
        use: [
          'style-loader',
          'css-loader',
          'stylus-loader'
        ],
      },
      {
        test: /\.css$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" }
        ]
      },
      {
        test: /\.(eot|woff|ttf|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/'
            }
          }
        ]
      }
    ]
  }
}
