const mysql = require('mysql2');
const config = require('../config/database')

const pool = mysql.createPool(config);

module.exports = {
    query: (sql, opt) => {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, conn) => {
                if (err) {
                    reject(err);
                }
                conn.query(sql, opt, (err, rows) => {
                    if (err) {
                        conn.release();
                        reject(err);
                    }
                    conn.release();
                    resolve(rows);
                })
            })
        })
    }
}