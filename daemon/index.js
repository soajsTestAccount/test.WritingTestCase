"use strict";
var soajsCore = require("soajs");
var config = require("./config");
var mongo;

var collectionName = 'myTest';

var daemonDriver = new soajsCore.server.daemon({"config": config});

daemonDriver.init(function () {

	daemonDriver.job('testJob', function (soajs, next) {
		if (!mongo) {
			mongo = new soajsCore.mongo(soajs.registry.coreDB.testCase);
		}
		var servicesConfig = soajs.servicesConfig;
		//console.log(servicesConfig);
		soajs.log.info('Hi Daemon');

		mongo.find(collectionName, {}, function (err, results) {
			console.log(results);
			if (2 < results.length) {
				soajs.log.warn('Do Something, Length greater than 2');
			}
			next();
		});

	});

	daemonDriver.start();
});