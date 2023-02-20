const DB = require("./DB");

DB.createCon();
DB.query(`drop database if exists bookTokiimitation;`);
DB.query(`create database bookTokiimitation;`);
DB.query(`use bookTokiimitation;`);
DB.query(`drop table if exists novel;`);
DB.query(`create table novel(
	novel_id int NOT NULL AUTO_INCREMENT,
	novelName varchar(50) NOT NULL,
	linkNum int NOT NULL,
	specification varchar(500),
	primary key(novel_id)
)`);
//DB.query();
DB.endConnection();