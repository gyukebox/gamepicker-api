const mysql = require('mysql');
const config = require('../config/db-config');

const moment = require('moment-timezone');
require('moment/locale/ko');

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
                if (err) reject(err);
                conn.query(sql, opt, (err, rows) => {
                    if (err) {
                        reject(err);
                        conn.release();
                    } else {
                        if(rows.length > 0) {
                            rows.map(row => {
                                if(row.update_date) {
                                    row.update_date = moment(row.update_date).tz('Asia/Seoul').startOf('second').fromNow();
                                }
                                if(row.create_date) {
                                    row.create_date = moment(row.create_date).tz('Asia/Seoul').startOf('second').fromNow();
                                }
                                if(row.login_date) {
                                    row.login_date = moment(row.login_date).tz('Asia/Seoul').startOf('second').fromNow();
                                }
                            })
                        }
                        resolve(rows);     
                        conn.release();
                    }
                })
            })
        })
    }
}

module.exports = database;