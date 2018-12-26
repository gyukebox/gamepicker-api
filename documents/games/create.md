# Write game

**Method** : `POST`

**URL** : `/games/:game_id`

**Auth required** : `True`

**Data constraints** 
```
{
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

***

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