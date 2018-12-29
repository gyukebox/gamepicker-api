# Register profile photo

**Method** : `POST`

**URL** : `/users/:user_id/profile`

**Auth required** : `True`

**Data constraints** 
```
Body {
    file: image file
}
```

## Success Response

**Code** : `204 No Content`

**Content example**
```
NULL
```

## Error Response

**Condition** : Can not find user matching 'user_id'

**Code** : `404 Not Found`

**Content**
```
{
    message: "User not found"
}
```

***

**Condition** : 'user_id' and 'x-access-token' do not match

**Code** : `401 Unauthorized`

**Content**
```
{
    message: "Authentication failed"
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