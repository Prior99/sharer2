/*
 * Imports
 */
var Winston = require("winston");

var Webserver = require("./webserver");
var Database = require("./database");
var Filemanager = require("./filemanager");

/*
 * Code
 */
var Sharer = function(options) {
	this._startDatabase(options.database, function(err) {
		if(err) {
			throw err;
		}
		else {
			this.filemanager = new Filemanager(options, this.database);
			this._startWebserver(options);
		}
	}.bind(this));

};

Sharer.prototype._startDatabase = function(options, callback) {
	this.database = new Database(options, callback);
};
Sharer.prototype._startWebserver = function(options, callback) {
	this.webserver = new Webserver(options.port ? options.port : 43526, this.filemanager, callback);
};

Sharer.prototype._stopDatabase = function(callback) {
	Winston.info("Database shutting down ...");
	this.database.stop(function() {
		Winston.info("Database successfully stopped!");
		if(callback) { callback(); }
	});
};

Sharer.prototype._stopWebserver = function(callback) {
	Winston.info("Webserver shutting down ...");
	this.webserver.stop(function() {
		Winston.info("Webserver successfully stopped!");
		if(callback) { callback(); }
	});
};

Sharer.prototype.stop = function() {
	this._stopWebserver(this._stopDatabase.bind(this));
};

module.exports = Sharer;
