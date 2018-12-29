# View game

**Method** : `GET`

**URL** : `/users/:user_id/games/recommends`

**Auth required** : `False`

**Data constraints** 
```
Query {
    tags : Array of tag_id ([30,13,52,76]),
    limit : Limit the number of data
}
```

## Success Response

**Code** : `200 OK`

**Content example**
```
{
    "games": [
        {
            "id": 29,
            "title": "오버워치"
        },
        {
            "id": 63,
            "title": "바람의나라"
        },
        {
            "id": 418,
            "title": "Garry's Mod"
        }
    ]
}
```

## Error Response
```
NULL
```