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
/******/ 	return __webpack_require__(__webpack_require__.s = 21);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var bodyParser, logger;

bodyParser = __webpack_require__(3);

logger = __webpack_require__(4);

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
/* 1 */
/***/ (function(module, exports) {

throw new Error("Module build failed: Error: C:\\Dropbox\\www\\giji-sow-api\\api\\mongodb.coffee:158:39: error: octal literal '0777' must be prefixed with '0o'\n          fs.chmod './static/sow.sh', \u001b[1;31m0777\u001b[0m, (err)->\n\u001b[1;31m                                      ^^^^\u001b[0m\n    L157:           fs.chmod './static/sow.sh', 0777, (err)->\n                                               ^\n\n    at Object.module.exports (C:\\Dropbox\\www\\giji-sow-api\\node_modules\\coffee-loader\\index.js:38:9)");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("morgan");

/***/ }),
/* 5 */,
/* 6 */,
/* 7 */
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
/* 8 */
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
/* 9 */
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
/* 10 */
/***/ (function(module, exports) {

module.exports = require("ava");

/***/ }),
/* 11 */,
/* 12 */,
/* 13 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = require("js-yaml");

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = require("lodash");

/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = require("mongoose");

/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = require("supertest");

/***/ }),
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

var _, app, bless, conf, express, fs, http, mongoose, supertest, test, user, yaml;

test = __webpack_require__(10);

express = __webpack_require__(2);

mongoose = __webpack_require__(16);

supertest = __webpack_require__(17);

fs = __webpack_require__(13);

yaml = __webpack_require__(14);

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

_ = __webpack_require__(15);

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

__webpack_require__(0)(app, conf);

__webpack_require__(1)(app, conf);

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

__webpack_require__(9)(app, {test, bless, http});

__webpack_require__(7)(app, {test, bless, http});

__webpack_require__(8)(app, {test, bless, http});


/***/ })
/******/ ]);
//# sourceMappingURL=spec.js.map