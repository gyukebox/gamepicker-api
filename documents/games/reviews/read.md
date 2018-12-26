# Read review

**Method** : `GET`

**URL** : `/games/:game_id/reviews`

**Auth required** : `False`

**Data constraints** 
```
NULL
```

## Success Response

**Code** : `200 OK`

**Content example**
```
{
    reviews : [
        {
            id : 1,
            name : "smk0107",
            value : "This game is Terrible",
            score : 0.5
        },
        ...
    ]
}
```

## Error Response