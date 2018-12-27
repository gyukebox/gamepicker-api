# Check favorite

**Method** : `GET`

**URL** : `/games/:game_id/favor`

**Auth required** : `True`

**Data constraints** 
```
NULL
```

## Success Response

**Code** : `200 OK`

**Content example**
```
{
    favor: true
}
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