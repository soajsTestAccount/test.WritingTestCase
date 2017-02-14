'use strict';

module.exports = {
	serviceName: "myservice",
	requestTimeout: 30,
	requestTimeoutRenewal: 5,
	servicePort: 8010,
	extKeyRequired: true,
	"session": true,
	"security": true,
	"multitenant": true,
	"acl": true,
	type: 'service',
	serviceVersion: 1,
	awareness: false,
	prerequisites: {},

	"errors": {
		"100": "Firstname should be eliane",
		"400": "Failed to connect to Database"
	},

	"schema": {
		"/buildMyName": {
			"_apiInfo": {
				"l": "Build Name"
			},
			"firstName": {
				"source": ['query.firstName'],
				"required": true,
				"default": "John",
				"validation": {
					"type": "string"
				}
			},
			"lastName": {
				"source": ['query.lastName'],
				"required": true,
				"validation": {
					"type": "string"
				}
			}
		},
		"/buildName": {
			"_apiInfo": {
				"l": "Build Name"
			},
			"firstName": {
				"source": ['query.firstName'],
				"required": true,
				"default": "John",
				"validation": {
					"type": "string"
				}
			},
			"lastName": {
				"source": ['query.lastName'],
				"required": true,
				"validation": {
					"type": "string"
				}
			}
		}
	}
};
