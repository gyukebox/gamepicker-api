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
    parent_id : Option for child comments,
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

***

**Condition** : Token is required

**Code** : `400 Bad Request`

**Content**

```
{
    message: "Token is required"
}
```

***

**Condition** : Token is invalid

**Code** : `401 Unauthorized`

**Content**

```
{
    message: "Token is invalid"
}
```

***

**Condition** : Post not found

**Code** : `404 Not Found`

**Content**

```
{
    message: "Post not found"
}
```