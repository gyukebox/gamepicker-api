# View all users

**Method** : `GET`

**URL** : `/users`

**Auth required** : `False`

**Data constraints** 
```
Query {
    name: Options to find a user by name,
    email: Options to find a user by email
}
```

## Success Response

**Code** : `200 OK`

**Content example**
```
{
    "users": [
        {
            "id": 1,
            "email": "test",
            "name": "user_a"
        },
        {
            "id": 89,
            "email": "denkybrain@gmail.com",
            "name": "홍두깨"
        },
        {
            "id": 90,
            "email": "lastdebugging@gmail.com",
            "name": "게이입니다."
        },
        {
            "id": 91,
            "email": "adww",
            "name": "김재경"
        },
        {
            "id": 95,
            "email": "rndrjs123@naver.com",
            "name": "남궁건"
        },
        {
            "id": 97,
            "email": "ansrl0107@gmail.com",
            "name": "smk0107"
        },
        {
            "id": 98,
            "email": "bullsfrog3@naver.com",
            "name": "smk0107_2"
        },
        {
            "id": 99,
            "email": "sawdonnie@icloud.co",
            "name": "최성묵"
        },
        {
            "id": 101,
            "email": "gamepicker.inc@gmail.com",
            "name": "개임힉"
        },
        {
            "id": 115,
            "email": "denkybrain@naver.com",
            "name": "아무개"
        },
        {
            "id": 119,
            "email": "wjddnleo@daum.net",
            "name": "김다음"
        },
        {
            "id": 121,
            "email": "totoggg@naver.com",
            "name": "상지훈"
        },
        {
            "id": 123,
            "email": "cookingsoo@naver.com",
            "name": "임지수"
        }
    ]
}
```

## Error Response
