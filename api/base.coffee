bodyParser = require 'body-parser'
logger = require 'morgan'

module.exports = (app, conf)->
  app.use logger 'dev'
  app.use bodyParser.json()
  app.use (req, res, next)->
    res.header "Access-Control-Allow-Origin", "*"
    res.header "Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"
    next()
