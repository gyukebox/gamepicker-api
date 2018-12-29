# View info

**Method** : `GET`

**URL** : `/users/:user_id`

**Auth required** : `False`

**Data constraints** 
```
NULL
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
        }
    ]
}
```

## Error Response

**Condition** : There is no matching user with 'user_id'

**Code** : `404 Not Found`

**Content**

```
{
    message: "user not found"
}
```