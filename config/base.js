var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var WebpackChunkHash = require('webpack-chunk-hash')
var InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin')

module.exports = {
  // 设置上下文路径
  context: path.resolve(__dirname, '..'),
  // 第三方模块清单
  entry: {
    'static/js/vendor': [
      'react',
      'react-dom',
      'react-redux',
      'redux',
      'es6-promise',
      'isomorphic-fetch',
      'iscroll',
    ],
    // 相册入口模块
    'static/js/app': './src/app/app.jsx',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ['react', ['es2015', {modules: false}]],
            plugins: [
              'syntax-dynamic-import',
              'transform-async-to-generator',
              'transform-regenerator',
              'transform-runtime',
              'transform-object-rest-spread',
            ]
          }
        }]
      }
    ]
  },
  plugins: [
    // 第三方模块及编译产出的清单模块
    new webpack.optimize.CommonsChunkPlugin({
      names: ['static/js/vendor', 'manifest'],
      minChunks: Infinity
    }),

    new WebpackChunkHash(),

    new InlineManifestWebpackPlugin({ name: 'webpackManifest' }),

    new HtmlWebpackPlugin({
      title: '微群相册',
      filename: 'index.html',
      template: './src/index.html'
    })
  ],
  resolve: {
    alias: {
      'es6-promise': 'es6-promise/dist/es6-promise.js',
      'isomorphic-fetch': 'isomorphic-fetch/fetch-npm-browserify.js',
      'iscroll': 'iscroll/build/iscroll.js'
    },
    extensions: ['.js', '.jsx'],
  }
}