module.exports = function() {
	var started = new Date();
	return function(req, res) {
		res.render("upload");
	}
};
