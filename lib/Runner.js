var
	merge = require('merge'),
	Promise = require('bluebird'),
	Validator = require('./Validator')
;

/**
 * @constructor
 * @param {Object} options
 */
function Runner(options) {
	this._options = options;
	this._processedFiles = 0;
	this._invalid = {};
}

/**
 * Check if a file is valid based on validation settings
 * @param {String} path Path to file
 */
Runner.prototype.validate = function(path) {
	return new Promise(function(resolve) {
		var validator = new Validator(this._options);
		validator.validate(path)
			.then(function() {
				merge(this._invalid, validator.getInvalidFiles());
				this._processedFiles++;
			}.bind(this))
			.then(resolve);
	}.bind(this));
};

/**
 * Get count of processed files
 * @return {Number}
 */
Runner.prototype.getProcessedFiles = function() {
	return this._processedFiles;
};

/**
 * Get invalid lines by path
 * @param {String} path
 * @return {Object} each key in the returned object represents a line from the
 * file of the given path, each value an exeption message of the current line.
 */
Runner.prototype.getInvalidLines = function(path) {
	if (!this._invalid[path]) {
		return {};
	}

	return this._invalid[path];
};

/**
 * Get a all invalid lines and messages from processed files.
 * @return {Object} each key in the returned object represents a path of a
 * processed invalid file. Each value is an other object
 * containing the validation result.
 */
Runner.prototype.getInvalidFiles = function() {
	return this._invalid;
};

// Expose Runner:
module.exports = Runner;
