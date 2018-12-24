# Update info

**Method** : `PUT`

**URL** : `/users/:user_id`

**Auth required** : `True`

**Data constraints** 

```
Headers {
    x-access-token : token from '/auth/login'
}

Body {
    introduce : introduce text
}
```

## Success Response

**Code** : `204 No Content`

**Content example**
```
NULL
```

## Error Response

**Condition** : There is no matching user with 'user_id'

**Code** : `404 Not Found`

**Content**

```
{
    message: "User not found"
}
```