/*
 * Code
 */
module.exports = function(filemanager) {
	return function(req, res) {
		filemanager.getFileList(function(err, list) {
			if(err) {
				res.status(500);
			}
			else {
				res.json(list);
			}
		});
	}
};
