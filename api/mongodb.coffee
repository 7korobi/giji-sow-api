mongo = require "mongodb-bluebird"
sh = require 'child_process'
fs = require 'fs'
_ = require "lodash"

ObjectId = false

giji = {}

module.exports = (app, { url, db })->
  return unless db.mongo_sow
  mongo.connect db.mongo_sow
  .then (db)->
    end = (err, o)->
      console.log err, o
    giji.find = (id, query, projection)->
      db.collection id, {ObjectId}
      .find query, projection

    giji.aggregate_message = ->
      firsts = (out, keys, ext...)->
        db.collection(out, { ObjectId }).remove({})
        .then ->
          db.collection("message_by_story_for_face", {ObjectId}).aggregate [
            $sort:
              date_min: 1
          ,
            $group:
              _id: keys
              date:
                $min: "$date_min"
          ,
            $out: "#{out}_date_mins"
          ], {ObjectId}
        .then (data)->
          Promise.all data.map ({ _id, date })->
            { story_id, face_id, mestype } = _id
            console.log { c: 'messages', story_id, face_id, date }
            db.collection("messags", {ObjectId})
            .find({ story_id, face_id, date })
            .then (o)->
              o.q = _id
              o
        .then (data)->
          console.log { out, keys, ext, data_size: data.length }
          if data.length
            db.collection(out, { ObjectId }).insert data

      cmd = (out, keys, ext...)->
        db.collection("message_by_story_for_face", {ObjectId}).aggregate [
          ext...
        ,
          $group:
            _id: keys
            date_min:
              $min: "$date_min"
            date_max:
              $max: "$date_max"
            max:
              $max: "$max"
            all:
              $sum: "$all"
            count:
              $sum: "$count"
            story_ids:
              $addToSet: "$_id.story_id"
        ,
          $out: out
        ], {ObjectId}
      Promise.all [
        cmd "message_for_face",
          face_id: "$_id.face_id"
        cmd "message_for_face_sow_auth",
          face_id:     "$_id.face_id"
          sow_auth_id: "$_id.sow_auth_id"
        cmd "message_for_face_mestype",
          face_id: "$_id.face_id"
          mestype: "$_id.mestype"
        firsts "message_firsts_for_story_face_mestype",
          story_id: "$_id.story_id"
          face_id:  "$_id.face_id"
          mestype:  "$_id.mestype"
      ]


    giji.aggregate_potof = ->
      cmd = (out, story_ids, keys, ext...)->
        db.collection("potofs", {ObjectId}).aggregate [
          ext...
        ,
          $match:
            story_id:
              $exists: 1
              $nin: story_ids
            sow_auth_id:
              $exists: 1
              $nin: [null, "master", "admin", "a1", "a2", "a3", "a4", "a5", "a6", "a7", "a8", "a9"]
            face_id:
              $exists: 1
              $ne: null
        ,
          $group:
            _id: keys
            date_min:
              $min: "$timer.entrieddt"
            date_max:
              $max: "$timer.entrieddt"
            story_ids:
              $addToSet: "$story_id"

        ,
          $out: out
        ], {ObjectId}
        .then ->
          console.log { out, keys, ext, story_ids }

      giji.find "stories", { is_finish: false }, { _id: 1 }
      .then (data)->
        story_ids = data.map ({ _id })-> _id
        console.log story_ids, "is progress (deny)."
        Promise.all [
          cmd "potof_for_face", story_ids,
            face_id: "$face_id"
          cmd "potof_for_face_live", story_ids,
            face_id: "$face_id"
            live: "$live"
          cmd "potof_for_face_sow_auth", story_ids,
            face_id:     "$face_id"
            sow_auth_id: "$sow_auth_id"
          cmd "potof_for_face_role", story_ids,
            face_id: "$face_id"
            role_id: "$role"
          ,
            $unwind: "$role"
        ]

    giji.aggregate_max = ->
      db.collection("potof_for_face_sow_auth_max", { ObjectId }).remove({})
      .then ->
        db.collection("potof_for_face_sow_auth", { ObjectId }).aggregate [
          $project:
            _id: 1
            count:
              $size: "$story_ids"
        ,
          $group:
            _id:
              face_id: "$_id.face_id"
            count:
              $max: "$count"
        ], {ObjectId}
      .then (data)->
        Promise.all data.map (o)->
          giji.find "potof_for_face_sow_auth",
            "_id.face_id": o._id.face_id
            story_ids:
              $size: o.count
          .then (list)->
            [top] = _.sortBy list, (a)-> a.date_min
            o.date_min = top.date_min
            o.date_max = top.date_max
            o._id      = top._id
            o
      .then (data)->
        console.log "potof_for_face_sow_auth_max insert #{data.length} data."
        db.collection("potof_for_face_sow_auth_max", { ObjectId }).insert data

    giji.oldlog = ->
      db.collection("stories", { ObjectId }).aggregate [
        $match:
          is_finish:
            $eq: true
      ,
        $project:
          _id: 1
      ,
        $group:
          _id: null
          story_ids:
            $addToSet: "$_id"
      ], {ObjectId}
      .then ([o])->
        data = for id in o.story_ids
          dst = "./static/sow/#{id}.json.gz"
          src = "#{url.api}/story/oldlog/#{id}"
          """  ls "#{dst}" || curl "#{src}" | gzip --stdout --best > "#{dst}"  """

        dst = "./static/sow/index.json.gz"
        src = "#{url.api}/story/oldlog"
        data.push """ curl "#{src}" | gzip --stdout --best > "#{dst}"  """

        dst = "./static/aggregate/faces/index.json.gz"
        src = "#{url.api}/aggregate/faces"
        data.push """ curl "#{src}" | gzip --stdout --best > "#{dst}"  """

        data.push """ npm run gulp amazon_gz """

        fs.writeFile './static/sow.sh', data.join("\n") , (err)->
          if err
            console.error err
          else
            console.log "write."
            fs.chmod './static/sow.sh', 0o777, (err)->
              if err
                console.error err
              else
                console.log "chmod."
                sh.exec "./static/sow.sh", (err, stdout, stderr)->
                  if err
                    console.error err
                  else
                    console.log stderr
        false

    giji.scan = ->
      db.collection("message_by_story_for_face", { ObjectId }).aggregate [
        $group:
          _id: null
          story_ids:
            $addToSet: "$_id.story_id"
      ], {ObjectId}
      .then ([o])->
        list = o?.story_ids ? []
        db.collection("stories", { ObjectId }).aggregate [
          $match:
            _id:
              $nin: list
            is_finish:
              $eq: true
        ,
          $project:
            _id: 1
        ,
          $group:
            _id: null
            story_ids:
              $addToSet: "$_id"
        ], {ObjectId}
      .then ([o])->
        list = o?.story_ids ? []
        console.log "step B"
        console.log list
        set_bases = for id in list
          giji.set_base id
        Promise.all set_bases

    giji.set_base = (story_id)->
      console.log "step for #{story_id}"
      db.collection("messages", { ObjectId }).aggregate [
        $match:
          story_id: story_id
          sow_auth_id:
            $exists: 1
            $ne: null
          face_id:
            $exists: 1
            $ne: null
          logid:
            $exists: 1
            $ne: null
          log:
            $exists: 1
            $ne: null
      ,
        $project:
          sow_auth_id: 1
          story_id: 1
          face_id: 1
          logid: 1
          date: 1
          size:
            $strLenCP: "$log"
      ,
        $group:
          _id:
            sow_auth_id: "$sow_auth_id"
            story_id: "$story_id"
            face_id: "$face_id"
            mestype:
              $substr: ["$logid", 0, 2]
          date_min:
            $min: "$date"
          date_max:
            $max: "$date"
          max:
            $max: "$size"
          all:
            $sum: "$size"
          count:
            $sum: 1
      ], {ObjectId}
      .then (data)->
        if data.length
          db.collection("message_by_story_for_face").insert data
        else
          console.log "#{story_id} for message_by_story_for_face size 0."
  .catch ->
    console.log "!!! mongodb connect error !!!"


  app.get '/api/aggregate/job', (req, res, next)->
    giji.scan()
    .then ->
      giji.aggregate_message()
    .then ->
      giji.aggregate_potof()
    .then ->
      giji.aggregate_max()
    .then ->
      giji.oldlog()
    .then ->
      res.json
        started: true
      next()
    .catch (e)->
      res.json e
      next()

  app.get '/api/aggregate/faces', (req, res, next)->
    q = {}
    Promise.all [
      giji.find "message_for_face", q
      giji.find "potof_for_face", q
      giji.find "potof_for_face_sow_auth_max", q
    ]
    .then ([m_faces, faces, sow_auths])->
      res.json { m_faces, faces, sow_auths }
      next()
    .catch (e)->
      console.error req, e
      next()

  app.get '/api/aggregate/faces/:id', (req, res, next)->
    { id } = req.params
    q =
      "_id.face_id": id
    Promise.all [
      giji.find "message_for_face", q
      giji.find "message_for_face_mestype", q
      giji.find "message_for_face_sow_auth", q
      giji.find "potof_for_face", q
      giji.find "potof_for_face_role", q
      giji.find "potof_for_face_live", q
    ]
    .then ([m_faces, mestypes, sow_auths, faces, roles, lives])->
      res.json { m_faces, mestypes, sow_auths, faces, roles, lives }
      next()
    .catch (e)->
      console.error req, e
      next()


  app.get '/api/plan/progress', (req, res, next)->
    range = 1000 * 3600 * 24 * 50 # 50 days
    limit = new Date( new Date() - range )

    giji.find "sow_village_plans",
      write_at:
        $gte: limit
      state:
        $in: [
          null
          /議事/
        ]
    .then (data)->
      res.json { plans: data }
      next()
    .catch (e)->
      console.error req, e
      next()

  app.get '/api/story/progress', (req, res, next)->
    q =
      is_epilogue: false
      is_finish: false
    fields =
      comment:  0
      password: 0
    json = {}
    giji.find "stories", q, fields
    .then (data)->
      json.stories = data
      data.map (o)-> "#{o._id}-0"
    .then (ids)->
      giji.find "events",
        _id:
          $in: ids
    .then (data)->
      json.events = data
    .then ->
      res.json json
      next()
    .catch (e)->
      console.error req, e
      next()

  app.get '/api/story/oldlog', (req, res, next)->
    q =
      is_epilogue: true
      is_finish:   true
    fields =
      comment:  0
      password: 0
    Promise.all [
      giji.find "stories", q, fields
      giji.find "potof_for_face", {}
    ]
    .then ([stories, faces])->
      res.json { stories, faces }
      next()
    .catch (e)->
      console.error req, e
      next()

  app.get '/api/story/oldlog/:story_id', (req, res, next)->
    { story_id } = req.params
    fields =
      password: 0
    Promise.all [
      giji.find "stories",  { _id: story_id, is_epilogue: true, is_finish: true}, fields
      giji.find "messages", { story_id }
      giji.find "events",   { story_id }
      giji.find "potofs",   { story_id }
    ]
    .then ([stories, messages, events, potofs])->
      unless stories.length
        messages = events = potofs = []
      res.json { stories, messages, events, potofs }
      next()
    .catch (e)->
      console.error req, e
      next()

  return
