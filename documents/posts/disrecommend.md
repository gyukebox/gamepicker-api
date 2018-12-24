# Disrecommend post

**Method** : `POST`

**URL** : `/posts/:post_id/disrecommend`

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