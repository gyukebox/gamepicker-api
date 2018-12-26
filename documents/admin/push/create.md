# Push notification (Not implemented)

**Method** : `POST`

**URL** : `/admin/push`

**Auth required** : `True`

**Data constraints** 
```
Body {
    age: Target age group,
    gender: Target gender,
    lastLogin: A positive number means that you are logged in after the base date, and a negative number means that you are logged in before the base date (base date = Today's date - n),
    reservation: Date to send push notificaion (NULL == send push notificatoin right away),
    message: Message to push notification
}
```

## Success Response

**Code** : `204 No Content`

**Content example**
```
NULL
```

## Error Response

**Condition** : Log in successfully, but you need administrator privileges

**Code** : `401 Unauthorized`

**Content**
```
{
    message: "Administrator authentication required"
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