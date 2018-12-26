# Update game (Not implements)

**Method** : `PUT`

**URL** : `/games/:game_id`

**Auth required** : `True`

**Data constraints** 

```
Headers {
    x-access-token : token from '/auth/login'
}

Body {
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