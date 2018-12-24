const express = require('express');
const router = express.Router();
const db = require('../model/database');
const jwt = require('../model/jwt');
const nodemailer = require('nodemailer');
const mail_config = require('../config/mail');

router.post('/login', (req, res) => {
    const { email, password, os_type, reg_id } = req.body;
    db.query('SELECT active, password FROM users WHERE email = ?',[email])
    .then(rows => {
        if (rows.length === 0) {    //incorrect email
            res.status(400).json({ message: 'user not found' })
        } else if (rows[0].password !== password) { //incorrect password
            res.status(401).json({ message: 'incorrect password' })
        } else if (!rows[0].active) {   //login success, but not authenticate
            res.status(401).json({ message: 'Mail authentication required' })
        } else {    //login success
            db.query('UPDATE users SET os_type = ?, reg_id = ? WHERE email = ?',[os_type, reg_id, email])
            res.status(200).json({
                token: jwt.encode({
                    email: email,
                    password: password
                })
            })
        }
    }).catch(err => {
        res.status(500).json({ message: err.sqlMessage })
    })
})

router.post('/manage/login', (req, res) => {
    const { success, fail } = require('./common')(res);
    const { email, password } = req.body;

    const login = () => new Promise((resolve, reject) => {
        db.query(`SELECT * FROM admin WHERE user_id = (SELECT id FROM users WHERE email = ? AND password = ?)`,[email, password])
        .then(rows => {
            if (rows.length === 0) {
                reject({
                    code: 404,
                    data: {
                        message: 'Admin not found'
                    }
                })
            } else {
                resolve({
                    code: 200,
                    data: {
                        token: jwt.encode({
                            email: email,
                            password: password
                        })
                    }
                })
            }
        })
    })

    login().then(success).catch(fail);

})

router.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    db.query('INSERT INTO users(name, email, password) VALUES (?, ?, ?)', [name, email, password])
    .then(rows => {
        //send email verification
        
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: mail_config.user,
                pass: mail_config.pass
            }
        })
        const token = jwt.encode({
            email: email,
            password: password
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
            } else {
                console.log(info.response);
            }
            transporter.close();
        })

        res.status(204).json();
    }).catch(err => {
        res.status(500).json({ message: err.sqlMessage })
    })
})

router.get('/activate', (req, res) => {
    const { token } = req.query;
    const { email, password } = jwt.decode(token);
    db.query('UPDATE users SET active = 1 WHERE email = ? AND password = ?',[email, password])
    .then(rows => {
        if (rows.affectedRows === 0) {
            res.status(404).json({ message: 'user not found' });
        } else {
            res.status(204).json();
        }
    }).catch(err => {
        res.status(500).json({ message: err.sqlMessage });
    })
})

router.put('/me', (req, res) => {
    const token = req.headers['x-access-token'];
    const { email, password } = jwt.decode(token);

    const option = [];
    let SET_string = "";
    ['name','introduce','password'].forEach(idx => {
        const item = req.body[idx];
        if (item) {
            SET_string += `${idx} = ?,`;
            option.push(item);
        }
    })
    SET_string = SET_string.substring(0, SET_string.length-1);
    option.push(email, password);
    db.query(`UPDATE users SET ${SET_string} WHERE email = ? AND password = ?`,option)
    .then(rows => {
        if (rows.affectedRows === 0) {
            res.status(404).json({ message: 'user not found' })
        } else {
            res.status(204)
        }
    })
})

router.delete('/me', (req, res) => {
    const token = req.headers['x-access-token'];
    const { email, password } = jwt.decode(token);

    db.query('DELETE FROM users WHERE email = ? AND password = ?',[email, password])
    .then(rows => {
        if (rows.affectedRows === 0) {
            res.status(404).json({ message: 'user not found' });
        } else {
            res.status(204);
        }
    }).catch(err => {
        res.status(500).json({ message: err.sqlMessage })
    })
})

module.exports = router;