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
        if(err) res.status(400).json(err);
        else    res.status(201).json({ success: 'game registration complete' });
    });
    conn.end();
})

router.get('/recommend',(req, res) => {
    const conn = mysql.createConnection(dbConfig);
    const query = `SELECT id, title, img_link FROM games LIMIT 5`;
    conn.query('SET NAMES utf8');
    conn.query(query,(err, rows) => {
        if(err) res.json(400, err);
        else    res.json(200, rows);
    });
    conn.end();
});

router.get('/:id',(req, res) => {
    const conn = mysql.createConnection(dbConfig);
    const query =`  SELECT title, developer, publisher, age_rate, summary, img_link, video_link
                    FROM games WHERE id=${req.params.id}`
    conn.query('SET NAMES utf8');
    conn.query(query,(err, rows) => {
        if(err) res.json(400, err);
        else    res.json(200, rows[0]);
    });
    conn.end();
})

router.post('/',(req, res) => {
    const conn = mysql.createConnection(dbConfig);
    conn.query('SET NAMES utf8');
    if(!req.body)
        res.status(412);
    else{
        const { id, title, developer, publisher, age_rate, summary, img_link, video_link } = req.body;
        const query =`  UPDATE games
                        SET title=${title}, developer=${developer}, publisher=${publisher}, age_rate=${age_rate}, summary=${summary} img_link=${img_link}, video_link=${video_link}
                        WHERE id=${id}`;
        conn.query(query, (err, rows) => {
            if(err) res.status(400).json(err);
            else    res.status(201);
        });
    }
});

router.get('/search/:query',(req,res) => {
    const conn = mysql.createConnection(dbConfig);
    const query = `SELECT id, title, img_link FROM games WHERE title LIKE '%${req.params.query}%'`;
    conn.query('SET NAMES utf8');
    conn.query(query,(err, rows) => {
        if(err) res.status(400).json(err);
        else    res.status(200).json(rows);
    });
    conn.end();
})

module.exports = router;