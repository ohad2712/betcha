import * as collections from './collections'
import * as Validations from './validations'
import Qs from 'qs';

export const defaultPage = {
  description: "GET / for the default page",
  handler: {
    file: "index.html"
  }
}

export const fileName = {
  description: "GET /{fileName} for all app files",
  handler: {
    file: (request) => {
      return request.params.filename;
    }
  }
}

export const registerUser = {
  description: "POST /user/register to add a new user to the db",
  validate: {
    payload: Validations.putUserSchema
  },
  handler: function (request, reply) {  // Not a fat-arrow function since server is bound to the db and settings, so the context should remain the
    console.log(Qs.parse(request.payload));
    let user = request.payload;
    // console.log(collections);
    // console.log(this);
    collections.users.insert(this.db, user, (err, user) => {
      if (err) return reply(err);
      else return reply(`The user ${user} is successfully added to betcha`);
    });
  }
}