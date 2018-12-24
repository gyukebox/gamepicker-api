# Update post (Not implements)

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
