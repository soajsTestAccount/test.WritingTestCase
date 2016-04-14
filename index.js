'use strict';
var soajs = require('soajs');
var config = require('./config.js');
var utils = require('./lib/utils.js');

var service = new soajs.server.service(config);

service.init(function () {

	service.get("/buildName", function (req, res) {
		//write your business logic here
		var fullName = req.soajs.inputmaskData.firstName + '' + req.soajs.inputmaskData.lastName;
		utils.getInfo(req, function () {
			res.json(req.soajs.buildResponse(null, {
				fullName: fullName
			}));
		});
	});

	service.get("/buildMyName", function (req, res) {
		//write your business logic here
		if (req.soajs.inputmaskData.firstName !== 'Eliane') {
			return res.jsonp(req.soajs.buildResponse({"code": 100, "msg": config.errors[100]}));
		}
		var fullName = req.soajs.inputmaskData.firstName + ' ' + req.soajs.inputmaskData.lastName;
		res.json(req.soajs.buildResponse(null, {
			fullName: fullName
		}));
	});

	service.start();
});
