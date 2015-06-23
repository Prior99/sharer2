/*
 * Imports
 */
var Winston = require("winston");
var Express = require("express");
var ExpressHandlebars = require("express-handlebars");
var LessMiddleware = require("less-middleware");

/*
 * Code
 */
var Webserver = function(port, filemanager, callback) {
	this.port = port;
	this.filemanager = filemanager;
	Winston.info("Webserver starting up ...");
	this.express = Express();
	this.express.engine(".hbs", ExpressHandlebars({
		defaultLayout : "main",
		extname : ".hbs"
	}));
	this.express.use(LessMiddleware('public/'));
	this.express.set("view engine", ".hbs");
	this.express.use('/', Express.static('public/'));
	this.express.get('/', function(req, res) {
		res.redirect('/upload');
	});
	this.express.get('/d/:filename', require("./models/api/download")(filemanager)); //Shortcut
	this.express.get('/upload', require("./models/upload")());
	this.express.get('/downloads', require("./models/downloads")());
	this.express.use('/api', require("./models/api/api")(filemanager));
	this.express.use('/bootstrap', Express.static('node_modules/bootstrap/dist/'));
	this.express.use('/jquery', Express.static('node_modules/jquery/dist/'));
	this.express.use('/fontawesome', Express.static('node_modules/font-awesome/'));
	this._httpServer = this.express.listen(this.port, function(err) {
		if(err) {
			Winston.error("Starting webserver failed!");
			if(callback) { callback(err); }
			else { throw err; }
		}
		else {
			Winston.info("Webserver successfully started!");
			if(callback) { callback(); }
		}
	});
};

Webserver.prototype.stop = function(callback) {
	this._httpServer.close(callback);
};

module.exports = Webserver;
