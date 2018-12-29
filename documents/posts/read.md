# View post

**Method** : `GET`

**URL** : `/posts/:post_id`

**Auth required** : `False`

**Data constraints** 
```
NULL
```

## Success Response

**Code** : `200 OK`

**Content example**
```
{
    "post": {
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
    }
}
```

## Error Response

**Condition** : There is no matching post with 'post_id'

**Code** : `404 Not Found`

**Content**

```
{
    message: "Post not found"
}
```