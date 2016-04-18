"use strict";
var shell = require('shelljs');
var assert = require('assert');
var helper = require("../helper.js");

var sampleData = require("soajs.mongodb.data/modules/testing");

var mainService, urac, controller;

describe("importing sample data", function () {

	it("do import", function (done) {
		shell.pushd(sampleData.dir);
		shell.exec("chmod +x " + sampleData.shell, function (code) {
			assert.equal(code, 0);
			shell.exec(sampleData.shell, function (code) {
				assert.equal(code, 0);
				shell.popd();
				done();
			});
		});
	});

	after(function (done) {

		// start controller
		controller = require("soajs.controller");

		// ******* wait for controller to start & register before starting other services
		// Services must be started within 5 seconds,

		// In case for some reason, the controller does not see other services,
		// add the first test to be a reload registry for the controller

		setTimeout(function () {
			// start the urac or other services, if needed
			urac = require("soajs.urac");

			// start current service
			mainService = helper.requireModule('./index');

			// wait for all services to start & register before starting tests

			setTimeout(function () {
				require("./service.test.js");
				require("./daemon.test.js");
				done();
			}, 1000);
		}, 1000);
	});
});