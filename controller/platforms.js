const express = require('express');
const router = express.Router();
const db = require('../model/database');

router.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        data: 'test'
    });
});

module.exports = router;