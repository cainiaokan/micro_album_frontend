const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const webpackMerge = require('webpack-merge')

const baseConfig = require('./base')

module.exports = webpackMerge(baseConfig, {
  devtool: 'source-map',
  output: {
    path: path.join(__dirname, '../dist/sv'),
    filename: 'static/js/[name]-[chunkhash:8].js',
    chunkFilename: 'static/js/[name]-[chunkhash:8].js',
    sourceMapFilename: 'static/js/[file].map',
    publicPath: 'http://m.weiqunxiangce.com/sv/'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        include: path.resolve(__dirname, '../src/res'),
        use: ExtractTextPlugin.extract(['css-loader?sourceMap', 'csso-loader?-comments'])
      },
      {
        test: /\.less$/,
        include: path.resolve(__dirname, '../src/res'),
        use: ExtractTextPlugin.extract(['css-loader?sourceMap', 'csso-loader?-comments', 'less-loader'])
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
              limit: 100000,
              name: 'static/img/[name]-[hash:8].[ext]'
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
            name: 'static/img/[name]-[hash:8].[ext]'
          }
        }
      }
    ]
  },
  plugins: [
    // 配置生产环境变量
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        BROWSER: JSON.stringify(true)
      }
    }),

    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      beautify: false,
      mangle: {
        screw_ie8: true,
        keep_fnames: true
      },
      compress: {
        screw_ie8: true
      },
      comments: false
    }),

    new webpack.HashedModuleIdsPlugin(),

    // 配置公共css chunk，使得bundle.css成为独立的文件，不会被编译到bundle中去
    new ExtractTextPlugin('static/style/bundle-[contenthash:8].css')
  ]
})
