const express = require('express');
const router = express.Router();

const mysql = require('mysql');
const dbConfig = require('../config/db-config');

router.put('/',(req, res) => {
    const conn = mysql.createConnection(dbConfig);
    const { title, developer, publisher, age_rate, summary, img_link, video_link } = req.body;
    let id;
    const query = ` INSERT INTO games(title, developer, publisher, age_rate, summary, img_link, video_link, update_date, create_date)
                    VALUES ('${title}', '${developer}', '${publisher}', '${age_rate}', '${summary}', '${img_link}', '${video_link}', '${new Date().toLocaleString()}',' ${new Date().toLocaleString()}')`
    conn.query(query,(err, rows) => {
        if(err) {
            console.log(err);
        } else {
            id = rows.insertId;
            res.send(id);
        }
    });
    conn.end();
})

router.get('/recommend',(req, res) => {
    const conn = mysql.createConnection(dbConfig);
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    const query = `SELECT id, title, img_link FROM games LIMIT 5`;
    conn.query('SET NAMES utf8');
    conn.query(query,(err, rows) => {
        if(err) console.log(err);
        res.send(rows);
    });
    conn.end();
});

router.get('/:id/info',(req, res) => {
    const conn = mysql.createConnection(dbConfig);
    const query =`  SELECT title, developer, publisher, age_rate, summary, img_link, video_link
                    FROM games WHERE id=${req.params.id}`
    conn.query('SET NAMES utf8');
    conn.query(query,(err, rows) => {
        if(err) console.log(err);
        res.send(rows);
    });
    conn.end();
})

router.get('/search/:query',(req,res) => {
    const conn = mysql.createConnection(dbConfig);
    if(!req.params.query) {
        console.log('aa');
        
        res.send([{}]);
    } else {
        const query = `SELECT id, title, img_link FROM games WHERE title LIKE '%${req.params.query}%'`;
        conn.query('SET NAMES utf8');
        conn.query(query,(err, rows) => {
            if(err) console.log(err);
            else    res.send(rows);
        });
    }
    
    conn.end();
})

module.exports = router;