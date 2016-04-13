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
		controller = require("soajs.controller");

		// wait for controller to start & register before starting other services

		setTimeout(function () {
			urac = require("soajs.urac");
			mainService = helper.requireModule('./index');

			// wait for all services to start & register before starting tests

			setTimeout(function () {
				require("./myTest.js");
				done();
			}, 1000);
		}, 1000);
	});
});