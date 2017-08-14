const postcssCssNext = require('postcss-cssnext')
const postcssUrl = require('postcss-url')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')

// Disables or enables certain functionality based on node environment variable
const isDevelopment = process.env.NODE_ENV !== 'production'
let isDevServer = process.argv[1].indexOf('webpack-dev-server') !== -1

// Helps with deciding whether to extract css or not
isDevServer = !(!isDevelopment || isDevServer)

// Setup for plugins
const clean = new CleanWebpackPlugin(['js', 'css'])
const html = new HtmlWebpackPlugin({template: './index.html'})
const extract = new ExtractTextPlugin({
  filename: './css/[name].[hash].css',
  disable: isDevServer
})
const sync = new BrowserSyncPlugin({
  host: 'localhost',
  port: 3000,
  proxy: 'http://localhost:3100/'
}, {
  reload: true
})

module.exports = {
  context: `${__dirname}/src`,
  devtool: isDevelopment ? 'eval-source-map' : 'source-map',
  devServer: {port: 3100},
  entry: [
    './styles/styles.scss',
    './scripts/scripts.js'
  ],
  output: {
    path: `${__dirname}`,
    filename: './js/[name].[hash].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.s?[a?c]ss$/,
        use: extract.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {sourceMap: true}
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
                plugins: () => [
                  postcssUrl(),
                  postcssCssNext({browsers: ['last 2 versions']})
                ]
              }
            },
            {
              loader: 'sass-loader', options: {sourceMap: true}
            }
          ]
        })
      }
    ]
  },
  plugins: [
    clean,
    extract,
    html,
    sync
  ],
  stats: isDevelopment ? 'minimal' : 'normal'
}
