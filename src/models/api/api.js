/*
 * Imports
 */
var Express = require('express');

/*
 * Code
 */
module.exports = function() {
	var router = Express.Router();

	router.use('/upload', require("./upload")(router));

	return router;
};
