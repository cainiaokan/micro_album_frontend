const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WebpackChunkHash = require('webpack-chunk-hash')
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin')

const routeComponentRegex = /routes\/([^\/]+\/?[^\/]+).jsx$/

const babelLoader = {
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
}

module.exports = {
  // 设置上下文路径
  context: path.resolve(__dirname, '..'),
  // 第三方模块清单
  entry: {
    'vendor': [
      'react',
      'react-dom',
      'react-router',
      'react-redux',
      'redux',
      'redux-thunk',
      'redux-logger',
      'es6-promise',
      'isomorphic-fetch',
      'iscroll',
    ],
    // 相册入口模块
    'app': './src/app/app.jsx',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include:  path.resolve(__dirname, '../src'),
        exclude: routeComponentRegex,
        use: [
          babelLoader
        ]
      },
      {
        test: /\.css$/,
        include: path.resolve(__dirname, '../src'),
        exclude: path.resolve(__dirname, '../src/res'),
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.less$/,
        include: path.resolve(__dirname, '../src'),
        exclude: path.resolve(__dirname, '../src/res'),
        use: ['style-loader', 'css-loader', 'less-loader']
      },
      {
        test: routeComponentRegex,
        include:  path.resolve(__dirname, '../src'),
        use: [
          {
            loader: 'bundle-loader',
            options: {
              lazy: true
            }
          },
          babelLoader
        ]
      }
    ],
  },
  plugins: [
    // 第三方模块及编译产出的清单模块
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest'],
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
