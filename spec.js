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
/******/ 	return __webpack_require__(__webpack_require__.s = 22);
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
            src = `http:${url.api}/story/oldlog/${id}`;
            results.push(`  ls "${dst}" || curl "${src}" | gzip --stdout --best > "${dst}"  `);
          }
          return results;
        })();
        dst = "./static/sow/index.json.gz";
        src = `http:${url.api}/story/oldlog`;
        data.push(` curl "${src}" | gzip --stdout --best > "${dst}"  `);
        dst = "./static/aggregate/faces/index.json.gz";
        src = `http:${url.api}/aggregate/faces`;
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
/* 9 */,
/* 10 */
/***/ (function(module, exports) {

var check;

check = function() {
  return {
    book: {
      label: "testcase",
      chat: {
        interval: "1d",
        night: "0",
        player: 4,
        mob: 0
      },
      game: {
        vote: "sign",
        vote_by: ["live"]
      },
      tag_ids: ["god", "travel"],
      option: ["vote_by_live"]
    },
    potof: {
      _id: "test-1-NPC",
      face_id: "sf10",
      job: "保安技師",
      sign: '公開サイン'
    },
    chats: [
      {
        idx: "welcome"
      },
      {
        idx: "vrule",
        log: "1. 多重ログインをしない。\n2. システムの出力内容を、そのまま書き写さない。\n3. エピローグまで秘密を守る。参加中の村の内容は秘密だ。\n4. エピローグまで秘密を守る。希望した能力、画面を見ているきみが何者なのかは秘密だ。"
      }
    ],
    part: {
      _id: "test-1-1",
      idx: "1",
      label: "一日目"
    }
  };
};

module.exports = function(app, {test, http, bless}) {
  test.serial('post api/books', async function(t) {
    var book, potof, text;
    await http.post("/test/session");
    ({book, potof} = check());
    ({text} = (await http.post("/api/books").type('json').send({book, potof})));
    bless(t);
    return t.deepContain(JSON.parse(text), {
      book: check().book,
      potof: {
        idx: "NPC",
        face_id: "sf10",
        job: "保安技師",
        sign: "公開サイン"
      },
      part: {
        idx: "0",
        label: "プロローグ"
      },
      phases: [
        {
          idx: "BM",
          handle: "MAKER",
          update: true
        },
        {
          idx: "MM",
          handle: "SSAY",
          update: true
        },
        {
          idx: "TM",
          handle: "private",
          update: false
        },
        {
          idx: "SM",
          handle: "public",
          update: false
        },
        {
          idx: "TS",
          handle: "TSAY",
          update: false
        },
        {
          idx: "Aim",
          handle: "AIM",
          update: false
        },
        {
          idx: "SS",
          handle: "SSAY",
          update: false
        },
        {
          idx: "VS",
          handle: "VSAY",
          update: false
        }
      ],
      chats: [
        {
          idx: "welcome"
        },
        {
          idx: "nrule"
        },
        {
          idx: "vrule"
        },
        {
          idx: "0"
        }
      ]
    });
  });
  test('post api/books/:book_id', async function(t) {
    var book, potof, text;
    ({book, potof} = check());
    ({text} = (await http.post("/api/books/test-1").type('json').send({book, potof})));
    bless(t);
    return t.deepContain(JSON.parse(text), {
      book: check().book,
      potof: check().potof,
      phases: [
        {
          _id: "test-1-0-BM",
          idx: "BM"
        },
        {
          _id: "test-1-0-MM",
          idx: "MM"
        }
      ],
      chats: [
        {
          _id: "test-1-0-BM-welcome",
          idx: "welcome"
        },
        {
          _id: "test-1-0-BM-nrule",
          idx: "nrule"
        },
        {
          _id: "test-1-0-BM-vrule",
          idx: "vrule"
        }
      ]
    });
  });
  test('post api/books/:book_id/part', async function(t) {
    var part, text;
    ({part} = check());
    ({text} = (await http.post("/api/books/test-1/part").type('json').send({part})));
    bless(t);
    return t.deepContain(JSON.parse(text), {
      part: check().part,
      phases: [
        {
          idx: "TM",
          handle: "private",
          update: false
        },
        {
          idx: "SM",
          handle: "public",
          update: false
        },
        {
          idx: "TS",
          handle: "TSAY",
          update: false
        },
        {
          idx: "Aim",
          handle: "AIM",
          update: false
        },
        {
          idx: "SS",
          handle: "SSAY",
          update: false
        },
        {
          idx: "VS",
          handle: "VSAY",
          update: false
        }
      ],
      chats: [
        {
          idx: "0"
        }
      ]
    });
  });
  test('get api/books', async function(t) {
    var book, i, len, ref, results, text;
    ({text} = (await http.get("/api/books")));
    bless(t);
    ref = JSON.parse(text).books;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      book = ref[i];
      results.push(t.deepContain(book, check().book));
    }
    return results;
  });
  test('get api/books/:book_id', async function(t) {
    var text;
    ({text} = (await http.get("/api/books/test-1")));
    bless(t);
    return t.deepContain(JSON.parse(text), {
      book: check().book,
      potofs: [],
      stats: [],
      cards: [],
      parts: [],
      phases: []
    });
  });
  return test('get api/books/:book_id/chats', async function(t) {
    var text;
    ({text} = (await http.get("/api/books/test-1/chats")));
    bless(t);
    return t.deepContain(JSON.parse(text), {
      chats: []
    });
  });
};


/***/ }),
/* 11 */
/***/ (function(module, exports) {

var check;

check = function() {
  return {
    potof: {
      face_id: "sf10",
      job: "保安技師",
      sign: '公開サイン'
    },
    part: {
      _id: "test-1-1",
      idx: "1",
      label: "一日目"
    }
  };
};

module.exports = function(app, {test, http, bless}) {
  return test('post api/books/test-1/potof.', async function(t) {
    var potof, text;
    await http.post("/test/session");
    ({potof} = check());
    ({text} = (await http.post("/api/books/test-1/potof").type('json').send({
      potof,
      phase_id: 'test-1-1-SSAY'
    })));
    bless(t);
    return t.deepContain(JSON.parse(text), {
      stat: {
        idx: 'SSAY',
        give: 0,
        sw: false
      },
      card: {
        idx: 'request',
        role_id: null
      },
      chat: {}
    }, potof);
  });
};


/***/ }),
/* 12 */
/***/ (function(module, exports) {

var user;

user = {
  sign: "公開サイン"
};

module.exports = function(app, {test, http, bless}) {
  test.serial('post api/user fail.', async function(t) {
    var text;
    await http.post("/logout");
    ({text} = (await http.post("/api/user").send({
      user: {
        sign: "公開サイン"
      }
    })));
    bless(t);
    return t.deepContain(JSON.parse(text), {
      message: "ログインしていません。"
    });
  });
  test.serial('post api/user', async function(t) {
    var text;
    await http.post("/test/session");
    ({text} = (await http.post("/api/user").send({user})));
    bless(t);
    return t.deepContain(JSON.parse(text), {user});
  });
  test('get /auth/google/callback.', async function(t) {
    var location, redirect;
    ({
      redirect,
      header: {location}
    } = (await http.get("/auth/google/callback")));
    bless(t);
    t.is(redirect, true);
    return t.match(location, /https:\/\/accounts.google.com\/o\/oauth2\/v2\/auth\?response_type=code&redirect_uri=http%3A%2F%2F127.0.0.1%3A\d\d\d\d\d%2Fauth%2Fgoogle%2Fundefined%2Fauth%2Fgoogle%2Fcallback&client_id=TEST-CLIENT-ID/);
  });
  return test('get /auth/facebook/callback.', async function(t) {
    var location, redirect;
    ({
      redirect,
      header: {location}
    } = (await http.get("/auth/facebook/callback")));
    bless(t);
    t.is(redirect, true);
    return t.match(location, /https:\/\/www.facebook.com\/dialog\/oauth\?response_type=code&redirect_uri=http%3A%2F%2F127.0.0.1%3A\d\d\d\d\d%2Fauth%2Ffacebook%2Fundefined%2Fauth%2Ffacebook%2Fcallback&client_id=TEST-CLIENT-ID/);
  });
};


/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = require("ava");

/***/ }),
/* 14 */,
/* 15 */,
/* 16 */
/***/ (function(module, exports) {

module.exports = require("js-yaml");

/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = require("mongoose");

/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = require("supertest");

/***/ }),
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

var _, app, bless, conf, express, fs, http, mongoose, supertest, test, user, yaml;

test = __webpack_require__(13);

express = __webpack_require__(5);

mongoose = __webpack_require__(17);

supertest = __webpack_require__(18);

fs = __webpack_require__(1);

yaml = __webpack_require__(16);

conf = yaml.load(fs.readFileSync("./config/spec.yml", 'UTF-8'));

user = {
  _id: "local-test-user",
  provider: "local-test",
  icon: "https://s3-ap-northeast-1.amazonaws.com/giji-assets/images/portrate/w52.jpg",
  mail: "7korobi.sys@gmail.com",
  nick: "テスト中",
  sign: "SIGN.SPEC",
  write_at: new Date - 0,
  token: "DEADBEEF",
  account: "user"
};

_ = __webpack_require__(2);

bless = function(t) {
  t.match = function(tgt, chk) {
    var result;
    result = [tgt];
    result.index = 0;
    result.input = tgt;
    return this.deepEqual(result, tgt.match(chk));
  };
  return t.deepContain = function(tgt, chk) {
    chk = _.mergeWith(chk, tgt, function(c, o) {
      switch (c != null ? c.constructor : void 0) {
        case null:
        case void 0:
          return o;
        case Array:
        case Object:
          return void 0;
        default:
          return c;
      }
    });
    return this.deepEqual(tgt, chk);
  };
};

app = express();

__webpack_require__(3)(app, conf);

__webpack_require__(4)(app, conf);

app.post('/test/session', function(req, res, next) {
  var base, base1;
  if ((base = req.session).passport == null) {
    base.passport = {};
  }
  if ((base1 = req.session.passport).user == null) {
    base1.user = user;
  }
  return res.json(req.session.passport);
});

http = supertest.agent(app);

__webpack_require__(12)(app, {test, bless, http});

__webpack_require__(10)(app, {test, bless, http});

__webpack_require__(11)(app, {test, bless, http});


/***/ })
/******/ ]);
//# sourceMappingURL=spec.js.map