# Write game (Not implements)

**Method** : `POST`

**URL** : `/games/:game_id`

**Auth required** : `True`

**Data constraints** 
```
{
    id: 1,
    title: "Call of Duty®: WWII",
    developer: " Sledgehammer Games, Raven Software",
    publisher: "Activision",
    images: [
        "https://www.callofduty.com/content/dam/atvi/callofduty/wwii/home/Stronghold_Metadata_Image.jpg"
    ],
    videos: [
        "https://youtu.be/D4Q_XYVescc"
    ],
    tags: [],
    platforms: [
        "PC",
        "Playstation 4",
        "Xbox One"
    ]
}
```

## Success Response

**Code** : `204 No Content`

**Content example**
```
NULL
```

## Error Response

**Condition** : Body('title', 'developer', ... ) is required

**Code** : `400 Bad Request`

**Content**

```
{
    message: "[key] is required" or "At least one [key] is required"
}
```