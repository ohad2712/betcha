'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.users = undefined;
exports.resolve = resolve;

var _boom = require('boom');

var _boom2 = _interopRequireDefault(_boom);

var _mongodb = require('mongodb');

var _mongodb2 = _interopRequireDefault(_mongodb);

var _users = require('./users');

var users = _interopRequireWildcard(_users);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// export function reset(db, done) => {
//   db.collectionNames((err, collectionNames) => {
//     if (err) return done(err);
//     db.dropCollection(collectionNames[0].name, done);
//   })
// }

function resolve(db, done) {
  if (typeof db === 'string') {
    console.log("here");
    return _mongodb2.default.MongoClient.connect(db, done);
  } else {
    if (db instanceof _mongodb2.default.Db) {
      return done(null, db);
    } else {
      return done(_boom2.default.notAcceptable('Unknown db object'));
    }
  }
}

exports.users = users;