const mysql = require('mysql');
require('dotenv').config();

class Database {
    constructor() {
        this.config = {
            host: process.env.SQL_HOST,
            database: process.env.SQL_DATABASE,
            user: process.env.SQL_USERNAME,
            password: process.env.SQL_PASSWORD,
        };
        this.db = null;
    }

    createConnection() {
        this.db = mysql.createConnection(this.config);
    }

    endConnection() {
        this.db.end();
    }

    sendQuery(query) {
        this.createConnection();
        return new Promise((resolve, reject) => {
            this.db.query(query, (err, result) => {
                if (err || !result) {
                    resolve({ error: 'An error occurred' });
                } else {
                    resolve(result);
                }
            });
            this.endConnection();
        });
    }
}

module.exports = Database;
