/*
 * Imports
 */
var Crypto = require("crypto");
var FS = require("fs");
/*
 * Code
 */

var Filemanager = function(options, database) {
	this.key = options.secret;
	this.database = database;
};

Filemanager.prototype.addFile = function(filename, tempfile, ip, mimetype, callback) {
	var processCallback = function(err, id) {
		if(err) {
			Winston.error("Could not add file to database.");
			callback(err);
		}
		var encodedIndex = this.encodeIndex(id);
		FS.rename(tempfile, "uploads/" + encodedIndex, function(err) {
			if(err) {
				Winston.error("Could not rename file.");
			}
			callback(err, encodedIndex);
		});
	}.bind(this);
	var insertIntoDatabase = function(filename, size, ip) {
		this.database.addFile(filename, size, ip, mimetype, processCallback);
	}.bind(this);

	FS.stat(tempfile, function(err, stats) {
		if(err) {
			Winston.error("Could not stat file " + tempfile);
			callback(err);
		}
		else {
			var size = stats["size"];
			insertIntoDatabase(filename, size, ip);
		}
	});

};

Filemanager.prototype.getFile = function(encodedIndex, callback) {
	var index = this.decodeIndex(encodedIndex);
	this.database.getFile(index, function(err, file) {
		if(err) {
			Winston.error("Could not retrieve file from database.");
			callback(err);
		}
		else {
			callback(null, file);
		}
	});
};

Filemanager.prototype.getFileList = function(callback) {
	this.database.getFileList(function(err, list) {
		if(err) {
			Winston.error("Could not retrieve file from database.");
			callback(err);
		}
		else {
			var arr = [];
			for(var i in list) {
				var entry = list[i];
				arr.push({
					id : this.encodeIndex(entry.id),
					filename : entry.filename,
					date : entry.uploaded,
					mimetype : entry.mimetype,
					size : entry. size
				});
			}
			callback(null, arr);
		}
	}.bind(this));
};

Filemanager.prototype.encodeIndex = function(index) {
	var cipher = Crypto.createCipher('aes192', this.key);
	cipher.update("" + index, "utf8", "hex");
	return cipher.final("hex");
};

Filemanager.prototype.decodeIndex = function(encoded) {
	var decipher = Crypto.createDecipher('aes192', this.key);
	decipher.update(encoded, "hex", "utf8");
	return parseInt(decipher.final());
};

module.exports = Filemanager;
