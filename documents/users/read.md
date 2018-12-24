# Login

**Method** : `GET`

**URL** : `/users/:user_id`

**Auth required** : `False`

## Success Response

**Code** : `204`

**Content example**
```
{
    name : "smk0107",
    email : "ansrl0107@gmail.com",
    birthday : "1998-01-07",
    gender : "M",
    points : 57321
}
```

## Error Response

**Condition** : Email or name duplicates

**Code** : `404 Not Found`

**Content**

```
{
    message: "user not found"
}
```