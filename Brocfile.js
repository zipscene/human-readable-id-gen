// Copyright 2016 Zipscene, LLC
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var fs = require('fs');
var _ = require('lodash');
var esTranspiler = require('broccoli-babel-transpiler');
var mergeTrees = require('broccoli-merge-trees');
var Funnel = require('broccoli-funnel');
var wrapFiles = require('broccoli-wrap');
var Promise = require('es6-promise').Promise;

// Returns a broc tree corresponding to the original source files
function getSourceTrees(pathsToSearch) {
	return {
		read: function(readTree) {
			var promises = _.map(pathsToSearch, function(path) {
				return new Promise(function(resolve) {
					fs.exists(path, function(exists) {
						resolve((exists) ? path : null);
					});
				});
			});

			return Promise.all(promises)
				.then(function(paths) {
					paths = _.filter(paths);
					if (paths.length === 0) throw new Error('No source paths found');
					return paths;
				})
				.then(function(paths) {
					console.log('Found source paths: ' + paths.join(', '));

					var pathTrees = _.map(paths, function(path) {
						return new Funnel(path, { srcDir: '.', destDir: path });
					});

					return readTree(mergeTrees(pathTrees));
				});
		},

		cleanup: function() {}
	};
}

/**
 * Adds an optional dependency to install source tree stack trace support
 * if the relevant package ('source-map-support') is installed.
 * The string in require() is split up to prevent browserify from catching and including it.
 * It's important that this is all on one line because it's prepended to the
 * source before being transpiled, and would mess up line numbers otherwise.
 */
var addSourceMapSupport = function(tree) {
	var sourceMapString = '' +
		'!(function() {try{' +
		'require("s"+"ource-map-support").install();' +
		'}catch(e){}})();';
	return wrapFiles(tree, {
		wrapper: [ sourceMapString, '' ],
		extensions: [ 'js' ]
	});
};

var addBinShebang = function(tree) {
	var shebangTree = wrapFiles(tree, {
		wrapper: [ '#!/usr/bin/env node\n', '' ],
		extension: [ 'js' ]
	});

	shebangTree.processString = function(string, relativePath) {
		// Only operate on files in the bin folder
		if (!/^bin\//.test(relativePath)) return string;

		// Run the wrapper on the bin file
		return wrapFiles.prototype.processString.call(this, string, relativePath);
	};

	return shebangTree;
};


var tree = getSourceTrees([ 'lib', 'src', 'bin', 'test' ]);
tree = addSourceMapSupport(tree);
tree = esTranspiler(tree);
tree = addBinShebang(tree);

module.exports = tree;
