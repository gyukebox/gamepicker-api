# Favorites game

**Method** : `POST`

**URL** : `/games/:game_id/favor`

**Auth required** : `True`

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

**Condition** : Already favorites this game

**Code** : `400 Bad Request`

**Content**

```
{
    message: "Already favorites this game"
}
```