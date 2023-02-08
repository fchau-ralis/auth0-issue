/**
 * @description this module contains the custom dynamic resolver functionality for customers
 */
/*global process: true*/
'use strict';

// resources that a customer would need to check access to
const userResources = require('../resourceArrays/userResolver.names');

/**
 * @description sets the resovler to verify that an appropriate access token exists for the custoemr
 * @param {Object} app the loopback application
 */
let setResolver = (app) => {
	let Role = app.models.Role;
	Role.registerResolver('user', (role, context, callback) => {
		if (!userResources.includes(context.modelName)) return processNext(null, false, callback);
		let req = context.remotingContext.req;
		let token = req.headers.authorization || req.query.access_token;
		if (!token) return processNext(null, false, callback);
		let userToken = context.model;
		userToken.findById(token, {}, (err, accessToken) => {
			if (err) return processNext(err, null, callback);
			if (!accessToken) return processNext(null, false, callback);
			accessToken.validate((err, isValid) => {
				if (err) return processNext(err, null, callback);
				processNext(null, isValid, callback);
			});
		});
	});
};

/**
 * @description helper for wrapping next functionality
 * @param {Object} err error object
 * @param {Boolean} isValid whether or not the token is valid
 * @param {Function} callback callback function
 */
let processNext = (err, isValid, callback) => {
	process.nextTick(() => callback(err, isValid));
};

module.exports = {
	setResolver
};