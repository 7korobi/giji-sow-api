/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 19);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("child_process");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("lodash");

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var bodyParser, logger;

bodyParser = __webpack_require__(6);

logger = __webpack_require__(8);

module.exports = function(app, conf) {
  app.use(logger('dev'));
  app.use(bodyParser.json());
  return app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    return next();
  });
};


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var ObjectId, _, fs, giji, mongo, sh;

mongo = __webpack_require__(7);

sh = __webpack_require__(0);

fs = __webpack_require__(1);

_ = __webpack_require__(2);

ObjectId = false;

giji = {};

module.exports = function(app, {url, db}) {
  if (!db.mongo_sow) {
    return;
  }
  mongo.connect(db.mongo_sow).then(function(db) {
    var end;
    end = function(err, o) {
      return console.log(err, o);
    };
    giji.find = function(id, query, projection) {
      return db.collection(id, {ObjectId}).find(query, projection);
    };
    giji.aggregate_message = function() {
      var cmd;
      cmd = function(out, keys, ...ext) {
        return db.collection("message_by_story_for_face", {ObjectId}).aggregate([
          ...ext,
          {
            $group: {
              _id: keys,
              date_min: {
                $min: "$date_min"
              },
              date_max: {
                $max: "$date_max"
              },
              max: {
                $max: "$max"
              },
              all: {
                $sum: "$all"
              },
              count: {
                $sum: "$count"
              },
              story_ids: {
                $addToSet: "$_id.story_id"
              }
            }
          },
          {
            $out: out
          }
        ], {ObjectId});
      };
      return Promise.all([
        cmd("message_for_face",
        {
          face_id: "$_id.face_id"
        }),
        cmd("message_for_face_sow_auth",
        {
          face_id: "$_id.face_id",
          sow_auth_id: "$_id.sow_auth_id"
        }),
        cmd("message_for_face_mestype",
        {
          face_id: "$_id.face_id",
          mestype: "$_id.mestype"
        })
      ]);
    };
    giji.aggregate_potof = function() {
      var cmd;
      cmd = function(out, keys, ...ext) {
        return db.collection("potofs", {ObjectId}).aggregate([
          ...ext,
          {
            $match: {
              sow_auth_id: {
                $exists: 1,
                $nin: [null,
          "master",
          "admin"]
              },
              face_id: {
                $exists: 1,
                $ne: null
              }
            }
          },
          {
            $group: {
              _id: keys,
              date_min: {
                $min: "$timer.entrieddt"
              },
              date_max: {
                $max: "$timer.entrieddt"
              },
              story_ids: {
                $addToSet: "$story_id"
              }
            }
          },
          {
            $out: out
          }
        ], {ObjectId});
      };
      return Promise.all([
        cmd("potof_for_face",
        {
          face_id: "$face_id"
        }),
        cmd("potof_for_face_live",
        {
          face_id: "$face_id",
          live: "$live"
        }),
        cmd("potof_for_face_sow_auth",
        {
          face_id: "$face_id",
          sow_auth_id: "$sow_auth_id"
        }),
        cmd("potof_for_face_role",
        {
          face_id: "$face_id",
          role_id: "$role"
        },
        {
          $unwind: "$role"
        })
      ]);
    };
    giji.aggregate_max = function() {
      return db.collection("potof_for_face_sow_auth_max", {ObjectId}).remove({}).then(function() {
        return db.collection("potof_for_face_sow_auth", {ObjectId}).aggregate([
          {
            $project: {
              _id: 1,
              count: {
                $size: "$story_ids"
              }
            }
          },
          {
            $group: {
              _id: {
                face_id: "$_id.face_id"
              },
              count: {
                $max: "$count"
              }
            }
          }
        ], {ObjectId});
      }).then(function(data) {
        return Promise.all(data.map(function(o) {
          return giji.find("potof_for_face_sow_auth", {
            "_id.face_id": o._id.face_id,
            story_ids: {
              $size: o.count
            }
          }).then(function(list) {
            var top;
            [top] = _.sortBy(list, function(a) {
              return a.date_min;
            });
            o.date_min = top.date_min;
            o.date_max = top.date_max;
            o._id = top._id;
            return o;
          });
        }));
      }).then(function(data) {
        return db.collection("potof_for_face_sow_auth_max", {ObjectId}).insert(data);
      });
    };
    giji.oldlog = function() {
      return db.collection("stories", {ObjectId}).aggregate([
        {
          $match: {
            is_finish: {
              $eq: true
            }
          }
        },
        {
          $project: {
            _id: 1
          }
        },
        {
          $group: {
            _id: null,
            story_ids: {
              $addToSet: "$_id"
            }
          }
        }
      ], {ObjectId}).then(function([o]) {
        var data, dst, id, src;
        data = (function() {
          var i, len, ref, results;
          ref = o.story_ids;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            id = ref[i];
            dst = `./static/sow/${id}.json.gz`;
            src = `${url.api}/story/oldlog/${id}`;
            results.push(`  ls "${dst}" || curl "${src}" | gzip --stdout --best > "${dst}"  `);
          }
          return results;
        })();
        dst = "./static/sow/index.json.gz";
        src = `${url.api}/story/oldlog`;
        data.push(` curl "${src}" | gzip --stdout --best > "${dst}"  `);
        dst = "./static/aggregate/faces/index.json.gz";
        src = `${url.api}/aggregate/faces`;
        data.push(` curl "${src}" | gzip --stdout --best > "${dst}"  `);
        data.push(" npm run gulp amazon:gz ");
        fs.writeFile('./static/sow.sh', data.join("\n"), function(err) {
          return console.log(err);
        });
        return false;
      });
    };
    giji.scan = function() {
      return db.collection("message_by_story_for_face", {ObjectId}).aggregate([
        {
          $group: {
            _id: null,
            story_ids: {
              $addToSet: "$_id.story_id"
            }
          }
        }
      ], {ObjectId}).then(function([o]) {
        var list, ref;
        list = (ref = o != null ? o.story_ids : void 0) != null ? ref : [];
        return db.collection("stories", {ObjectId}).aggregate([
          {
            $match: {
              _id: {
                $nin: list
              },
              is_finish: {
                $eq: true
              }
            }
          },
          {
            $project: {
              _id: 1
            }
          },
          {
            $group: {
              _id: null,
              story_ids: {
                $addToSet: "$_id"
              }
            }
          }
        ], {ObjectId});
      }).then(function([o]) {
        var id, list, ref, set_bases;
        list = (ref = o != null ? o.story_ids : void 0) != null ? ref : [];
        console.log("step B");
        console.log(list);
        set_bases = (function() {
          var i, len, results;
          results = [];
          for (i = 0, len = list.length; i < len; i++) {
            id = list[i];
            results.push(giji.set_base(id));
          }
          return results;
        })();
        return Promise.all(set_bases);
      });
    };
    return giji.set_base = function(story_id) {
      return db.collection("messages", {ObjectId}).aggregate([
        {
          $match: {
            story_id: story_id,
            sow_auth_id: {
              $exists: 1,
              $ne: null
            },
            face_id: {
              $exists: 1,
              $ne: null
            },
            logid: {
              $exists: 1,
              $ne: null
            },
            log: {
              $exists: 1,
              $ne: null
            }
          }
        },
        {
          $project: {
            sow_auth_id: 1,
            story_id: 1,
            face_id: 1,
            logid: 1,
            date: 1,
            size: {
              $strLenCP: "$log"
            }
          }
        },
        {
          $group: {
            _id: {
              sow_auth_id: "$sow_auth_id",
              story_id: "$story_id",
              face_id: "$face_id",
              mestype: {
                $substr: ["$logid",
        0,
        2]
              }
            },
            date_min: {
              $min: "$date"
            },
            date_max: {
              $max: "$date"
            },
            max: {
              $max: "$size"
            },
            all: {
              $sum: "$size"
            },
            count: {
              $sum: 1
            }
          }
        }
      ], {ObjectId}).then(function(data) {
        return db.collection("message_by_story_for_face").insert(data);
      });
    };
  }).catch(function() {
    return console.log("!!! mongodb connect error !!!");
  });
  app.get('/api/aggregate/job', function(req, res, next) {
    return giji.scan().then(function() {
      return giji.aggregate_message();
    }).then(function() {
      return giji.aggregate_potof();
    }).then(function() {
      return giji.aggregate_max();
    }).then(function() {
      return giji.oldlog();
    }).then(function() {
      res.json({
        started: true
      });
      return next();
    }).catch(function(e) {
      res.json(e);
      return next();
    });
  });
  app.get('/api/aggregate/faces', function(req, res, next) {
    var q;
    q = {};
    return Promise.all([giji.find("message_for_face", q), giji.find("potof_for_face", q), giji.find("potof_for_face_sow_auth_max", q)]).then(function([m_faces, faces, sow_auths]) {
      res.json({m_faces, faces, sow_auths});
      return next();
    }).catch(function(e) {
      console.error(req, e);
      return next();
    });
  });
  app.get('/api/aggregate/faces/:id', function(req, res, next) {
    var id, q;
    ({id} = req.params);
    q = {
      "_id.face_id": id
    };
    return Promise.all([giji.find("message_for_face", q), giji.find("message_for_face_mestype", q), giji.find("message_for_face_sow_auth", q), giji.find("potof_for_face", q), giji.find("potof_for_face_role", q), giji.find("potof_for_face_live", q)]).then(function([m_faces, mestypes, sow_auths, faces, roles, lives]) {
      res.json({m_faces, mestypes, sow_auths, faces, roles, lives});
      return next();
    }).catch(function(e) {
      console.error(req, e);
      return next();
    });
  });
  app.get('/api/story/progress', function(req, res, next) {
    var fields, json, q;
    q = {
      is_epilogue: false,
      is_finish: false
    };
    fields = {
      comment: 0,
      password: 0
    };
    json = {};
    return giji.find("stories", q, fields).then(function(data) {
      json.stories = data;
      return data.map(function(o) {
        return `${o._id}-0`;
      });
    }).then(function(ids) {
      return giji.find("events", {
        _id: {
          $in: ids
        }
      });
    }).then(function(data) {
      return json.events = data;
    }).then(function() {
      res.json(json);
      return next();
    }).catch(function(e) {
      console.error(req, e);
      return next();
    });
  });
  app.get('/api/story/oldlog', function(req, res, next) {
    var fields, q;
    q = {
      is_epilogue: true,
      is_finish: true
    };
    fields = {
      comment: 0,
      password: 0
    };
    return Promise.all([giji.find("stories", q, fields), giji.find("potof_for_face", {})]).then(function([stories, faces]) {
      res.json({stories, faces});
      return next();
    }).catch(function(e) {
      console.error(req, e);
      return next();
    });
  });
  app.get('/api/story/oldlog/:story_id', function(req, res, next) {
    var fields, story_id;
    ({story_id} = req.params);
    fields = {
      password: 0
    };
    return Promise.all([
      giji.find("stories",
      {
        _id: story_id,
        is_epilogue: true,
        is_finish: true
      },
      fields),
      giji.find("messages",
      {story_id}),
      giji.find("events",
      {story_id}),
      giji.find("potofs",
      {story_id})
    ]).then(function([stories, messages, events, potofs]) {
      if (!stories.length) {
        messages = events = potofs = [];
      }
      res.json({stories, messages, events, potofs});
      return next();
    }).catch(function(e) {
      console.error(req, e);
      return next();
    });
  });
};


/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("mongodb-bluebird");

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("morgan");

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

var Agenda, Agendash, ctxs;

Agenda = __webpack_require__(23);

Agendash = __webpack_require__(24);

ctxs = [__webpack_require__(20), __webpack_require__(21)];

module.exports = function(app, conf) {
  var agenda, db, define, i, jobs, len, name, pm_id, pno;
  ({pm_id, db} = conf);
  pno = pm_id - 1 || 0;
  jobs = ctxs.map(function(ctx) {
    return ctx(conf);
  });
  agenda = new Agenda({
    db: {
      address: db.mongo,
      collection: "jobCollectionName",
      options: {
        server: {
          auto_reconnect: true
        }
      }
    }
  });
  for (i = 0, len = jobs.length; i < len; i++) {
    ({define, name} = jobs[i]);
    agenda.define(name, define);
  }
  agenda.on('ready', function() {
    var every, j, len1;
    if (!pno) {
      for (j = 0, len1 = jobs.length; j < len1; j++) {
        ({every, name} = jobs[j]);
        if (every) {
          agenda.every(every, name);
        }
      }
    }
    return agenda.start();
  });
  app.use('/api/agendash', Agendash(agenda));
  return console.log(`agenda use ${db.mongo}`);
};


/***/ }),
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */
/***/ (function(module, exports) {

module.exports = require("config");

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = require("debug");

/***/ }),
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

var app, conf, debug, express, host, pm_id, port;

express = __webpack_require__(5);

app = express();

conf = __webpack_require__(14);

debug = __webpack_require__(15)('giji-sow-api:server');

({pm_id} = process.env);

Object.assign(conf, {pm_id});

process.on('unhandledRejection', console.dir);

__webpack_require__(3)(app, conf);

if (conf.use_api) {
  __webpack_require__(9)(app, conf);
  // for only legacy jinrogiji
  __webpack_require__(4)(app, conf);
}

host = conf.host || '127.0.0.1';

port = (conf.port || 4000) + (pm_id - 0 || 0);

app.set('port', port);

app.listen(port, host);

console.log(`Server is listening on http://${host}:${port}`);

// var indexRouter = require('./routes/index')
// var usersRouter = require('./routes/users')
// app.use('/', indexRouter)
// app.use('/users', usersRouter)


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

var sh;

sh = __webpack_require__(0);

module.exports = function({url}) {
  return {
    name: 'aggregate',
    every: '12 hours',
    define: function(job, done) {
      return sh.exec(`curl ${url.api}/aggregate/job`, function(err, stdout, stderr) {
        return sh.exec("./static/sow.sh", function(err, stdout, stderr) {
          if (err) {
            return console.error(err);
          } else {
            return console.log(stderr);
          }
        });
      });
    }
  };
};


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

var sh;

sh = __webpack_require__(0);

module.exports = function({url}) {
  return {
    name: 'process',
    every: '2 minutes',
    define: function(job, done) {
      return sh.exec('ps uafxS | grep -v ^root', function(err, stdout, stderr) {
        if (err) {
          console.error(err);
          return console.error(stderr);
        } else {
          return console.log(stdout);
        }
      });
    }
  };
};


/***/ }),
/* 22 */,
/* 23 */
/***/ (function(module, exports) {

module.exports = require("agenda");

/***/ }),
/* 24 */
/***/ (function(module, exports) {

module.exports = require("agendash");

/***/ })
/******/ ]);
//# sourceMappingURL=app.js.map