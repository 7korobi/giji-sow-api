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
/******/ 	return __webpack_require__(__webpack_require__.s = 18);
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
/* 5 */
/***/ (function(module, exports) {

module.exports = require("child_process");

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var Agenda, Agendash, ctxs;

Agenda = __webpack_require__(22);

Agendash = __webpack_require__(23);

ctxs = [__webpack_require__(19), __webpack_require__(20)];

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
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */
/***/ (function(module, exports) {

module.exports = require("config");

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("debug");

/***/ }),
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

var app, conf, debug, express, host, pm_id, port;

express = __webpack_require__(2);

app = express();

conf = __webpack_require__(11);

debug = __webpack_require__(12)('giji-sow-api:server');

({pm_id} = process.env);

Object.assign(conf, {pm_id});

process.on('unhandledRejection', console.dir);

__webpack_require__(0)(app, conf);

if (conf.use_api) {
  __webpack_require__(6)(app, conf);
  // for only legacy jinrogiji
  __webpack_require__(1)(app, conf);
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
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

var sh;

sh = __webpack_require__(5);

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
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

var sh;

sh = __webpack_require__(5);

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
/* 21 */,
/* 22 */
/***/ (function(module, exports) {

module.exports = require("agenda");

/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = require("agendash");

/***/ })
/******/ ]);
//# sourceMappingURL=app.js.map