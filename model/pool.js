const mysql = require('mysql');
const config = require('../config/db-config');

const pool = mysql.createPool({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.database,
    connectionLimit: 20,
    waitForConnections: true
});

const database = {
    query: (sql) => {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, conn) => {
                conn.query(sql, (err, rows) => {
                    if (err) {
                        conn.release();
                        reject(err);
                    }
                    conn.release();
                    resolve(rows);     
                    
                })
            })
        })
    },
    unique: (table, field, data) => {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, conn) => {
                conn.query(`SELECT EXISTS (SELECT id from ${table} WHERE ${field}='${data}') AS success`, (err, rows) => {
                    if (err) {
                        conn.release();
                        reject(err);
                    }
                    if (rows[0].success === 1)
                        return reject(`${data} exist at ${field}`)
                    resolve();
                })
            })
        })
    }
}

module.exports = database;