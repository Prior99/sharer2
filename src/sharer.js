/*
 * Imports
 */
var Winston = require("winston");
var Express = require("express");
var ExpressHandlebars = require("express-handlebars");
var LessMiddleware = require("less-middleware");

var Sharer = function(options) {
	Winston.info("Webserver starting up ...");
	this.port = options.port ? options.port : 43526;

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
	});
};

Sharer.prototype.stop = function() {
	Winston.info("Webserver shutting down ...");
	this._httpServer.close(function() {
		Winston.info("Webserver successfully stopped!");
	});
}

module.exports = Sharer;
