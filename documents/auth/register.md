# Register

**Method** : `POST`

**URL** : `/auth/register`

**Auth required** : `False`

**Data constraints** 
```
Body {
    email: Vaild email address,
    password : password in plain text,
    name : Unique nickname,
    birthday : Birthday(yyyy-mm-dd),
    gender : Gender(M or F)
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