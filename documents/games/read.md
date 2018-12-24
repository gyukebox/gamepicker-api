# Login

**Method** : `GET`

**URL** : `/games/:game_id`

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
    game: {
        "id": 1,
        "title": "Call of Duty®: WWII",
        "developer": " Sledgehammer Games, Raven Software",
        "publisher": "Activision",
        "updated_at": "2018-10-04T21:39:39.000Z",
        "images": [
            "https://www.callofduty.com/content/dam/atvi/callofduty/wwii/home/Stronghold_Metadata_Image.jpg"
        ],
        "videos": [
            "https://youtu.be/D4Q_XYVescc"
        ],
        "tags": [],
        "platforms": [
            "PC",
            "Playstation 4",
            "Xbox One"
        ],
        "rate": null,
        "rate_count": 0
    }
}
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