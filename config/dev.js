const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const webpackMerge = require('webpack-merge')

const baseConfig = require('./base')

module.exports = webpackMerge(baseConfig, {
  watch: true,
  output: {
    path: path.join(__dirname, '../dist/sv'),
    filename: 'static/js/[name].js',
    chunkFilename: 'static/js/[name].js',
    sourceMapFilename: 'static/js/[name].map',
    publicPath: 'http://weixin.imliren.com/sv/'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        include: path.resolve(__dirname, '../src/res'),
        use: ExtractTextPlugin.extract(['css-loader'])
      },
      {
        test: /\.less$/,
        include: path.resolve(__dirname, '../src/res'),
        use: ExtractTextPlugin.extract(['css-loader', 'less-loader'])
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        include: path.resolve(__dirname, '../src'),
        use: [
          {
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug: true,
              progressive: true,
              optimizationLevel: 3,
              pngquant: {
                quality: '65-80'
              }
            }
          },
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: 'static/img/[name].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|svg)$/i,
        include: path.resolve(__dirname, '../src'),
        use: {
          loader: 'url-loader',
          options: {
            limit: 100000,
            name: 'static/img/[name].[ext]'
          }
        }
      }
    ]
  },
  plugins: [
    // 配置生产环境变量
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('dev'),
        BROWSER: JSON.stringify(true)
      }
    }),

    // 配置公共css chunk，使得bundle.css成为独立的文件，不会被编译到bundle中去
    new ExtractTextPlugin('static/style/bundle.css')
  ]
})
