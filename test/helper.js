"use strict";

var request = require("request");

var registry = require("./registry.js");
var Mongo = require("soajs").mongo;
var mongo;


module.exports = {
	getKey: function () {
		return "4232477ed993d167ec13ccf8836c29c400fef7eb3d175b1f2192b82ebef6fb2d129cdd25fe23c04f856157184e11f7f57b65759191908cb5c664df136c7ad16a56a5917fdeabfc97c92a1f199e457e31f2450a810769ff1b29269bcb3f01e3d2";
	},

	requireModule: function (path) {
		return require((process.env.APP_DIR_FOR_CODE_COVERAGE || '../') + path);
	},

	getMongo: function () {
		if (!mongo) {
			// define your db connections
			mongo = {};
			mongo.testCase = new Mongo(registry("testCase", ""));
			mongo.core = new Mongo(registry("core_provision", ""));
			mongo.urac = new Mongo(registry("TNT1_urac", ""));
		}
		return mongo;
	},

	requester: function (method, params, cb) {
		var requestOptions = {
			'uri': params.uri,
			'json': params.body || true
		};
		if (params.headers) requestOptions.headers = params.headers;
		if (params.authorization) requestOptions.headers.authorization = params.authorization;
		if (params.qs) requestOptions.qs = params.qs;
		if (params.form !== undefined) requestOptions.form = params.form;

		request[method](requestOptions, function (err, response, body) {
			return cb(err, body, response);
		});
	}
};