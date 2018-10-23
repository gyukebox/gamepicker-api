const express = require('express');
const router = express.Router();
const database = require('../../model/pool');

router.get('/', (req, res) => {
    const { success, error } = require('../../model/common')(res)
    const sql = `
    SELECT id, value
    FROM tags`
    database.query(sql).then(success).catch(error)
})

router.post('/', (req, res) => {
    const { validate, success, error } = require('../../model/common')(res)
    const { value } = req.body;
    const payload = {
        body: ['value'],
    }    
    const query = () => {
        const sql = `
        INSERT INTO tags(value)
        VALUES ('${value}')`;
        return database.query(sql)
    }
    validate(req, payload).then(query).then(success).catch(error);
})

module.exports = router;