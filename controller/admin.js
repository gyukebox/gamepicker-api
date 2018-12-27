const express = require('express');
const router = express.Router();
const db = require('../model/database');
const jwt = require('../model/jwt');

router.post('/questions', (req, res) => {
    const { title, email, value } = req.body;
    const { success, fail } = require('./common')(res);
    const createQuestion = () => new Promise((resolve, reject) => {
        db.query(`INSERT INTO questions (title, email, value) VALUES (?, ?, ?)`,[title, email, value])
        .then(rows => {
            resolve({
                code: 204
            })
        }).catch(reject)
    })  
    createQuestion().then(success).catch(fail);
})

router.get('/questions', (req, res) => {
    const { success, fail } = require('./common')(res);
    const getQuestions = () => new Promise((resolve, reject) => {
        db.query(`SELECT id, title, email, value FROM questions`)
        .then(rows => {
            resolve({
                code: 200,
                data: {
                    questions: rows
                }
            })
        }).catch(reject)
    })
    getQuestions().then(success).catch(fail)
})

router.post('/questions/:question_id/reply', (req, res) => {
    const { question_id } = req.params;
    const { decodeToken, adminAuth, success, fail } = require('./common')(res);
    const { reply } = req.body;
    const token = req.headers['x-access-token'];

    const task = () => new Promise((resolve, reject) => {
        db.query(`UPDATE questions SET reply = ? WHERE id = ?`,[reply, question_id])
        .then(rows => {
            if (rows.affectedRows === 0) {
                reject({
                    code: 404,
                    data: {
                        message: 'Question not found'
                    }
                })
            } else {
                resolve({
                    code: 204
                })
            }
        }).catch(reject)
    })

    decodeToken(token).then(adminAuth).then(task).then(success).catch(fail);
})

router.post('/login', (req, res) => {
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

module.exports = router;