const express = require('express');
const router = express.Router();

const Database = require('../model/Database');
const database = new Database();

//FIXME: 이거
router.get('/', (req, res) => {
    let json;
    const id = req.query.id;
    const query = ` SELECT title, developer, publisher, age_rate, summary, img_link, video_link
                    FROM games WHERE id=${id}`;
    database.query(query)
        .then(rows => {
            json = rows[0];            
            return database.query(`SELECT tag_id FROM game_tags WHERE game_id=${id}`);
        })
        .then(rows => {
            const tag_id_list = rows.map(data => {return data.tag_id});
            return database.query(`SELECT value FROM tags WHERE id IN (${tag_id_list.toString()})`);
        })
        .then(rows => {
            json.tag_list = rows.map(data => {return data.value});
        })
        .then(() => {
            return database.query(`SELECT platform_id FROM game_platforms WHERE game_id=${id}`);
        })
        .then(rows => {
            const platform_id_list = rows.map(data => {return data.platform_id});
            
            return database.query(`SELECT value FROM platforms WHERE IN ${platform_id_list.toString()}`);
        })
        .then(rows => {
            json.platform_list = rows.map(data => {return data.value});
            
            res.status(201).json(json);
        })
        .catch(err => {
            res.status(400).json({error : err});
        })
})

router.put('/',(req, res) => {
    let id;
    const { title, developer, publisher, age_rate, summary, img_link, video_link, tag_list, platform_list } = req.body;
    const query = ` INSERT INTO games(title, developer, publisher, age_rate, summary, img_link, video_link)
                    VALUES ('${title}', '${developer}', '${publisher}', '${age_rate}', '${summary}', '${img_link}', '${video_link}')`
    database.query(query).then(() => {
        return database.query(`SELECT LAST_INSERT_ID() as last_id`)
    }).then(rows => {
        id = rows[0].last_id;
        let values = '';
        tag_list.map(data => {
            values+=`('${id}', '${data}'),`; 
        });
        values = values.slice(0,-1);
        return database.query(`INSERT INTO game_tags(game_id, tag_id) VALUES ${values}`)
    }).then(() => {
        let values = '';
        platform_list.map(data => {
            values+=`('${id}', '${data}'),`; 
        });
        values = values.slice(0,-1);
        return database.query(`INSERT INTO game_platforms(game_id, platform_id) VALUES ${values}`)
    }).then(() => {
        res.status(201).json({ success: 'game registration complete' });
    }).catch(err => {
        res.status(400).json(err);
    });
});
//추천 게임 가져오기
router.get('/recommend',(req, res) => {
    const query = `SELECT id, title, img_link FROM games LIMIT 5`;
    database.query(query)
        .then(rows => res.status(200).json(rows))
        .catch(err => res.status(400).json(err))
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
    database.query(`SELECT id, title, img_link FROM games WHERE title LIKE '%${req.params.query}%'`)
        .then(rows => res.status(200).json(rows))
        .catch(err => res.status(400).json(err))
})

module.exports = router;