# View info

**Method** : `GET`

**URL** : `/users/:user_id`

**Auth required** : `False`

**Data constraints** 
```
NULL
```

## Success Response

**Code** : `200`

**Content example**
```
{
    user : {
        name : "smk0107",
        email : "ansrl0107@gmail.com",
        introduce: "dsada",
        birthday : "1998-01-07",
        gender : "M",
        points : 57321
    }
}
```

## Error Response

**Condition** : There is no matching user with 'user_id'

**Code** : `404 Not Found`

**Content**

```
{
    message: "user not found"
}
```