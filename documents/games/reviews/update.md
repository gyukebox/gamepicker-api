# Update review (Not implements)

**Method** : `POST`

**URL** : `/games/:game_id/reviews/:review_id`

**Auth required** : `True`

**Data constraints** 
```
Headers {
    x-access-token : Token from '/auth/login'
}

Body {
    value : Plain text for review,
    score : The score of this game by rational number
}
```

## Success Response

**Code** : `204 No Content`

**Content example**
```
NULL
```

## Error Response

**Condition** : Review not found

**Code** : `404 Not Found`

**Content**

```
{
    message: "Review not found" 
}
```

***

**Condition** : Token is required

**Code** : `400 Bad Request`

**Content**

```
{
    message: "Token is required"
}
```

***

**Condition** : Token is invalid

**Code** : `401 Unauthorized`

**Content**

```
{
    message: "Token is invalid"
}
```

***

**Condition** : Game not found

**Code** : `404 Not Found`

**Content**

```
{
    message: "Game not found"
}
```