'use strict';

module.exports = {
	serviceName: "mydaemon",
	servicePort: 3050,
	type: 'daemon',
	prerequisites: {},
	serviceVersion: 1,
	errors: {},

	"schema": {
		"testJob": {
			"l": "My test Job"
		}
	}
};