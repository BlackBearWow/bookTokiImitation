const mysql = require("mysql");

class DB {
    static connection;
    static createSysCon() {
        this.connection = mysql.createConnection({
            host: "localhost",
            port: 3306,
            user: "root",
            password: "onlyroot",
            database: "sys",
        });
        this.connection.connect();
        console.log('DB sys로 커넥트 성공');
    }
    static createCon() {
        this.connection = mysql.createConnection({
            host: "localhost",
            port: 3306,
            user: "root",
            password: "onlyroot",
            database: "bookTokiimitation",
        });
        this.connection.connect();
        console.log('DB bookTokiimitation으로 커넥트 성공');
    }
    static query(sql) {
        this.connection.query(sql, function (error, results, fields) {
            if (error) throw error;
            console.log(`성공: ${sql}`);
        });
    }
    static insertNovelPromise(novelName, linkNum) {
        return new Promise((resolve, reject) => {
            this.#isNovelExistPromise(novelName)
                .then((data) => {
                    //DB에 소설이 없다면 insert한다.
                    if (data == 0){
                        this.query(
                            `insert into novel(novelName, linkNum) values('${novelName}', ${linkNum})`
                        );
                    }
                    resolve('ok');
                });
        });
    }
    static insertContentPromise(novel_id, contentOrder, contentName, contentLinkNum) {
        return new Promise((resolve, reject) => {
            this.#isContentExistPromise(novel_id, contentOrder, contentName, contentLinkNum)
            .then((data) => {
                if (data == 0){
                    this.query(`insert into content(novel_id, contentOrder, contentName, contentLinkNum) values(${novel_id}, ${contentOrder}, '${contentName}', ${contentLinkNum})`)
                }
                resolve('ok');
            })
        })
    }
    static selectPromise(sql) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, function (error, results, fields) {
                if (error) throw error;
                //console.log(results);
                resolve(results);
            });
        });
    }
    static #isContentExistPromise(novel_id, contentOrder, contentName, contentLinkNum) {
        return new Promise((resolve, reject) => {
            this.selectPromise(`select count(*) from content where novel_id = ${novel_id} and contentOrder = ${contentOrder} and contentName = '${contentName}' and contentLinkNum = ${contentLinkNum}`).then((result) => {
                resolve(result[0]["count(*)"]);
            })
        })
    }
    // DB에 소설이 몇개 있는지 확인한다.
    static #isNovelExistPromise(novelName) {
        return new Promise((resolve, reject) => {
            this.selectPromise(
                `select count(*) from novel where novelName = '${novelName}';`
            ).then((result) => {
                resolve(result[0]["count(*)"]);
            });
        });
    }
    static endConnection() {
        this.connection.end();
        console.log('DB end 성공')
    }
}

module.exports = DB;