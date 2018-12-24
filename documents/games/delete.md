# Update game (Not implements)

**Method** : `DELETE`

**URL** : `/games/:game_id`

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

**Condition** : There is no matching game with 'user_id'

**Code** : `404 Not Found`

**Content**

```
{
    message: "game not found"
}
```