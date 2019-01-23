# Login

**Method** : `POST`

**URL** : `/auth/login`

**Auth required** : `False`

**Data constraints** 
```
{
    email: Vaild email address,
    password : password in plain text
}
```

## Success Response

**Code** : `200 OK`

**Content example**
```
{
    user_id: 1,
    token: "93144b288eb1fdccbe46d6fc0f241a51766ecd3d"
}
```

## Error Response

**Condition** : If 'email' is invalid.

**Code** : `404 NOT FOUND`

**Content**

```
{
    message: "User not found"
}
```

***

**Condition** : If 'password' is invalid.

**Code** : `400 Bad Request`

**Content**
```
{
    message: "Incorrect password"
}
```

***

**Condition** : When mail authentication is not completed

**Code** : `401 Unauthorized`

**Content**
```
{
    message: "Mail authentication required"
}
```