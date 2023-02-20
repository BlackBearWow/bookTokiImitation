const mysql = require('mysql');

class DB {
    static connection;
    static createSysCon(){
        this.connection = mysql.createConnection({
            host: 'localhost',
            port: 3306,
            user: 'root',
            password: 'onlyroot',
            database: 'sys'
        });
        this.connection.connect()
    }
    static createCon(){
        this.connection = mysql.createConnection({
            host: 'localhost',
            port: 3306,
            user: 'root',
            password: 'onlyroot',
            database: 'bookTokiimitation'
        });
        this.connection.connect()
    }
    static query(sql) {
        this.connection.query(sql, function (error, results, fields) {
            if (error) throw error;
            console.log('The result is: ', results);
        });
    }
    static insertNovel(novelName, linkNum) {
        this.query(`insert into novel(novelName, linkNum) values('${novelName}', ${linkNum})`);
    }
    static select(sql, callback) {
        this.connection.query(sql, function (error, results, fields) {
            if (error) throw error;
            callback(results);
        });
    }
    //여 기 서 막 힘
    static async isNovelExist(novelName) {
        let count;
        await this.select(`select count(*) from novel where novelName = '${novelName}';`,
        function(results){
            count = results[0][`count(*)`];
        });
        return count;
        //콜백함수가 비동기라서 그런지 count를 구할 수 가 없다. 도대체...
    }
    static endConnection() {
        this.connection.end();
    }
}

module.exports = DB;