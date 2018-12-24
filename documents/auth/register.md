# Login

**Method** : `POST`

**URL** : `/auth/register`

**Auth required** : `False`

**Data constraints** 
```
{
    email: Vaild email address,
    password : password in plain text,
    name : Unique nickname
}
```

## Success Response

**Code** : `204 NO CONTENT`

## Error Response

**Condition** : Email or name duplicates

**Code** : `400 Bad Request`

**Content**

```
{
    message: "Duplicate entry [value] for key [key]"
}
```
***

**Condition** : Failed to send authentication mail

**Code** : `500 Internal Server Error`

**Content**

```
{
    message: "Failed to send authentication mail. Please contact the developer" 
}
```