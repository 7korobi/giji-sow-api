express = require 'express'
app = express()
conf = require 'config'
debug = require('debug')('giji-sow-api:server')

{ pm_id } = process.env
Object.assign conf, { pm_id }
process.on 'unhandledRejection', console.dir


require("./base.coffee")(app, conf)
if conf.use_api
  require("./agenda.coffee"  )(app, conf)

  # for only legacy jinrogiji
  require("./mongodb.coffee" )(app, conf)

host = ( conf.host || '127.0.0.1' )
port = ( conf.port || 4000 ) + (pm_id - 0 || 0)

app.set 'port', port
app.listen port, host
console.log("Server is listening on http://#{host}:#{port}")

# var indexRouter = require('./routes/index')
# var usersRouter = require('./routes/users')
# app.use('/', indexRouter)
# app.use('/users', usersRouter)
