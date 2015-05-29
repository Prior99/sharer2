/*
 * Imports
 */
var Winston = require("winston");
var Express = require("express");
var ExpressHandlebars = require("express-handlebars");
var LessMiddleware = require("less-middleware");

var Database = require("./database");

var Sharer = function(options) {
	this.port = options.port ? options.port : 43526;
	this._startDatabase(options.database, function(err) {
		if(err) {
			throw err;
		}
		else {
			this._startWebserver();
		}
	}.bind(this));

};

Sharer.prototype._startDatabase = function(options, callback) {
	this.database = new Database(options, callback);
};
Sharer.prototype._startWebserver = function(callback) {
	Winston.info("Webserver starting up ...");
	this.express = Express();
	this.express.engine(".hbs", ExpressHandlebars({
		defaultLayout : "main",
		extname : ".hbs"
	}));
	this.express.use(LessMiddleware('public/'));
	this.express.set("view engine", ".hbs");
	this.express.use('/', Express.static('public/'));
	this.express.get('/', require("./models/home")());
	this.express.get('/upload', require("./models/upload")());
	this.express.use('/api', require("./models/api/api")());
	this.express.use('/bootstrap', Express.static('node_modules/bootstrap/dist/'));
	this.express.use('/jquery', Express.static('node_modules/jquery/dist/'));
	this.express.use('/fontawesome', Express.static('node_modules/font-awesome/'));
	this._httpServer = this.express.listen(this.port, function() {
		Winston.info("Webserver successfully started!");
		if(callback) { callback(); }
	});
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
	this._httpServer.close(function() {
		Winston.info("Webserver successfully stopped!");
		if(callback) { callback(); }
	});
};

Sharer.prototype.stop = function() {
	this._stopWebserver(this._stopDatabase.bind(this));
};

module.exports = Sharer;
