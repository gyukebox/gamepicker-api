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
    "user": {
        "name": "user_a",
        "email": "test",
        "birthday": "1998-01-07T00:00:00.000Z",
        "introduce": null,
        "gender": "M",
        "points": 0,
        "profile": null
    }
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