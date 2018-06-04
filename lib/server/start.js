'use strict';

var _boom = require('boom');

var _boom2 = _interopRequireDefault(_boom);

var _glue = require('glue');

var _glue2 = _interopRequireDefault(_glue);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var manifestPath = process.argv[2];

var startServer = function startServer() {
  _fs2.default.readFile(manifestPath, function (err, configsData) {
    if (err) return err;
    var configs = JSON.parse(configsData);
    _glue2.default.compose(configs, function (err, server) {
      if (err) return _boom2.default.badRequest('Error when creating betcha server ' + err);
      server.start(function (err) {
        if (err) return _boom2.default.badRequest('Error when creating betcha server ' + err);
        console.info('Betcha\xA9 server is up and running on ' + server.info.uri);
      });
    });
  });
};

startServer();