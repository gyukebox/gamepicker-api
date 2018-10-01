const mysql = require('mysql');
const dbConfig = require('../config/db-config');

class Database {
    constructor() {
        this.connection = mysql.createConnection(dbConfig);
        this.connection.query('SET NAMES utf8');
    }
    query(sql, args) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, args, (err, rows) => {
                if (err)
                    return reject(err);
                resolve(rows);
            });
        });
    }
    unique(table ,field, data) {
        return new Promise((resolve, reject) => {
            this.connection.query(`SELECT EXISTS (SELECT id from ${table} WHERE ${field}='${data}') AS success`, (err, rows) => {
                if (err)
                    return reject(err);
                if (rows[0].success === 1)
                    return reject(`${data} exist at ${field}}`)
                resolve();
            })
        })
    }
    close() {
        return new Promise((resolve, reject) => {
            this.connection.end(err => {
                if (err)
                    return reject(err);
                resolve();
            });
        });
    }
}
module.exports = Database;