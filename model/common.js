const jwt = require('jwt-simple');
const config = require('../config/jwt-config');
const database = require('./pool');

const common = (res) => {    
    return {
        success: (rows) => {            
            res.status(200).json({
                status: 'success',
                data: rows
            })
        },
        error: (error) => {
            res.status(400).json({
                status: 'error',
                data: error
            })
        },
        validate: (req, payload) => {
            return new Promise((resolve, reject) => {
                if (payload.body) {
                    payload.body.map(v => {                                                
                        if (req.body[v] === undefined) {
                            reject(`body.${v} is required`)
                        }
                    })
                }
                resolve();
            })
        },
        authentication: (req, table, id, admin) => {
            return new Promise((resolve, reject) => {                
                const permit_table = ['posts','post_comments','game_comments'];
                const token = req.headers['x-access-token'];
                if (!token) {
                    reject(`headers['x-access-token'] is required`);
                    return;
                }                
                const value = jwt.decode(token, config.jwtSecret);
                if (!value.id)
                    reject(`headers['x-access-token'] is invalid`)
                if (table === 'users') {                                                        
                    if (value.id === Number(id))
                        resolve();
                } else if (permit_table.includes(table)) { 
                    console.log(value.id);
                                                           
                    database.query(`SELECT id FROM ${table} WHERE user_id = ?`,[value.id])
                    .then(rows => {
                        rows.map(row => {
                            if (row.id === Number(id))
                             resolve();
                        })
                        if (admin === true) {
                            database.query(`SELECT COUNT(*) AS count FROM admin WHERE user_id='${value.id}'`)
                            .then(rows => {                        
                                if (rows[0].count > 0)
                                    resolve();
                                else
                                    reject('permission denied')                    
                            }).catch(reject)
                        } else {
                            reject('permission denied');
                        }
                    }).catch(reject);
                } else if (admin === true) {
                    database.query(`SELECT COUNT(*) AS count FROM admin WHERE user_id='${value.id}'`)
                    .then(rows => {                        
                        if (rows[0].count > 0)
                            resolve();
                        else
                            reject('permission denied')                    
                    }).catch(reject)
                } else {                    
                    reject('authentication failed')
                }
            })
        },
        decodeToken: (req) => {
            return new Promise((resolve, reject) => {
                const token = req.headers['x-access-token'];                
                if (!token) {
                    reject(`headers['x-access-token'] is required`);
                } else {
                    const value = jwt.decode(token, config.jwtSecret);
                    if (!value.id) {
                        reject(`headers['x-access-token'] is invalid`) 
                    } else {
                        resolve(value.id);
                    }
                }
            })
        }
    }
}
module.exports = common;