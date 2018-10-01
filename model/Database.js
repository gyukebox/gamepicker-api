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
    count(field, data) {
        return new Promise((resolve, reject) => {
            this.connection.query(`SELECT count(*) as count FROM accounts WHERE ${field}='${data}'`, (err, rows) => {
                if (err)    return reject(err);
                else if (rows[0].count >= 1) return reject({error: `${data} exist at ${field}`})
                else    resolve();
            })
        })
    }
    unique(field, data) {
        return new Promise((resolve, reject) => {
            this.connection.query(`SELECT count(*) as count FROM accounts WHERE ${field}='${data}'`, (err, rows) => {
                if (err)    return reject(err);
                else if (rows[0].count >= 1) return reject(`${data} exist at ${field}}`)
                else    resolve();
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