const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const dbConfig = require('../config/db-config');

router.get('/',(req, res) => {
    const conn = mysql.createConnection(dbConfig);
    const query = `SELECT id, value FROM tags`;
    conn.query('SET NAMES utf8');
    conn.query(query, (err, rows) => {
        if(err)     console.log(err);
        else        res.json(rows); 
    });
});
router.put('/:gameID', (req, res) => {
    /*
    const conn = mysql.createConnection(dbConfig);
    
    const query = `INSERT INTO game_platforms(game_id, value) 
                    VALUES (${req.body.gameID}, req.body.game)`;
    conn.query('SET NAMES utf8');
    */
   console.log(req.body.platform_list);
   
})

/*
router.get('/:gameid',(req, res) => {
    const conn = mysql.createConnection(dbConfig);
    const query = `SELECT id, value FROM tags`;
    conn.query('SET NAMES utf8');
    conn.query(query, (err, rows) => {
        if(err)     console.log(err);
        else        res.json(rows); 
    });
});
*/

module.exports = router;