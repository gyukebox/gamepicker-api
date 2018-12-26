# Write comment

**Method** : `POST`

**URL** : `/posts/:post_id/comments`

**Auth required** : `True`

**Data constraints** 
```
Headers {
    x-access-token : Token from '/auth/login'
}

Body {
    parent_id : Option for child comments (only required for child comment),
    value : Plain text for comment
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