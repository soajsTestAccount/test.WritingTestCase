'use strict';

var fs = require('fs');
var path = require('path');

var lib = {
	/**
	 * Function that find the root path where grunt plugins are installed.
	 *
	 * @method findRoot
	 * @return String rootPath
	 */
	findRoot: function () {
		var cwd = process.cwd();
		var rootPath = cwd;
		var newRootPath = null;
		while (!fs.existsSync(path.join(process.cwd(), "node_modules/grunt"))) {
			process.chdir("..");
			newRootPath = process.cwd();
			if (newRootPath === rootPath) {
				return;
			}
			rootPath = newRootPath;
		}
		process.chdir(cwd);
		return rootPath;
	},
	/**
	 * Function load the npm tasks from the root path
	 *
	 * @method loadTasks
	 * @param grunt {Object} The grunt instance
	 * @param tasks {Array} Array of tasks as string
	 */
	loadTasks: function (grunt, rootPath, tasks) {
		tasks.forEach(function (name) {
			if (name === 'grunt-cli') return;
			var cwd = process.cwd();
			process.chdir(rootPath); // load files from proper root, I don't want to install everything locally per module!
			grunt.loadNpmTasks(name);
			process.chdir(cwd);
		});
	}
};

module.exports = function (grunt) {
	//Loading the needed plugins to run the grunt tasks
	var pluginsRootPath = lib.findRoot();
	lib.loadTasks(grunt, pluginsRootPath, ['grunt-contrib-jshint', 'grunt-jsdoc', 'grunt-contrib-clean', 'grunt-mocha-test', 'grunt-env'
		, 'grunt-istanbul', 'grunt-coveralls']);
	grunt.initConfig({
		//Defining jshint tasks
		jshint: {
			options: {
				"bitwise": true,
				"eqeqeq": true,
				"forin": true,
				"newcap": true,
				"noarg": true,
				"undef": true,
				"unused": false,
				"eqnull": true,
				"laxcomma": true,
				"loopfunc": true,
				"sub": true,
				"supernew": true,
				"validthis": true,
				"node": true,
				"maxerr": 100,
				"indent": 2,
				"globals": {
					"describe": false,
					"it": false,
					"before": false,
					"beforeEach": false,
					"after": false,
					"afterEach": false
				},
				ignores: ['test/coverage/**/*.js']
			},
			files: {
				src: ['**/*.js']
			},
			gruntfile: {
				src: 'Gruntfile.js'
			}
		},
		// jsdoc: {
		//   doc : {
		//     src: ['soajs/**/*.js'],
		//     jsdoc: pluginsRootPath+'/node_modules/grunt-jsdoc/node_modules/jsdoc/jsdoc',
		//     options: {
		//       dest: 'doc',
		//     }
		//   }
		// },


		env: {
			// ****** set needed env variables
			mochaTest: {
				NODE_ENV: 'test',
				SOAJS_ENV: 'dev',
				SOAJS_DAEMON_GRP_CONF: "testCase",
				APP_DIR_FOR_CODE_COVERAGE: '../',
				SOAJS_SRVIP: '127.0.0.1'
			},
			coverage: {
				// for example stop emails
				NODE_ENV: 'test',
				SOAJS_ENV: 'dev',
				SOAJS_DAEMON_GRP_CONF: "testCase",
				APP_DIR_FOR_CODE_COVERAGE: '../test/coverage/instrument/',
				SOAJS_SRVIP: '127.0.0.1'
			}
		},

		clean: {
			doc: {
				src: ['doc/']
			},
			coverage: {
				src: ['test/coverage/']
			}
		},

		instrument: {
			// ****** include all the code files required
			files: ['index.js', 'config.js', 'lib/*.js', 'daemon/*.js'],
			
			options: {
				lazy: false,
				basePath: 'test/coverage/instrument/'
			}
		},

		storeCoverage: {
			options: {
				dir: 'test/coverage/reports'
			}
		},

		makeReport: {
			src: 'test/coverage/reports/**/*.json',
			options: {
				type: 'lcov',
				dir: 'test/coverage/reports',
				print: 'detail'
			}
		},

		mochaTest: {
			// Use unit tests when you test without using request or any other external repo
			// ie only internal functions
			unit: {
				options: {
					reporter: 'spec',
					timeout: 90000
				},
				// ****** all files
				src: ['test/unit/*.js']
			},
			// Use when testing apis
			integration: {
				options: {
					reporter: 'spec',
					timeout: 90000
				},
				// ****** starting point, one file that requires the rest of the files
				src: ['test/integration/_servers.test.js']
			}
		},

		coveralls: {
			options: {
				// LCOV coverage file relevant to every target
				src: 'test/coverage/reports/lcov.info',

				// When true, grunt-coveralls will only print a warning rather than
				// an error, to prevent CI builds from failing unnecessarily (e.g. if
				// coveralls.io is down). Optional, defaults to false.
				force: false
			},
			your_target: {
				// Target-specific LCOV coverage file
				src: 'test/coverage/reports/lcov.info'
			}
		}
	});

	process.env.SHOW_LOGS = grunt.option('showLogs');
	grunt.registerTask("default", ['jshint']);
	grunt.registerTask("integration", ['env:mochaTest', 'mochaTest:integration']);
	grunt.registerTask("unit", ['env:mochaTest', 'mochaTest:unit']);
	grunt.registerTask("test", ['clean', 'env:coverage', 'instrument', 'mochaTest:unit', 'mochaTest:integration']);
	//grunt.registerTask("coverage", ['clean', 'env:coverage', 'instrument', 'mochaTest:integration', 'storeCoverage', 'makeReport', 'coveralls']);
	grunt.registerTask("coverage", ['clean', 'env:coverage', 'instrument', 'mochaTest:integration', 'storeCoverage', 'makeReport']);

};

