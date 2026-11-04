# 추가 실습 — 카페 메뉴 CRUD (Node.js + Express + EJS + SQLite)

MySQL 대신 **SQLite**(파일 하나로 동작하는 DB, 별도 설치 불필요)로 카페 메뉴를 관리하는 웹앱을 단계적으로 만든다.
`cafe.db`(테이블 + 예시 데이터)는 **미리 생성되어 있으므로** 바로 시작할 수 있다.

---

## 단계 1 — 프로젝트 준비

```bash
cd week10/cafe_menu
npm install
```

설치되는 것: `express`, `ejs`, `better-sqlite3`(SQLite 드라이버)

## 단계 2 — DB 확인 (이미 생성되어 있음)

`cafe.db`에 menus 테이블과 예시 메뉴 6개가 들어 있다. 내용을 확인해 보자.

```bash
node check_db.js
```

DB를 초기 상태로 되돌리고 싶을 때는 언제든:

```bash
node init_db.js
```

## 단계 3 — 메뉴 목록 표시 (Read)

```bash
node step1_list.js
```

브라우저에서 http://localhost:3000/menus 접속 → 카테고리별 메뉴와 가격이 보이면 성공.
확인 후 `Ctrl + C`로 종료.

- 볼 것: `db.prepare("SELECT ...").all()` 로 조회한 배열을 EJS로 렌더링하는 흐름

## 단계 4 — 메뉴 추가 (Create)

```bash
node step2_create.js
```

http://localhost:3000/menus 상단의 폼으로 새 메뉴(이름·가격·카테고리)를 추가해 본다.

- 볼 것: 폼 POST → `INSERT` → `res.redirect("/menus")` 패턴 (새로고침해도 중복 등록되지 않는 이유)

## 단계 5 — 메뉴 수정 (Update)

```bash
node step3_update.js
```

각 메뉴의 [수정]을 눌러 가격을 바꿔 본다 (예: 아메리카노 4500 → 4800).

- 볼 것: `GET /menus/:id/edit` (수정 폼) 과 `POST /menus/:id/edit` (UPDATE 실행)의 분리

## 단계 6 — 메뉴 삭제 (Delete) : CRUD 완성

```bash
node step4_delete.js
```

[삭제] 버튼으로 메뉴를 지워 본다. 이 파일이 **CRUD가 모두 구현된 완성본**이다.

## 단계 7 — 마무리 확인

```bash
node init_db.js        # DB를 초기 상태로 리셋
node step4_delete.js   # 완성본 실행
```

메뉴 1개 추가 → 가격 수정 → 삭제까지 한 사이클을 직접 수행하고 스크린샷을 남긴다.
완료 후 GitHub에 push (`cafe.db`는 올려도 되지만 `node_modules`는 .gitignore로 제외).

---

## 도전 과제 (선택)

1. 품절 여부 컬럼(`soldout`)을 추가하고 품절 메뉴는 회색으로 표시
2. 카테고리 필터 버튼 (11주차 Todo의 `?filter=` 참고)
3. 가격이 비싼 순 정렬 기능

## MySQL과 무엇이 달랐나 (정리해 볼 것)

| 항목 | MySQL | SQLite |
|---|---|---|
| 설치 | 서버 설치 필요 | 불필요 (파일 하나) |
| 접속 | host/user/password | 파일 경로 |
| 용도 | 서비스 운영 | 학습·소규모·임베디드 |
