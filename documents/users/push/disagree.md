# Push notification agree

**Method** : `DELETE`

**URL** : `/users/:user_id/push`

**Auth required** : `False`

**Data constraints** 

```
NULL
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