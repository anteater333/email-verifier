# Que 이메일 인증 & 회원 가입 서버

![que-logo-big](doc/logo-big.png)

## 환경변수

`.env` 파일에 아래 환경 변수를 모두 작성해야 합니다.

```
SMTP_HOST_NAME=
SMTP_PORT=
SMTP_USERNAME=
SMTP_PASSWORD=

MONGO_HOST=
MONGO_PORT=
MONGO_ROOT_USERNAME=
MONGO_ROOT_PASSWORD=
MONGO_USERNAME=
MONGO_PASSWORD=
MONGO_DATABASE=

SERVER_PORT=

FIREBASE_KEY=
FIREBASE_DOMAIN=
FIREBASE_PROJECT=
FIREBASE_STORAGE=
FIREBASE_MESSAGE_SENDER=
FIREBASE_APP_ID=
FIREBASE_MEASUREMENT=

```

## API 목록

### `GET /verification`

인증 메일 전송을 요청합니다.

- 요청 데이터 (Query Parameter 형식)
  - `mail`  
    인증 메일을 받을 메일 주소
- 성공 응답
  - `200` : 인증 메일 전송됨
  - `208` : 이미 인증 과정을 통과함
- 실패 응답
  - `400` : 유효한 메일 주소를 입력하지 않음
  - `409` : 이미 해당 메일로 가입한 사용자가 존재함
  - `429` : 해당 메일 주소로 인증 요청을 너무 자주함

### `POST /verification`

메일로 전달받은 코드를 통해 인증을 요청합니다.

- 요청 데이터 (JSON Body 형식)
  - `mail`  
    인증 시도할 메일 주소
  - `code`
    인증 코드
- 성공 응답
  - `200` : 메일 인증 성공함
- 실패 응답
  - `400` : 유효한 요청 데이터를 입력하지 않음
  - `403` : 틀린 인증 코드
  - `404` : 해당 메일 주소에 대한 인증 정보 없음
  - `408` : 인증 가능 시간 초과함
  - `429` : 해당 메일 주소로 인증 요청을 너무 자주함

### `POST /signup`

인증된 메일에 대해 사용자 계정 생성을 진행합니다.

- 요청 데이터 (JSON Body 형식)
  - `mail`  
    계정 생성할 메일 주소
  - `password`
    계정 비밀번호
- 성공 응답
  - `201` : 계정 생성 성공함
- 실패 응답
  - `400` : 유효한 요청 데이터를 입력하지 않음
  - `403` : 아직 인증 완료되지 않은 메일 주소
  - `404` : 해당 메일 주소에 대한 인증 정보 없음
