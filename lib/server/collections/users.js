"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.insert = insert;
function insert(db, user, done) {
  console.log(db);
  db.db('betcha_dev').collection("users").insert(user, done);
}