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
                message: error
            })
        },
        validate: (req, payload) => {
            return new Promise((resolve, reject) => {
                if (payload.body) {
                    payload.body.map(v => {                        
                        if (!req.body[v]) {
                            reject(`body.${v} is required`)
                            return;
                        }
                    })
                }
            })
        },
        authentication: (req, id, admin) => {
            return new Promise((resolve, reject) => {
                const token = req.headers['x-access-token'];
                if (!token) {
                    reject(`headers['x-access-token'] is required`);
                    return;
                }                
                try {
                    const value = jwt.decode(token, config.jwtSecret);
                } catch (error) {
                    reject(`headers['x-access-token'] is invalid`) 
                }
                if (value.id === id) {
                    resolve();
                } else if (admin === true) {
                    database.query(`SELECT COUNT(*) AS count FROM admin WHERE user_id='${value.id}'`)
                    .then(rows => {
                        if (rows[0].count > 0)
                            resolve();
                        else
                            reject('authentication(admin) failed');
                    })
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
                }                
                try {
                    const value = jwt.decode(token, config.jwtSecret);
                } catch (error) {
                    reject(`headers['x-access-token'] is invalid`) 
                }
                resolve(value.id);
            })
        }
    }
}
module.exports = common;