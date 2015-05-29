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

Filemanager.prototype.encodeIndex = function(index) {
	cipher = Crypto.createCipher('aes192', this.key);
	cipher.update("" + index, "utf8", "hex");
	return cipher.final("hex");
};

Filemanager.prototype.decodeIndex = function(encoded) {
	decipher = Crypto.createDecipher('aes192', this.key);
	decipher.update(encoded, "hex", "utf8");
	return parseInt(decipher.final("hex"));
};

module.exports = Filemanager;
