CREATE TABLE IF NOT EXISTS Files (
	id              INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	size			INT NOT NULL,
	filename		VARCHAR(128),
	uploaded		DATE,
	ip				INT
);
