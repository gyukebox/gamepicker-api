# Write post

**Method** : `POST`

**URL** : `/posts`

**Auth required** : `True`

**Data constraints** 
```
"header": {
    "x-access-token": "Token from '/auth/login'"
},
"body": {
    "title": "Title of post",
    "value": "Value of post",
    "game_id": "Game of post(optional)",
    "category_id": {
        1: "games",
        2: "free",
        3: "anonymous"
    }
}
```

## Success Response

**Code** : `204 No Content`

**Content example**
```
NULL
```

## Error Response

**Condition** : 'x-access-token' is not included in the header

**Code** : `400 Bad Request`

**Content**
```
{
    message: "Token is required"
}
```

***

**Condition** : 'x-access-token' is included, but can not be decoded

**Code** : `400 Bad Request`

**Content**
```
{
    message: "Token is invalid"
}
```

***

**Condition** : Can not find user matching token. It may be an old token.

**Code** : `404 Not Found`

**Content**
```
{
    message: 'User not found'
}
```