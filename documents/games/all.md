# View all games

**Method** : `GET`

**URL** : `/games`

**Auth required** : `False`

**Data constraints** 
```
Query {
    limit : Limit the number of data,
    offset : Set start index, required 'limit'
    sort: {
        random: Loads the game in random order
    }
}
```

## Success Response

**Code** : `200 OK`

**Content example**
```
{
    games: [
        {
            "id": 1,
            "title": "Call of Duty®: WWII",
            "developer": " Sledgehammer Games, Raven Software",
            "publisher": "Activision",
            "updated_at": "2018-10-04T21:39:39.000Z",
            "images": [
                "https://www.callofduty.com/content/dam/atvi/callofduty/wwii/home/Stronghold_Metadata_Image.jpg"
            ],
            "videos": [
                "https://youtu.be/D4Q_XYVescc",
                "test"
            ],
            "tags": [],
            "platforms": [
                "PC",
                "Playstation 4",
                "Xbox One"
            ],
            "rate": null,
            "rate_count": 0
        },
        ...
    ]
}
```

## Error Response
