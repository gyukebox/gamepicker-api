const express = require('express');
const router = express.Router();

const mysql = require('mysql');
const dbConfig = require('../config/db-config');

router.get('/recommend',(req, res) => {
    const conn = mysql.createConnection(dbConfig);
    conn.query(`SELECT sequence, gameName, imgLink FROM games LIMIT 0,5`,(err, rows) => {
        if(err) console.log(err);
        res.send(rows);
    });
    conn.end();
});

router.get('/:id/info',(req, res) => {
    const conn = mysql.createConnection(dbConfig);
    conn.query(`SELECT * FROM games WHERE sequence=${req.params.id}`,(err, rows) => {
        if(err) console.log(err);
        res.send(rows);
    });
    conn.end();
})

module.exports = router;