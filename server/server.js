import path from 'path'
import _ from 'lodash'
import Inert from 'inert'
// import Vision from 'vision'
import Request from 'request'
// import BasicAuth from 'hapi-auth-basic'
// import Bcrypt from 'bcrypt'

import * as Collections from './collections'
import * as Endpoints from './endpoints'
import * as pkg from '../../package.json'

let internals = {};
let settings = {};

internals.defaults = {
	prefix: '/',
  db: "mongodb://localhost:27017/betcha_dev"
}

function register(server, options, next) {
	settings = _.extend(internals.defaults, options);

	server.register(Inert, (err) => {
		if (err) return next (err);
    Collections.resolve(settings.db, (err, db) => {
      if (err) return next (err);
      server.bind({ settings, db });
      
      server.route({ method: 'GET',  path: `${settings.prefix}`, config: Endpoints.defaultPage });
      server.route({ method: 'GET',  path: '/{filename}',        config: Endpoints.fileName });
      server.route({ method: 'POST', path: '/user/register',     config: Endpoints.registerUser });
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
    })
	});

	next();
}

register.attributes = { pkg };

module.exports = register;