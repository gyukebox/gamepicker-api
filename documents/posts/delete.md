# Update post

**Method** : `DELETE`

**URL** : `/posts/:post_id`

**Auth required** : `True`

**Data constraints** 
```
Headers {
    x-access-token : token from '/auth/login'
}
```

## Success Response

**Code** : `204 No Content`

**Content example**
```
NULL
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