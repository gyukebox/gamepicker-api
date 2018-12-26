# View all posts

**Method** : `GET`

**URL** : `/posts`

**Auth required** : `False`

**Data constraints** 
```
Query {
    limit : Limit the number of data,
    offset : Set start index, required 'limit'
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
            "updated_at": "2018-12-20T23:35:26.000Z",
            "comment_count": 5
        },
        {
            "id": 3,
            "title": "post sample",
            "name": "user_a",
            "views": 0,
            "updated_at": "2018-12-20T23:37:18.000Z",
            "comment_count": 1
        }
    ]
}
```

## Error Response
