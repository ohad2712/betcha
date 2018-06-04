export function insert(db, user, done) {
  console.log(db);
  db.db('betcha_dev').collection("users").insert(user, done);
}