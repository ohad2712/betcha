import Boom from 'boom'
import Mongo from 'mongodb'

import * as users from './users'

// export function reset(db, done) => {
//   db.collectionNames((err, collectionNames) => {
//     if (err) return done(err);
//     db.dropCollection(collectionNames[0].name, done);
//   })
// }

export function resolve(db, done) {
  if (typeof db === 'string') {
    console.log("here");
    return Mongo.MongoClient.connect(db, done);
  }
  else {
    if (db instanceof Mongo.Db) {
      return done(null, db);
    }
    else {
      return done(Boom.notAcceptable('Unknown db object'));
    }
  }
}

export {users as users};

