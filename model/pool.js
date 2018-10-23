const mysql = require('mysql');
const config = require('../config/db-config');

const pool = mysql.createPool({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.database,
    connectionLimit: 20,
    waitForConnections: true,
    multipleStatements: true
});

const database = {
    query: (sql, opt) => {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, conn) => {
                conn.query(sql, opt, (err, rows) => {
                    if (err) {
                        reject(err);
                        conn.release();
                    } else {
                        resolve(rows);     
                        conn.release();
                    }
                })
            })
        })
    }
}

module.exports = database;