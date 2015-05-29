/*
 * Imports
 */
var Winston = require('winston');
var MySQL = require('mysql');
var FS = require("fs");

/*
 * Code
 */
var Database = function(options, callback) {
	this.pool = MySQL.createPool({
		host : options.host,
		user : options.user,
		password : options.password,
		database : options.database,
		multipleStatements : true,
		connectTimeout : options.connectTimeout ? options.connectTimeout : 4000
	});
	Winston.info("Connecting to database mysql://" + options.user + "@" + options.host + "/" + options.database + " ... ");
	this.pool.getConnection(function(err, conn) {
		if(err) {
			Winston.error("Connecting to database failed!");
			if(callback) { callback(err); }
			else { throw err; }
		}
		else {
			conn.release();
			Winston.info("Successfully connected to database!");
			this._setupDatabase(callback);
		}
	}.bind(this));
};

Database.prototype.getFileList = function(callback) {
	this.pool.query("SELECT id, filename, size, ip, mimetype, uploaded FROM Files LIMIT 200", function(err, rows) {
		if(err) {
			if(callback) { callback(err); }
			else throw err;
		}
		else {
			if(callback) { callback(null, rows); }
		}
	});
};

Database.prototype.addFile = function(filename, size, ip, mimetype, callback) {
	if(filename && size && ip && mimetype) {
		this.pool.query("INSERT INTO Files(filename, size, ip, mimetype, uploaded) VALUES (?, ?, ?, ?, ?)",
			[filename, size, ip, mimetype, new Date()], function(err, result) {
				if(err) {
					if(callback) { callback(err); }
					else throw err;
				}
				else {
					if(callback) { callback(null, result.insertId); }
				}
			}
		);
	}
	else {
		var err = new Error("Not all needed arguments were supplied.");
		if(callback) { callback(err); }
		else { throw err; }
	}
};

Database.prototype.getFile = function(index, callback) {
	if(index) {
		this.pool.query("SELECT filename, size, ip, mimetype, uploaded FROM Files WHERE id = ?",
			[index], function(err, rows) {
				if(err) {
					if(callback) { callback(err); }
					else throw err;
				}
				else {
					if(callback) { callback(null, rows[0]) }
				}
			}
		);
	}
	else {
		var err = new Error("Not all needed arguments were supplied.");
		if(callback) { callback(err); }
		else { throw err; }
	}
};

Database.prototype._setupDatabase = function(callback) {
	FS.readFile("schemas/database.sql", {encoding : "utf8"}, function(err, data) {
		if(err) {
			throw err;
		}
		else {
			this.pool.query(data, function(err) {
				if(err) {
					Winston.error("An error occured while configuring database:", err);
					if(callback) { callback(err); }
					else { throw err; }
				}
				else  if(callback) { callback(); }
			});
		}
	}.bind(this));
};

Database.prototype.stop = function(callback) {
	this.pool.end(callback);
};

module.exports = Database;
