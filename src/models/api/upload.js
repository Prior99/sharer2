/*
 * Imports
 */
var Multer = require('multer');
var FS = require('fs');
var Winston = require('winston');

/*
 * Code
 */
var _fileTempNumber = 0;
var filemanager;

/*
 * Handles one request for uploading multiple or one file
 */
var Upload = function(req, res) {
	this.status = {};
	this.req = req;
	this.res = res;
	if(Object.prototype.toString.call(this.req.files["upload[]"]) === "[object Array]") {
		this.files = this.req.files["upload[]"];
	}
	else {
		this.files = [ this.req.files["upload[]"] ];
	}
	for(var i in this.files) {
		this._handleFile(this.files[i]);
	}
};

Upload.prototype._done = function() {
	this.res.send(JSON.stringify(this.status));
};

Upload.prototype._checkDone = function() {
	var len1 = 0;
	for(var key in this.status) {
		len1++;
	}
	if(this.files.length == len1) {
		this._done();
	}
};

Upload.prototype._completed = function(err, file, id) {
	var fileStatus;
	if(err) {
		fileStatus = {
			okay : false,
			reason : "renaming_failed"
		};
	}
	else {
		fileStatus = {
			okay : true,
			url : "/d/" + id
		};
	}
	this.status[file.originalname] = fileStatus;
	this._checkDone();
};

Upload.prototype._handleFile = function(file) {
	filemanager.addFile(file.originalname, file.path, this.req.ip, file.mimetype, function(err, id) {
		this._completed(err, file, id);
	}.bind(this));
};

/*
 * Renames one file to it's temporary name
 */

function rename(fieldname, filename) {
	return filename + "_" + (_fileTempNumber++ % 10000000);
}

/*
 * Use Multer middleware and redirect requests to new upload to handle
 * the request
 */

module.exports = function(router, _filemanager) {
	filemanager = _filemanager;
	router.use(Multer({
		dest : "temp/",
		rename : rename
	}));
	var started = new Date();
	return function(req, res) {
		new Upload(req, res);
	}
};
