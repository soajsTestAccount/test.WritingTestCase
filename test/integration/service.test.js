"use strict";
var assert = require("assert");
var async = require("async");
var request = require("request");
var helper = require("../helper");
var mongo = helper.getMongo();

// Any file that is not in the test folder should be required using the helper,
// because you do not want to worry about location path with reference to the test folder
var config = helper.requireModule('./config');

// ***** load the error messages for easier matching
var errorCodes = config.errors;

var extKey = helper.getKey();
extKey = '4232477ed993d167ec13ccf8836c29c400fef7eb3d175b1f2192b82ebef6fb2d129cdd25fe23c04f856157184e11f7f57b65759191908cb5c664df136c7ad16a56a5917fdeabfc97c92a1f199e457e31f2450a810769ff1b29269bcb3f01e3d2';

// reusable function for executing requests
function executeMyRequest(params, apiPath, method, cb) {

	requester(apiPath, method, params, function (error, body) {
		assert.ifError(error);
		assert.ok(body);
		return cb(body);
	});

	function requester(apiName, method, params, cb) {
		var options = {
			uri: 'http://localhost:4000/myService/' + apiName,
			headers: {
				'Content-Type': 'application/json',
				key: extKey
			},
			json: true
		};

		if (params.headers) {
			for (var h in params.headers) {
				if (params.headers.hasOwnProperty(h)) {
					options.headers[h] = params.headers[h];
				}
			}
		}

		if (params.form) {
			options.body = params.form;
		}

		if (params.qs) {
			options.qs = params.qs;
		}

		request[method](options, function (error, response, body) {
			assert.ifError(error);
			assert.ok(body);
			return cb(null, body);
		});
	}
}

describe("Testing Service APIs", function () {
	var soajsauth;

	before(function (done) {
		console.log("------------------------ Do Something Before All tests ------------------------");
		done();
	});

	beforeEach(function (done) {
		console.log("============================================================================== ");
		done();
	});

	it("Login", function (done) {
		var loginParams = {
			uri: 'http://127.0.0.1:4000/urac/login',
			body: {
				"username": "user1",
				"password": "123456"
			},
			headers: {
				'key': extKey
			}
		};
		helper.requester('post', loginParams, function (err, body, req) {
			assert.ifError(err);
			assert.ok(body);
			assert.equal(body.result, true);
			assert.ok(body.soajsauth);
			// ****** add this to the headers, for example if you need all you subsequent tests to be in private mode
			soajsauth = body.soajsauth;

			done();
		});

	});

	// group tests for a single api in a describe
	describe("testing buildName api", function () {

		it('success', function (done) {
			var params = {
				qs: {
					firstName: "Eliane",
					lastName: "Nassif"
				}
			};
			executeMyRequest(params, 'buildName', 'get', function (body) {
				console.log(body);
				assert.ok(body.data);
				assert.ok(body.data.fullName);
				// ******  verify expected output
				assert.equal(body.data.fullName, 'Eliane Nassif');
				done();
			});
		});

	});

	describe("testing buildMyName api", function () {

		it('success', function (done) {
			var params = {
				qs: {
					firstName: "Eliane",
					lastName: "Nassif"
				}
			};
			executeMyRequest(params, 'buildMyName', 'get', function (body) {
				assert.ok(body.data);
				assert.ok(body.data.fullName);
				done();
			});
		});

		it('fail', function (done) {
			var params = {
				qs: {
					firstName: "John",
					lastName: "Doe"
				}
			};
			executeMyRequest(params, 'buildMyName', 'get', function (body) {
				// ****** verify correct error code
				assert.deepEqual(body.errors.details[0], {"code": 100, "message": errorCodes[100]});
				done();
			});
		});

	});

	describe("Last Test", function () {

		it("Login", function (done) {
			// ****** manipulate data to get desired results
			mongo.urac.remove("users", {'username': "user1"}, function (err) {
				var loginParams = {
					uri: 'http://127.0.0.1:4000/urac/login',
					body: {
						"username": "user1",
						"password": "123456"
					},
					headers: {
						'key': extKey
					}
				};
				helper.requester('post', loginParams, function (err, body, req) {
					assert.ifError(err);
					assert.ok(body);
					console.log(body.errors);
					assert.equal(body.result, false);
					assert.deepEqual(body.errors.details[0], {"code": 401, "message": 'Unable to log in the user. User not found.'});
					done();
				});

			});

		});

	});

});