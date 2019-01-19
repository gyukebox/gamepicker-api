const express = require('express');
const router = express.Router();
const jwt = require('../model/jwt');

router.post('/questions', async (req, res, next) => {
    const { title, email, value } = req.body;
    try {
        await pool.query(`INSERT INTO questions (title, email, value) VALUES (?, ?, ?)`,[title, email, value]);
        res.status(204).json();
    } catch (err) {
        next(err);
    }
})

router.get('/questions', async (req, res, next) => {
    try {
        const [questions] = await pool.query(`SELECT id, title, email, value FROM questions WHERE reply IS NULL`);
        res.status(200).json({ questions })
    } catch (err) {
        next(err);
    }
})

router.post('/questions/:question_id/reply', async (req, res, next) => {
    const { question_id } = req.params;
    const { reply } = req.body;
    const token = req.headers['x-access-token'];
    try {
        const { email, password } = jwt.decode(token);
        const [[admin]] = await pool.query(`SELECT 1 FROM admin LEFT JOIN users IN users.id = admin.user_id WHERE email = ? AND password = ?`,[email, password]);
        if (!admin)
            throw { status: 401, message: '관리자 권한이 필요합니다' }
        const [rows] = await pool.query(`UPDATE questions SET reply = ? WHERE id = ?`, [reply, question_id]);
        if (rows.affectedRows === 0)
            throw { status: 404, message: 'Question not found' }
        res.status(204).json()
    } catch (err) {
        next(err);
    }
})

router.get('/notices', async (req, res, next) => {
    const { limit, offset } = req.query;
    let sql = `SELECT id, title, value, created_at FROM notices`;
    const option = [];
    if (limit) {
        sql += ` LIMIT ?`;
        option.push(Number(limit))
        if (offset) {
            sql += ` OFFSET ?`;
            option.push(Number(offset));
        }
    }
    try {
        const [notices] = await pool.query(sql, option);
        res.status(200).json({ notices })
    } catch (err) {
        next(err);
    }
})

router.post('/notices', async (req, res, next) => {
    const token = req.headers['x-access-token'];
    const { title, value } = req.body;
    try {
        const { email, password } = jwt.decode(token);
        const [[admin]] = await pool.query(`SELECT user_id FROM admin LEFT JOIN users ON users.id = admin.user_id WHERE email = ? AND password = ?`,[email, password]);
        if (!admin)
            throw { status: '401', message: '관리자 권한이 필요합니다'}
        await pool.query(`INSERT INTO notices (title, value) VALUES (?, ?)`,[title, value]);
        res.status(204).json()
    } catch (err) {
        next(err);
    }
})

router.delete('/notices/:notice_id', async (req, res, next) => {
    const token = req.headers['x-access-token'];
    const { notice_id } = req.params;
    try {
        const { email, password } = jwt.decode(token);
        const [[admin]] = await pool.query(`SELECT user_id FROM admin LEFT JOIN users ON users.id = admin.user_id WHERE email = ? AND password = ?`,[email, password]);
        if (!admin)
            throw { status: 401, message: '관리자 권한이 필요합니다'}
        const [rows] = await pool.query(`DELETE FROM notices WHERE id = ?`[notice_id]);
        if (rows.affectedRows === 0)
            throw { status: 410, message: '이미 삭제된 공지입니다'}
        res.status(204).json();
    } catch (err) {
        next(err);
    }
})

router.post('/push', async (req, res, next) => {
    const token = req.headers['x-access-token'];
    const { age, gender, login, reserve } = req.body;
    const reg_id = 'duXqz72gRi8:APA91bG6JKCWkBaHjamI7bQhA_NOwUaNfmDkwyT-OFBAi27z349j6aL88zoxYaTD3BSo0iNXCaBLxvy8tDM1yM8KX-yCGiVLXISjk11VeuT7shLZ5ozB7Jnxy9yKyX6ANlMz603yc50a';

    const pushSend = require('./push/create');
    await pushSend('android', reg_id, 'aaa', 'ttt');
    res.status(200).json();
})

module.exports = router;