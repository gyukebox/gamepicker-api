const express = require('express');
const router = express.Router();

const Database = require('../model/Database');
const database = new Database();

router.get('/', (req, res) => {
    const json;
    
    const { id } = req.body;
    const query = ` SELECT title, developer, publisher, age_rate, summary, img_link, video_link
                    FROM games WHERE id=${id}`;
    database.query(query)
        .then(rows => {
            json = rows[0];
            return database.query(`SELECT tag_id FROM game_tags WHERE game_id=${id}`);
        })
        .then(rows => {
            const tag_id_list = rows.map(data => {return data.tag_id});
            return database.query(`SELECT value FROM tags WHERE IN ${tag_id_list}`);
        })
        .then(rows => {
            json.tag_list = rows.map(data => {return data.value});
        })
        .then(() => {
            return database.query(`SELECT platform_id FROM game_platform WHERE game_id=${id}`);
        })
        .then(rows => {
            const platform_id_list = rows.map(data => {return data.platform_id});
            return database.query(`SELECT value FROM platforms WHERE IN ${platform_id_list}`);
        })
        .then(rows => {
            json.platform_list = rows.map(data => {return data.value});
        })
        .catch(err => {
            res.status(400).json({error : err});
        })
})

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
//추천 게임 가져오기
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