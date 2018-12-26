# Update post

**Method** : `PUT`

**URL** : `/posts/:post_id`

**Auth required** : `True`

**Data constraints** 

```
Headers {
    x-access-token : token from '/auth/login'
}

Body {
    title : Title of post (optional),
    value : Value of post (optional)
}
```

## Success Response

**Code** : `204 No Content`

**Content example**
```
NULL
```

## Error Response

**Condition** : Title and value is not included

**Code** : `400 Bad Request`

**Content example**
```
{
    message: "Either title or value is required"
}
```

***

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