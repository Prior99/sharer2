CREATE TABLE IF NOT EXISTS Files (
	id              INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	size			INT NOT NULL,
	filename		VARCHAR(128),
	uploaded		DATETIME,
	ip				VARCHAR(46),
	mimetype		VARCHAR(64)
);
