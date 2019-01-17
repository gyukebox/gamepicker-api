const express = require('express');
const router = express.Router();
const jwt = require('../model/jwt');
const nodemailer = require('nodemailer');
const mail_config = require('../config/mail');
const pbkdf2Password = require('pbkdf2-password');
const hasher = pbkdf2Password(); 

router.post('/login', async (req, res, next) => {
    const { email, password, os_type, reg_id } = req.body;
    const { admin } = req.query;
    const getHash = (salt, password) => new Promise((resolve, reject) => {
        hasher({ password: password, salt: salt }, (err, pass, salt, hash) => {
            if (err)    reject(err);
            else        resolve(hash);
        })
    })
    try {
        const [[user]] = await pool.query(`SELECT salt, id, active, password FROM users WHERE email = ?`,[email]);
        if (!user)
            throw { status: 404, message: 'User not found'}
        const hash = await getHash(user.salt, password);            
        if (hash != user.password) 
            throw { status: 400, message: "Incorrect password" }
        if (!user.active)
            throw { status: 401, message: 'Mail authentication required' }
        if (admin) {
            const [[admin]] = await pool.query(`SELECT user_id FROM admin WHERE user_id = ?`,[user.id]);
            if (!admin) 
                throw { status: 404, message: 'Admin not found' }
        }
        await pool.query(`UPDATE users SET os_type = ?, reg_id = ? WHERE id = ?`,[os_type, reg_id, user.id])
        res.status(200).json({
            user_id: user.id,
            token: jwt.encode({
                email: email,
                password: hash
            })
        })
    } catch (err) {
        next(err);
    }

})

router.post('/register', async (req, res, next) => {
    const { name, email, password, birthday, gender } = req.body;

    const encrypt = (password) => new Promise((resolve, reject) => {
        hasher({ password: password }, (err, pass, salt, hash) => {
            if (err)    reject(err);
            else        resolve({hash: hash, salt: salt});
        })
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
            html: `<p>Test</p><a href='http://api.gamepicker.co.kr/auth/activate?token=${token}'>인증하기</a>`
        }
        transporter.sendMail(mailOptions, (err, info) => {
            if (err)
                reject({ code: 500, message: "Failed to send authentication mail. Please contact the developer" })
            else
                resolve();
            transporter.close();
        })
    })
    try {
        const {salt, hash} = await encrypt(password);
        const token = jwt.encode({ email: email, password: hash })
        await pool.query('INSERT INTO users(name, email, password, birthday, gender, salt) VALUES (?, ?, ?, ?, ?, ?)', [name, email, hash, birthday, gender, salt]);
        await sendMail(token);
        res.status(204).json();
    } catch (err) {
        next(err);
    }
})

//FIXME: change login when web published
router.get('/activate', async (req, res, next) => {
    const { token } = req.query;
    const { email, password } = jwt.decode(token);    
    try {
        const [rows] = await pool.query('UPDATE users SET active = 1 WHERE email = ? AND password = ?',[email, password]);
        if (rows.affectedRows === 0)
            throw { status : 404, message: 'User not found' }
        res.status(301).redirect("http://www.gamepicker.co.kr");
    } catch (err) {
        next(err);
    }
})

module.exports = router;