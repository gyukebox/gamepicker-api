const express = require('express');
const router = express.Router();
const db = require('../model/database');
const jwt = require('../model/jwt');
const nodemailer = require('nodemailer');
const mail_config = require('../config/mail');

router.post('/login', (req, res) => {
    const { email, password, os_type, reg_id } = req.body;
    const { success, fail } = require('./common')(res);

    const login = () => new Promise((resolve, reject) => {
        db.query(`SELECT id, active, password FROM users WHERE email = ?`,[email])
        .then(rows => {
            if (rows.length === 0) {
                reject({
                    code: 400,
                    data: {
                        message: 'User not found'
                    }
                })
            } else if (rows[0].password !== password) {
                reject({
                    code: 400,
                    data: {
                        message: 'Incorrect password'
                    }
                })
            } else if (!rows[0].active) {
                reject({
                    code: 401,
                    data: {
                        message: `Mail authentication required`
                    }
                })
            } else {
                const user_id = rows[0].id
                db.query('UPDATE users SET os_type = ?, reg_id = ? WHERE email = ?',[os_type, reg_id, email])
                .then(rows => {
                    resolve({
                        code: 200,
                        data: {
                            user_id: user_id,
                            token: jwt.encode({
                                email: email,
                                password: password
                            })
                        }
                    })
                }).catch(reject)
            }
        }).catch(reject);
    })
    login().then(success).catch(fail);
})

//FIXME: transaction required
router.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    const { success, fail } = require('./common')(res);

    const createUser = () => new Promise((resolve, reject) => {
        db.query('INSERT INTO users(name, email, password) VALUES (?, ?, ?)', [name, email, password])
        .then(rows => {
            const token = jwt.encode({
                email: email,
                password: password
            })
            resolve(token);
        }).catch(reject);
    })

    const sendMail = (token) => new Promise((resolve, reject) => {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: mail_config.user,
                pass: mail_config.pass
            }
        })
        const mailOptions = {
            from: mail_config.user,
            to: email,
            subject: 'GamePicker 인증',
            html: `<p>Test</p><a href='http://localhost/auth/activate?token=${token}'>인증하기</a>`
        }
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err);
                reject({
                    code: 500,
                    data: {
                        message: "Failed to send authentication mail. Please contact the developer"
                    }
                })
            } else {
                resolve({
                    code: 204
                })
            }
            transporter.close();
        })
    })

    createUser().then(sendMail).then(success).catch(fail);
})

//FIXME: change redirect link
router.get('/activate', (req, res) => {
    const { token } = req.query;
    const { email, password } = jwt.decode(token);
    db.query('UPDATE users SET active = 1 WHERE email = ? AND password = ?',[email, password])
    .then(rows => {
        if (rows.affectedRows === 0) {
            res.status(404).json({ message: 'user not found' });
        } else {
            res.status(301).redirect('http://www.gamepicker.co.kr')
        }
    }).catch(err => {
        res.status(500).json({ message: err.sqlMessage });
    })
})

module.exports = router;