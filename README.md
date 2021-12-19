# Auoi API

#### 엔드포인트
- 로컬 API 서버: http://127.0.0.1:65000/
- 운영 API 서버: https://apis.shop.auoi.net/

#### API 버전
- v1.0.0

#### 목차
#### 1. 계정
##### 1.1. 내 계정 조회
#### 2. 상품
##### 2.1. 상품 등록
##### 2.2. 상품 목록 조회
##### 2.3. 상품 상세 조회

## 1. 계정
사용자 인증을 거쳐 저장된 정보로, 상품 등 향후 추가될 컨텐츠들에 대한 권한을 가질 수 있습니다.

#### 엔드포인트
상품와 관련된 모든 API는 ```API 서버 (https://apis.shop.auoi.net/)``` 아래에 위치합니다.

### 1.1. 내 계정 조회
로그인 완료 후, 내 계정 정보를 조회할 수 있습니다. 쿠키에 토큰이 저장되어 있을 경우에만 조회할 수 있습니다.

#### 엔드포인트
```/v1.0/account/me```

#### 요청 예
```AUTHORIZATION!: ACCESS_TOKEN```

#### 응답 예
```JSON```
```
{
  "success": true,
  "data": {
    "sid": "hanulse",
    "name": "Cookie"
  },
  "code": 20000,
  "message": null
}
```

## 2. 상품
판매할 상품을 등록하고, 다른 사용자들이 등록한 상품들을 조회할 수 있습니다.

#### 엔드포인트
상품와 관련된 모든 API는 ```API 서버 (https://apis.shop.auoi.net/)``` 아래에 위치합니다.

### 2.1. 상품 등록
상품을 등록할 수 있습니다.

#### 엔드포인트
```/v1.0/product/create```

#### 요청 예
```AUTHORIZATION!: ACCESS_TOKEN```
```JSON```
```
{
  "title": "대추야자",
  "description": "사우디아라비아산 대추야자입니다~",
  "unitPrice": 10000,
  "currency": "krw",
  "availableStock": 30
}
```

#### 응답 예
```JSON```
```
{
  "success": true,
  "data": {
    "id": "000000000000000000000000",
    "code": "P00000000_00000000"
  },
  "code": 20000,
  "message": null
}
```

### 2.2. 상품 목록 조회
상품 목록을 조회할 수 있습니다. ```lastId```에 특정 후기의 아이디를 넣어 요청하면, 해당 후기의 이전의 후기 목록을 조회할 수 있습니다. ```count```는 조회할 최대 개수입니다.

#### 엔드포인트
```/v1.0/product/list```

#### 요청 예
```AUTHORIZATION?: ACCESS_TOKEN```
```JSON```
```
{
  // Optional, Default: null
  "lastId": "000000000000000000000000",
  // Optional, Default: 10, Maximum: 20
  "count": 5
}
```

#### 응답 예
```JSON```
```
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "000000000000000000000000",
        "code": "P00000000_00000000",
        "title": "바나나",
        "unitPrice": 3000,
        "currency": "krw",
        "availableStock": 23,
        "isOwner": false,
        "createdAt": "2021-12-19T12:02:57.614Z"
      },
      // ...
    ]
  },
  "code": 20000,
  "message": null
}
```

### 2.3. 상품 상세 조회
상품 상세 정보를 조회할 수 있습니다.

#### 엔드포인트
```/v1.0/product/detail```

#### 요청 예
```AUTHORIZATION?: ACCESS_TOKEN```
```JSON```
```
{
  "code": "P00000000_00000000"
}
```

#### 응답 예
```JSON```
```
{
  "success": true,
  "data": {
    "id": "000000000000000000000000",
    "code": "P00000000_00000000",
    "title": "바나나",
    "description": "베트남 달랏 고산지대에서 자란 바나나입니다~",
    "unitPrice": 3000,
    "currency": "krw",
    "availableStock": 23,
    "isOwner": false,
    "createdAt": "2021-12-19T12:02:57.614Z"
  },
  "code": 20000,
  "message": null
}
```

## 응답 코드
|코드 번호|코드 이름|설명|
|:-|:-|:-|
|20000|SUCCESS|요청이 성공함|
|40000|NOT_FOUND|요청한 엔드포인트를 찾지 못함|
|50000|ERROR|예상하지 못한 에러|
