Agenda = require "agenda"
Agendash = require 'agendash'

ctxs = [
  require "./jobs/aggregate.coffee"
  require "./jobs/process.coffee"
]

module.exports = (app, conf)->
  { pm_id, db } = conf
  pno = (pm_id - 1 || 0)
  jobs = ctxs.map (ctx)->
    ctx(conf)
  agenda = new Agenda
    db:
      address: db.mongo
      collection: "jobCollectionName"
      options:
        server:
          auto_reconnect: true

  for { define, name } in jobs
    agenda.define name, define

  agenda.on 'ready', ->
    unless pno
      for { every, name } in jobs
        if every
          agenda.every every, name
    agenda.start()

  app.use '/agendash', Agendash agenda
  console.log "agenda use #{db.mongo}"
