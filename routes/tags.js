const express = require('express');
const router = express.Router();
const database = require('../model/pool');

router.get('/', (req, res) => {
    const { success, error } = require('../model/common')(res)
    const sql = `
    SELECT id, value
    FROM tags`
    database.query(sql).then(success).catch(error)
})

module.exports = router;