# View game

**Method** : `GET`

**URL** : `/games/:game_id`

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
    "game": {
        "id": 1,
        "title": "Call of Duty®: WWII",
        "developer": " Sledgehammer Games, Raven Software",
        "publisher": "Activision",
        "updated_at": "2018-10-04T21:39:39.000Z",
        "summary": "Call of Duty® : 제 2 차 세계 대전은 캠페인, 멀티 플레이 및 협동 조합의 세 가지 게임 모드에서 새로운 경험을 할 수 있습니다.  놀라운 시각 효과가 특징 인 이 캠페인은 2차세계 대전의 역사속으로 여러분을 이동시킵니다. 멀티 플레이어는 부츠 온 콜 오브 듀티 (Call of Duty) 게임 플레이에 원래의 복귀를 표시합니다.  전통적인 총기 및 총기 부착물로 2 차 세계 대전을 주제로 한 다양한 장소에 흠뻑 빠져들 수 있습니다. Co-Operative 모드는 예상치 못한 아드레날린 펌핑 순간으로 가득 찬 독립 실행 형 게임 경험에서 새롭고 독창적 인 이야기를 펼칩니다.",
        "age_rate": "청소년이용불가",
        "images": [
            "https://www.callofduty.com/content/dam/atvi/callofduty/wwii/home/Stronghold_Metadata_Image.jpg"
        ],
        "videos": [
            "https://www.youtube.com/embed/embed",
            "https://www.youtube.com/embed/embed"
        ],
        "tags": [
            "1인칭",
            "고어",
            "공포",
            "대규모멀티플레이어",
            "멀티플레이",
            "심리적",
            "싱글플레이어",
            "역사",
            "전쟁",
            "콘솔",
            "협동",
            "협동캠페인",
            "FPS"
        ],
        "platforms": [
            "PC",
            "Playstation 4",
            "Xbox One"
        ],
        "score": 3.5,
        "score_count": 1,
        "features": {
            "BGM": 4,
            "DLC": 2,
            "가격": 4,
            "버그": 4,
            "게임성": 4,
            "공포성": 2,
            "그래픽": 5,
            "난이도": 2,
            "몰입도": 4,
            "스토리": 3,
            "조작성": 3,
            "과금유도": 1,
            "노가다성": 1,
            "진입장벽": 1,
            "필요성능": 5,
            "플레이타임": 3
        }
    }
}
```

## Error Response

**Condition** : There is no matching game with 'game_id'

**Code** : `404 Not Found`

**Content**

```
{
    message: "Game not found"
}
```