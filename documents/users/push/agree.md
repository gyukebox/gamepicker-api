# Push notification agree

**Method** : `POST`

**URL** : `/users/:user_id/push`

**Auth required** : `False`

**Data constraints** 

```
Body {
    os_type: 'android' or 'ios',
    reg_id: register id from FCM
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