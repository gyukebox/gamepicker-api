# View created posts

**Method** : `GET`

**URL** : `/users/:user_id/posts`

**Auth required** : `False`

**Data constraints** 
```
Query {
    limit : Limit the number of data,
    offset : Set start index, required 'limit'
}
```

## Success Response

**Code** : `200`

**Content example**
```
{
    "posts": [
    {
        "id": 1,
        "title": "post sample",
        "game_title": null,
        "game_id": null,
        "updated_at": "2018-12-20T14:35:26.000Z",
        "comment_count": 12
    },
    {
        "id": 3,
        "title": "post sample",
        "game_title": null,
        "game_id": null,
        "updated_at": "2018-12-20T14:37:18.000Z",
        "comment_count": 0
        }
    ]
}
```

## Error Response