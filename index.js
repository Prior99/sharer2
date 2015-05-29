/*
 * Imports
 */
var Winston = require("winston");
var Sharer = require("./src/sharer");

var options = require("./config.json");
var package = require("./package.json");

/*
 * Initialize Winston
 */

function fillZero(number, len) {
	number = "" + number;
	while(number.length < len) {
		number = "0" + number;
	}
	return number;
}

Winston.remove(Winston.transports.Console);
Winston.add(Winston.transports.Console, {
	colorize: true,
	timestamp: function() {
		var d = new Date();
		return d.getYear() + 1900 + "-" + fillZero(d.getMonth() + 1, 2) + "-" + fillZero(d.getDate(), 2) + " " +
		fillZero(d.getHours(), 2) + ":" + fillZero(d.getMinutes(), 2) + ":" + fillZero(d.getSeconds(),2);
	}
});

Winston.add(Winston.transports.File, {
	filename : 'sharer.log',
	maxsize : '64000',
	maxFiles : 7,
	json: false,
	colorize: true,
	timestamp: function() {
		var d = new Date();
		return d.getYear() + 1900 + "-" + fillZero(d.getMonth() + 1, 2) + "-" + fillZero(d.getDate(), 2) + " " +
		fillZero(d.getHours(), 2) + ":" + fillZero(d.getMinutes(), 2) + ":" + fillZero(d.getSeconds(),2);
	}
 });

/*
 * Setup Sharer
 */

var _killed = false;

Winston.info(" * ");
Winston.info(" * Sharer starting up!");
Winston.info(" * Version v" + package.version);
Winston.info(" * node v" + process.versions.node);
Winston.info(" * ");

var sharer = new Sharer(options);

process.on('SIGINT', function() {
	console.log();
	if(_killed) {
		Winston.error("CTRL^C pressed twice! Terminating application!");
		process.exit(1);
	}
	else {
		_killed = true;
		Winston.warn("CTRL^C detected. Shutting down server ...");
		Winston.warn("Press CTRL^C again to terminate the server at your own risk.");
		sharer.stop();
	}
});
