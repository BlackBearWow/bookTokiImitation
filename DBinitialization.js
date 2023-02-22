const DB = require("./DB");

DB.createSysCon();
DB.query(`drop database if exists bookTokiimitation;`);
DB.query(`create database bookTokiimitation;`);
DB.query(`use bookTokiimitation;`);

DB.query(`drop table if exists novel;`);
DB.query(`create table novel(
	novel_id int NOT NULL AUTO_INCREMENT,
	novelName varchar(100) NOT NULL,
	linkNum int NOT NULL,
	primary key(novel_id)
)`);

DB.query(`drop table if exists content;`);
DB.query(`create table content(
	content_id int NOT NULL AUTO_INCREMENT,
	novel_id int NOT NULL,
	contentOrder int NOT NULL,
	contentName varchar(100) NOT NULL,
	contentLinkNum int NOT NULL,
	primary key(content_id)
)`);

DB.endConnection();