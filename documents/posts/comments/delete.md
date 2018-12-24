# Delete comment

**Method** : `DELETE`

**URL** : `/posts/:post_id/comments/:comment_id`

**Auth required** : `True`

**Data constraints** 
```
Headers {
    x-access-token : Token from '/auth/login'
}
```

## Success Response

**Code** : `204 No Content`

**Content example**
```
NULL
```

## Error Response

**Condition** : Comment not found

**Code** : `404 Not Found`

**Content**

```
{
    message: "Comment not found" 
}
```

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