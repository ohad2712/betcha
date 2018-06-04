'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerUser = exports.fileName = exports.defaultPage = undefined;

var _collections = require('./collections');

var collections = _interopRequireWildcard(_collections);

var _validations = require('./validations');

var Validations = _interopRequireWildcard(_validations);

var _qs = require('qs');

var _qs2 = _interopRequireDefault(_qs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var defaultPage = exports.defaultPage = {
  description: "GET / for the default page",
  handler: {
    file: "index.html"
  }
};

var fileName = exports.fileName = {
  description: "GET /{fileName} for all app files",
  handler: {
    file: function file(request) {
      return request.params.filename;
    }
  }
};

var registerUser = exports.registerUser = {
  description: "POST /user/register to add a new user to the db",
  // validate: {
  //   payload: Validations.putUserSchema
  // },
  handler: function handler(request, reply) {
    // Not a fat-arrow function since server is bound to the db and settings, so the context should remain the
    console.log(_qs2.default.parse(request.payload));
    var user = request.payload;
    // console.log(collections);
    // console.log(this);
    collections.users.insert(this.db, user, function (err, user) {
      if (err) return reply(err);else return reply('The user ' + user + ' is successfully added to betcha');
    });
  }
};