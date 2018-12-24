# View created posts

**Method** : `GET`

**URL** : `/users/:user_id/posts`

**Auth required** : `False`

**Data constraints** 
```
Query {
    limit : Limit the number of data,
    offset : Set start index, required 'limit'
}
```

## Success Response

**Code** : `200`

**Content example**
```
{
    posts : [
        {
            id : 1,
            title : "How to be a great developer"
        },
        {
            id : 2,
            title : "Way to be rich"
        },
        ...
    ]
}
```

## Error Response