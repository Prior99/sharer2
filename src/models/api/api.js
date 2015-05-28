/*
 * Imports
 */
var Express = require('express');

module.exports = function() {
	var router = Express.Router();

	router.use('/upload', require("./upload")(router));

	return router;
};
