# View created comments

**Method** : `GET`

**URL** : `/users/:user_id/comments`

**Auth required** : `False`

**Data constraints** 
```
Query {
    limit : Limit the number of data,
    offset : Set start index, required 'limit'
}
```

## Success Response

**Code** : `200 OK`

**Content example**
```
{
    comments: [
        {
            id : 1,
            value : "You have to be diligent"
        },
        {
            id : 2,
            title : "Buy Bitcoin"
        },
        ...
    ]
}
```

## Error Response