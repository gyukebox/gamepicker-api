# Get all questions

**Method** : `GET`

**URL** : `/admin/questions`

**Auth required** : `True`

**Data constraints** 
```
Query {
    limit : Limit the number of data,
    offset : Set start index, required 'limit'
}
```

## Success Response

**Code** : `200 No Content`

**Content example**
```
{
    questions: [
        {
            id: 1,
            title: "How do I ask?",
            value: "I want to contact",
            reply: "Please send an email to gamepicker.inc@gmail.com"
        },
        ...
    ]
}
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