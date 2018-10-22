const express = require('express');
const router = express.Router();

const database = require('../model/pool');

const jwt = require('jwt-simple');
const config = require('../config/jwt-config');

const now = () => {
    return new Date().toLocaleString();;
}

router.get('/all', (req, res) => {
    const { id, title } = req.query;
    let sql = `
    SELECT
        id,
        title,
        img_link
    FROM games `
    if (id && title) {
        res.status(400).json({error: `Too many queries (id & title)`})
    } else if (id) {
        sql += `WHERE id = '${id}'`
    } else if (title) {
        sql += `WHERE title = '${title}'`
    }
    database.query(sql)
    .then(rows => res.status(200).json(rows))
    .catch(err => res.status(400).json(err))
})

router.get('/',(req, res) => {
    const { id, title } = req.query;
    let query = `
    SELECT 
        games.id, 
        title, 
        developer,
        publisher, 
        age_rate, 
        summary, 
        img_link, 
        video_link, 
        games.update_date, 
        games.create_date,
        GROUP_CONCAT(DISTINCT(game_platforms.platform)) platforms,
        GROUP_CONCAT(DISTINCT(game_tags.tag)) tags
    FROM games
    LEFT JOIN game_platforms
    ON game_platforms.game_id = games.id
    LEFT JOIN game_tags
    ON game_tags.game_id = games.id `
    if (id && title) {
        return res.status(400).json({error: `Too many queries (id, title)`})
    } else if (title) {
        query += `WHERE title='${title}' GROUP BY games.id`
    } else if (id) {
        query += `WHERE games.id=${id} GROUP BY games.id`
    } else {
        return res.status(400).json({error: `query required (id or title)`})
    }
    database.query(query)
    .then(rows => {
        const game = rows[0];
        
        game.tags = game.tags?game.tags.split(','):[];
        game.platforms = game.platforms?game.platforms.split(','):[];
        
        res.status(200).json(game)
    })
    .catch(err => res.status(400).json(err))
})

//tested
router.post('/',(req, res) => {
    let id;
    const { title, developer, publisher, age_rate, summary, img_link, video_link, tags, platforms } = req.body;
    const query = `INSERT INTO games(title, developer, publisher, age_rate, summary, img_link, video_link, update_date, create_date) VALUES('${title}', '${developer}', '${publisher}', '${age_rate}', '${summary}', '${img_link}', '${video_link}', '${now()}', '${now()}')`
    database.query(query).then(() => {        
        return database.query(`SELECT LAST_INSERT_ID() as last_id`)
    }).then(rows => {
        id = rows[0].last_id;
        let values = '';        
        tags.map(tag =>  values+=`('${id}', '${tag}'),`);
        values = values.slice(0,-1);
        if(tags.length !== 0)
            return database.query(`INSERT INTO game_tags(game_id, tag) VALUES ${values}`)
    }).then(() => {
        let values = '';
        platforms.map(platform => values+=`('${id}', '${platform}'),`);
        values = values.slice(0,-1);
        if(platforms.length !== 0)
            return database.query(`INSERT INTO game_platforms(game_id, platform) VALUES ${values}`)
    }).then(() => {
        res.status(201);
    }).catch(err => {
        res.status(400).json(err);
    });
});

router.delete('/', (req, res) => {
    const { id } = req.body;
    const query = `DELETE FROM games WHERE id='${id}'`;
    database.query(query)
    .then(() => {
        return database.query(`DELETE FROM game_tags WHERE game_id='${id}'`)
    })
    .then(rows => res.status(200))
    .catch(err => res.status(400).json(err))
})

router.get('/recommend',(req, res) => {
    const token = req.headers['x-access-token'];
    //token 으로 개인에 알맞는 게임을 추천하는 알고리즘을 짜야함
    //현재에는 상위 5개의 게임만 보여줌
    const query = `SELECT id, title, img_link FROM games LIMIT 5`;
    database.query(query)
        .then(rows => res.status(200).json(rows))
        .catch(err => res.status(400).json(err))
});

router.put('/',(req, res) => {
    const { id } = req.query;
    const { title, developer, publisher, age_rate, summary, img_link, video_link } = req.body;
    let set_query = `SET `;
    if (!id)    return res.status(400).json({ error: `body.id is required`});
    if (title) set_query += `title='${title}',`
    if (developer) set_query +=`developer='${developer}',`
    if (publisher) set_query +=`publisher='${publisher}',`
    if (age_rate) set_query +=`age_rate='${age_rate}',`
    if (summary) set_query +=`summary='${summary}',`
    if (img_link) set_query +=`img_link='${img_link}',`
    if (video_link) set_query +=`video_link='${video_link}',`
    set_query = set_query.slice(0,-1);    
    database.query(`UPDATE games ${set_query} WHERE id='${id}'`)
    .then(() => res.status(201))
    .catch(err => res.status(400).json(err))
});

router.post('/comments', (req, res) => {
    const token = req.headers['x-access-token'];
    const { id, value } = req.body;
    const user_id = jwt.decode(token, require('../config/jwt-config').jwtSecret).id;

    const sql = `
    INSERT INTO game_comments(user_id, game_id, value) 
    VALUES('${user_id}', ${id}, '${value}')
    `

    database.query(sql)
    .then(() => res.status(201))
    .catch(err => res.status(400).json(err))
})

router.get('/comments/count', (req, res) => {
    const { id } = req.query;
    const query = `
    SELECT COUNT(*) count
    FROM game_comments
    WHERE game_id=(SELECT id FROM games WHERE id='${id}')`
    database.query(query)
    .then(rows => res.status(200).json(rows[0]))
    .catch(err => res.status(400).json(err))
})

router.get('/comments', (req, res) => {
    const { id, offset, limit } = req.query;
    if(!offset) offset = 1;
    if(!limit) length = 10;
    const query = `SELECT c.id, c.value, c.recommend, c.update_date, u.name
    FROM game_comments AS c
    JOIN accounts AS u
    ON c.user_id = u.id
    WHERE c.game_id='${id}'
    ORDER BY c.update_date DESC
    LIMIT ${limit} OFFSET ${offset}`

    database.query(query)
    .then(rows => res.status(200).json(rows))
    .catch(err => res.status(400).json({ success: false, message: err }))
})

router.delete('/comments', (req, res) => {
    const token = req.headers['x-access-token'];
    const { id } = req.body;
    const user_id = jwt.decode(token, config.jwtSecret);

    database.query(`DELETE FROM game_comments WHERE id='${id}' AND user_id='${user_id}'`)
    .then(() => res.status(200).json({ success: true }))
    .catch(err => res.status(400).json({ success: false, message: err }))
})

router.put('/rates', (req, res) => {
    const token = req.headers['x-access-token'];
    const { game_id, value } = req.body;
    const user_id = jwt.decode(token, config.jwtSecret);

    database.unique('accounts', 'user_id', user_id)
    .then(() => {return database.unique('games', 'game_id', game_id)})
    .then(() => {return database.query(`INSERT INTO rates(user_id, game_id, value) VALUES('${user_id}', '${game_id}', '${value}')`)})
    .then(() => res.status(201).json({ success: true }))
    .catch(err => res.status(400).json({ success: false, message: err }))
})

router.get('/rates', (req, res) => {
    const { game_id } = req.query;

    database.query(`SELECT value FROM rates WHERE game_id='${game_id}'`)
    .then(rows => {
        let sum = 0;
        rows.foreach(row => sum += row.value);
        const avg_rate = sum/rows.length;
        res.status(200).json({ success: true, rate: avg_rate })
    })
    .catch(err => res.status(400).json({ success: false, message: err }))
})

module.exports = router;

