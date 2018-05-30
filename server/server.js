import path from 'path'
import _ from 'lodash'
import Inert from 'inert'
// import Vision from 'vision'
import Request from 'request'
// import BasicAuth from 'hapi-auth-basic'
// import Bcrypt from 'bcrypt'

import * as pkg from '../../package.json'
import * as Endpoints from './endpoints'

let internals = {};
let settings = {};

internals.defaults = {
	prefix: '/',
}

function register(server, options, next) {
	settings = _.extend(internals.defaults, options);

	server.register(Inert, (err) => {
		if (err) return next (err);

		server.route({
			method: 'GET',
			path: '/{filename}',
			handler: {
				file: function (request) {
					return request.params.filename;
				}
			}
		});
		// server.route({
		// 	method: 'GET',
		// 	path: '/{param*}',
		// 	handler: {
		// 		directory: {
		// 			path: 'app',
		// 			index: ['index.html'],
		// 			listing: true
		// 		}
		// 	}
		// });
		server.route({ method: 'GET', path: `${settings.prefix}`, config: Endpoints.defaultPage });
	});

	next();
}

register.attributes = { pkg };

module.exports = register;