const jwt = require('jwt-simple');
const db = require('../model/database');
const jwtConfig = require('../config/jwt');

module.exports = (res) => {
    return {
        adminAuth: (user_id) => new Promise((resolve, reject) => {
            db.query(`SELECT * FROM admin WHERE user_id = ?`,[user_id])
            .then(rows => {
                if (rows.length > 0) {
                    resolve();
                } else {    
                    reject({
                        code: 401,
                        data: {
                            message: 'Administrator authentication required'
                        }
                    })
                }
            }).catch(reject);
        }),
        decodeToken: (token) => new Promise((resolve, reject) => {
            if (!token) {
                reject({
                    code: 400,
                    data: {
                        message: 'Token is required'
                    }
                })
            }
            let email, password;
            try {
                payload = jwt.decode(token, jwtConfig.secret);   
                email = payload.email;
                password = payload.password;
            } catch(e) {
                reject({
                    code: 400,
                    data: {
                        message: 'Token is invalid'
                    }
                });
            }  
                    
            db.query(`SELECT id FROM users WHERE email = ? AND password = ?`,[email, password])
            .then(rows => {
                if (rows.length === 0) {
                    reject({
                        code: 404,
                        data: {
                            message: 'User not found'
                        }
                    })
                } else {
                    resolve(rows[0].id);
                }
            }).catch(err => {
                reject(err);
            })
        }),
        success: (response) => {
            res.status(response.code).json(response.data);
        },
        fail: (err) => {
            if (err.code && err.data) {
                res.status(err.code).json(err.data)
            } else {
                res.status(500).json({ data: err.sqlMessage })              
            }
        }
    }
}