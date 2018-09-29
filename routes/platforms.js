const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const dbConfig = require('../config/db-config');

const DATABASE = require('../model/Database');
const database = DATABASE();

router.get('/',(req, res) => {
    const conn = mysql.createConnection(dbConfig);
    const query = `SELECT id, value FROM platforms`;
    conn.query('SET NAMES utf8');
    conn.query(query, (err, rows) => {
        if(err)     res.status(400).json({ error: 'DATABASE error '});
        else        res.status(200).json(rows); 
    });
});

router.put('/', (req, res) => {
    const { value } = req.body;
    database.query(`INSERT INTO platforms (value) VALUES (${value})`)
    .then(() => res.status(201).json({ success: true }))
    .catch(err => res.status(400).json({ success: false, message: false }))
})

module.exports = router;