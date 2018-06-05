nodeExternals = require 'webpack-node-externals'
path = require 'path'
current = process.cwd()

coffee =
  test: /\.coffee$/,
  loader: 'coffee-loader'

yml =
  test: /\.yml$/,
  loader: 'json-loader!yaml-loader'

module.exports =
  target: 'node'
  devtool: 'source-map'
  entry:
    app:  './api/index.coffee'
    spec: './spec/index.coffee'
  output:
    path: current
    filename: '[name].js'
  resolve:
    extensions: [
      '.coffee'
      '.js'
    ]
    alias:
      '~':  current
      '~~': current
      '@':  current
      '@@': current
 
  module:
    rules: [
      coffee
      yml
    ]

  plugins: []
  externals: [nodeExternals()]
