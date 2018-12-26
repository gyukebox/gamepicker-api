# Write review

**Method** : `POST`

**URL** : `/games/:game_id/reviews`

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

**Condition** : Already write review this game

**Code** : `400 Bad Request`

**Content**

```
{
    message: "Already write review this game" 
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