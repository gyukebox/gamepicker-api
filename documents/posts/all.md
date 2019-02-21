# View all posts

**Method** : `GET`

**URL** : `/posts`

**Auth required** : `False`

**Data constraints** 
```
Query {
    limit : Limit the number of data,
    offset : Set start index, required 'limit',
    game_id : Get posts matching 'game_id',
    "category": {
        "games": "Games posts",
        "free": "Free posts",
        "anonymous": "Anonymous posts"
    }
}
```

## Success Response

**Code** : `200 OK`

**Content example**
```
{
    "posts": [
        {
            "id": 1,
            "title": "post sample",
            "views": 0,
            "value": "test",
            "updated_at": "2018-12-20T14:35:26.000Z",
            "name": "user_a",
            "user_id": 1,
            "game_title": null,
            "game_id": null,
            "recommends": 0,
            "disrecommends": 0
        },
        {
            "id": 3,
            "title": "post sample",
            "views": 0,
            "value": "test",
            "updated_at": "2018-12-20T14:37:18.000Z",
            "name": "user_a",
            "user_id": 1,
            "game_title": null,
            "game_id": null,
            "recommends": 0,
            "disrecommends": 0
        },
        ...
    ]
}
```

## Error Response
