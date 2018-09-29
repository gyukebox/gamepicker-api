const express = require('express');
const router = express.Router();

const Database = require('../model/Database');
const database = new Database();

router.get('/', (req, res) => {
    const { search, id } = req.query;
    let query = `SELECT title, developer, publisher, age_rate, summary, img_link, video_link FROM games `;
    if (search && id)   return res.status(400).json({ success:false, message: 'too many queries' });
    if (search) {
        database.query(query + `WHERE title LIKE '%${search}%'`)
            .then(rows => res.status(200).json({ success:true, games: rows }))
            .catch(err => res.status(400).json({ success: false, message: err }))
        return;
    }
    if (id) {
        var json = [];
        database.query(query + `WHERE id=${id}`)
        .then(rows => {
            json = rows[0];            
            return database.query(`SELECT tag_id FROM game_tags WHERE game_id=${id}`);
        })
        .then(rows => {
            const tag_id_list = rows.map(data => {return data.tag_id});
            let ret = [];
            if(tag_id_list.length > 0)
                ret =  database.query(`SELECT value FROM tags WHERE id IN (${tag_id_list.toString()})`);
            return ret;
        })
        .then(rows => {
            json.tags = rows.map(data => {return data.value});  ;
        })
        .then(() => {
            return database.query(`SELECT platform_id FROM game_platforms WHERE game_id=${id}`);
        })
        .then(rows => {
            const platform_id_list = rows.map(data => {return data.platform_id});
            let ret = [];
            if (platform_id_list > 0)
                ret =  database.query(`SELECT value FROM platforms WHERE IN ${platform_id_list.toString()}`);
            return ret;
        })
        .then(rows => {
            json.platforms = rows.map(data => {return data.value});
            res.status(201).json({ success: true, games: json });
        })
        .catch(err => {
            res.status(400).json({ success: false, message: err });
        })
        return;
    }
    database.query(query)
        .then(rows => res.status(200).json({ success:true, games: rows }))
        .catch(err => res.status(400).json({ success: false, message: err }))
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
        res.status(201).json({ success: true });
    }).catch(err => {
        res.status(400).json({ success: false, message: err });
    });
});
//추천 게임 가져오기
router.get('/recommend',(req, res) => {
    const token = req.headers['x-access-token'];
    const query = `SELECT id, title, img_link FROM games LIMIT 5`;
    database.query(query)
        .then(rows => res.status(200).json(rows))
        .catch(err => res.status(400).json(err))
});

router.post('/',(req, res) => {
    const { id, title, developer, publisher, age_rate, summary, img_link, video_link } = req.body;
    let set_query = `SET `;
    if (!id)    return res.status(400).json({ success: false, message: `body.id is required`});
    if (title) set_query += `title=${title},`
    if (developer) set_query +=`developer=${developer},`
    if (publisher) set_query +=`publisher=${publisher},`
    if (age_rate) set_query +=`age_rate=${age_rate},`
    if (summary) set_query +=`summary=${summary},`
    if (img_link) set_query +=`img_link=${img_link},`
    if (video_link) set_query +=`video_link=${video_link},`
    set_query.slice(0,-1);
    database.query(`UPDATE games ${set_query} WHERE id=${id}`)
    .then(() => res.status(201).json({ success: true }))
    .catch(err => res.status(400).json({ success: false, message: err }))
});

module.exports = router;