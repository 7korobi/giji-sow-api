path   = require 'path'

coffee = /\.coffee$/
yml    = /\.yml$/
current = process.cwd()

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
      test: coffee
      loader: 'coffee-loader'
    ,
      test: yml
      loader: 'json-loader!yaml-loader'
    ]

  plugins: []

  externals: (ctx, req, cb)->
    return cb() if /\//.test req
    return cb() if yml.test req
    cb null, 'commonjs2 ' + req
