const express = require('express');
const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const [tags] = await pool.query(`SELECT id, value FROM tags`);
        res.status(200).json({ tags })
    } catch (err) {
        next(err);
    }
})
module.exports = router;