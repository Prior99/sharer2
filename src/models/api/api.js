/*
 * Imports
 */
var Express = require('express');

/*
 * Code
 */
module.exports = function(filemanager) {
	var router = Express.Router();

	router.use('/upload', require("./upload")(router, filemanager));

	return router;
};
