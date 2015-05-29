/*
 * Imports
 */
var FS = require("fs");
/*
 * Code
 */

function sendFile(file, res, encryptedIndex) {
	res.setHeader("content-type", file.mimetype);
	res.setHeader("content-disposition", "inline; filename=\"" + file.filename + "\"");
	res.setHeader("content-length", file.size);
	FS.createReadStream("uploads/" + encryptedIndex).pipe(res);
}

module.exports = function(filemanager) {
	return function(req, res) {
		var encryptedIndex = req.params.filename;
		filemanager.getFile(encryptedIndex, function(err, file) {
			if(err) {
				res.status(500);
			}
			else {
				sendFile(file, res, encryptedIndex);
			}
		});

	}
};
