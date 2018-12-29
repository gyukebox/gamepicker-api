# View all posts

**Method** : `GET`

**URL** : `/posts`

**Auth required** : `False`

**Data constraints** 
```
Query {
    limit : Limit the number of data,
    offset : Set start index, required 'limit',
    game_id : Get posts matching 'game_id'
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
            "name": "user_a",
            "views": 0,
            "value": "test",
            "updated_at": "2018-12-20T23:35:26.000Z",
            "disrecommends": 0,
            "recommends": 0
        },
        {
            "id": 3,
            "title": "post sample",
            "name": "user_a",
            "views": 0,
            "value": "test",
            "updated_at": "2018-12-20T23:37:18.000Z",
            "disrecommends": 0,
            "recommends": 0
        },
        ...
    ]
}
```

## Error Response
