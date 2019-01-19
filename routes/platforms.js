const express = require('express');
const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const [platforms] = await pool.query(`SELECT id, value FROM platforms`);
        res.status(200).json({ platforms })
    } catch (err) {
        next(err);
    }
});

module.exports = router;