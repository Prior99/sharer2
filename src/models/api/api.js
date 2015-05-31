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
	router.get('/list', require("./list")(filemanager));
	router.get('/d/:filename', require("./download")(filemanager)); //Shortcut

	return router;
};
