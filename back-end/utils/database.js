import mysql from 'mysql';
import dotenv from 'dotenv';
dotenv.config();

export class Database {
    constructor() {
        this.config = {
            host: process.env.SQL_HOST,
            database: process.env.SQL_DATABASE,
            user: process.env.SQL_USERNAME,
            password: process.env.SQL_PASSWORD,
        };
        this.db = null;
    }

    create() {
        this.db = mysql.createConnection(this.config);
    }

    end() {
        this.db.end();
    }

    sendQuery(query) {
        this.create();
        return new Promise((resolve, reject) => {
            this.db.query(query, (err, result) => {
                if (err || !result) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
            this.end();
        });
    }
}
