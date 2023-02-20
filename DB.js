const mysql = require('mysql');

class DB {
    static connection;
    static createCon(){
        this.connection = mysql.createConnection({
            host: 'localhost',
            port: 3306,
            user: 'root',
            password: 'onlyroot',
            database: 'sys'
        });
        this.connection.connect();
    }
    static query(sql) {
        this.connection.query(sql, function (error, results, fields) {
            if (error) throw error;
            console.log('The result is: ', results);
        });
    }
    static endConnection() {
        this.connection.end();
    }
}

module.exports = DB;