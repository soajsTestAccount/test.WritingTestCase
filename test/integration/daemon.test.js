"use strict";
var async = require("async");
var assert = require("assert");
var helper = require("../helper.js");
var mongo = helper.getMongo();

var collectionName = 'myTest';

describe("About to Start Tests ...", function () {
	var interval = 3000;

	before(function (done) {
		mongo.testCase.remove(collectionName, {}, function (error) {
			assert.ifError(error);
		});
		done();
	});

	it("importing daemon data", function (done) {
		mongo.core.update("daemon_grpconf", {"daemon": "myDaemon"}, {
			"$set": {"interval": interval}
		}, function (error) {
			assert.ifError(error);
			done();
		});
	});
	
	it("execute daemon ...", function (done) {
		helper.requireModule("./daemon/index");
		var doc = {};
		/*
		 updating 1
		 */
		setTimeout(function () {
			doc = {
				"name": "demo"
			};
			mongo.testCase.insert(collectionName, doc, function (error) {
				assert.ifError(error);
			});
		}, interval * 1);

		/*
		 updating 2
		 */
		setTimeout(function () {
			doc = {
				"name": "demo2",
				"lastname": "demo2"
			};
			mongo.testCase.insert(collectionName, doc, function (error) {
				assert.ifError(error);
			});
		}, interval * 2);

		/*
		 updating 3
		 */
		setTimeout(function () {
			doc = {
				"name": "demo3",
				"lastname": "demo3"
			};
			mongo.testCase.insert(collectionName, doc, function (error) {
				assert.ifError(error);
			});
		}, interval * 3);


		/*
		 ending it all
		 */
		setTimeout(function () {
			done();
		}, interval * 5);
	});
});