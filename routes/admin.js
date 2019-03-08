const express = require('express');
const router = express.Router();
const cert = require('../controller/certification')().admin;

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
    const { sort } = req.query;
    try {
        if (sort === 'answered') {
            const [questions] = await pool.query(`SELECT id, title, email, value, reply FROM questions WHERE reply IS NOT NULL`);
            res.status(200).json({ questions });
        } else {
            const [questions] = await pool.query(`SELECT id, title, email, value FROM questions WHERE reply IS NULL`);
            res.status(200).json({ questions });
        }
    } catch (err) {
        next(err);
    }
})

router.post('/questions/:question_id/reply', async (req, res, next) => {
    const { question_id } = req.params;
    const { reply } = req.body;
    try {
        await cert(req);
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
    const { title, value } = req.body;
    try {
        await cert(req);
        await pool.query(`INSERT INTO notices (title, value) VALUES (?, ?)`,[title, value]);
        res.status(204).json()
    } catch (err) {
        next(err);
    }
})

router.delete('/notices/:notice_id', async (req, res, next) => {
    const { notice_id } = req.params;
    try {
        await cert(req);
        const [rows] = await pool.query(`DELETE FROM notices WHERE id = ?`[notice_id]);
        res.status(204).json();
    } catch (err) {
        next(err);
    }
})

router.post('/push', async (req, res, next) => {
    const { age, gender, lastLogin, reserve } = req.body;
    const { title, content } = req.body;
    const push = require('../controller/push-notification');
    try {
        await cert(req);
        await push(age, lastLogin, gender, reserve, title, content);
        res.status(204).json();
    } catch (err) {
        next(err);
    }
})

module.exports = router;