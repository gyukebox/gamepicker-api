# Write questions

**Method** : `POST`

**URL** : `/admin/questions`

**Auth required** : `False`

**Data constraints** 
```
Body {
    title: Title of question,
    email: Email to reply,
    value: Context of question
}
```

## Success Response

**Code** : `204 No Content`

**Content example**
```
NULL
```

## Error Response