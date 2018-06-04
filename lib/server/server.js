'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _inert = require('inert');

var _inert2 = _interopRequireDefault(_inert);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _collections = require('./collections');

var Collections = _interopRequireWildcard(_collections);

var _endpoints = require('./endpoints');

var Endpoints = _interopRequireWildcard(_endpoints);

var _package = require('../../package.json');

var pkg = _interopRequireWildcard(_package);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import Vision from 'vision'
var internals = {};
// import BasicAuth from 'hapi-auth-basic'
// import Bcrypt from 'bcrypt'

var settings = {};

internals.defaults = {
  prefix: '/',
  db: "mongodb://localhost:27017/betcha_dev"
};

function register(server, options, next) {
  settings = _lodash2.default.extend(internals.defaults, options);

  server.register(_inert2.default, function (err) {
    if (err) return next(err);
    Collections.resolve(settings.db, function (err, db) {
      if (err) return next(err);
      server.bind({ settings: settings, db: db });

      server.route({ method: 'GET', path: '' + settings.prefix, config: Endpoints.defaultPage });
      server.route({ method: 'GET', path: '/{filename}', config: Endpoints.fileName });
      server.route({ method: 'POST', path: '/user/register', config: Endpoints.registerUser });
      // server.route({
      //  method: 'GET',
      //  path: '/{param*}',
      //  handler: {
      //    directory: {
      //      path: 'app',
      //      index: ['index.html'],
      //      listing: true
      //    }
      //  }
      // });
    });
  });

  next();
}

register.attributes = { pkg: pkg };

module.exports = register;