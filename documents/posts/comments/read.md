# View comment

**Method** : `GET`

**URL** : `/posts/:post_id/comments`

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
            value : "This post is Terrible",
            updated_at: "2018-10-04T21:39:39.000Z",
            recommends: 2,
            disrecommends: 0,
            comments : [
                {
                    id : 4,
                    name : "smk0109",
                    value : "Haaaaaaa",
                    updated_at: "2018-10-04T21:39:39.000Z",
                    recommends: 0,
                    disrecommends: 1,
                },
                ...
            ]
        },
        ...
    ]
}
```

## Error Response