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
        },
        ...
    ]
}
```

## Error Response

**Condition** : Post not found

**Code** : `404 Not Found`

**Content**

```
{
    message: "Post not found"
}
```
