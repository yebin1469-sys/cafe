# 카페 메뉴 CRUD — MySQL 버전

`../cafe_menu`의 SQLite 실습을 Express + EJS + MySQL로 옮긴 예제다.
화면과 단계별 기능은 동일하며, `mysql2/promise`의 `async/await`로 DB를 처리한다.

## 1. 프로젝트 준비

Node.js와 실행 중인 MySQL 서버가 필요하다.

```powershell
cd week10/cafe_meu_mysql
npm install
Copy-Item .env.example .env
```

macOS/Linux에서는 `cp .env.example .env`를 사용한다.
`.env`의 `DB_USER`, `DB_PASSWORD`를 본인의 MySQL 계정으로 수정한다.
기본 주소는 `localhost:3306`, DB 이름은 `cafe_menu_mysql`이다.
`.env`는 Git에 포함되지 않는다.

## 2. 데이터베이스 생성

MySQL Workbench 또는 MySQL 클라이언트에서 다음 SQL을 한 번 실행한다.
앱에서 사용할 계정에 해당 DB의 SELECT, INSERT, UPDATE, DELETE 권한이 필요하며,
초기화 스크립트에는 CREATE, DROP 권한도 필요하다.

```sql
CREATE DATABASE IF NOT EXISTS cafe_menu_mysql
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

다른 DB 이름을 사용하면 `.env`의 `DB_NAME`도 맞춘다.
이후 터미널에서 테이블과 예시 메뉴 6개를 생성한다.

```powershell
npm run init
npm run check
```

**주의:** `npm run init`은 설정된 DB의 `menus` 테이블을 삭제하고 다시 만든다.
연습용 DB에서 실행한다. 기존 SQLite 데이터는 자동으로 이전하지 않는다.

## 3. 단계별 실행

각 단계는 하나씩 실행하고, 다음 단계로 넘어가기 전에 `Ctrl+C`로 종료한다.

| 단계 | 명령 | 기능 |
|---|---|---|
| 1 | `npm run step1` | 메뉴 목록 조회 |
| 2 | `npm run step2` | 목록 + 메뉴 추가 |
| 3 | `npm run step3` | 목록 + 추가 + 수정 |
| 4 | `npm start` | 목록 + 추가 + 수정 + 삭제 |

브라우저에서 <http://localhost:3000/menus>에 접속한다.
SQLite 예제와 동시에 실행하려면 `.env`의 `PORT`를 `3001` 등으로 변경한다.

완성본에서 메뉴 추가 → 가격 수정 → 삭제를 수행하고 `npm run check`로 결과를 확인한다.
메뉴 이름은 1~100자, 가격은 0~2,147,483,647의 정수이며 카테고리는 커피/티/디저트 중 하나다.

## SQLite 코드와 비교

```js
// SQLite: 동기 호출
const menus = db.prepare("SELECT * FROM menus").all();

// MySQL: 비동기 호출. 반환값의 첫 번째 항목이 행 배열이다.
const [menus] = await db.execute("SELECT * FROM menus");

// 사용자 입력은 SQL 문자열에 붙이지 않고 ?와 배열로 전달한다.
await db.execute("INSERT INTO menus (name, price, category) VALUES (?, ?, ?)",
  [name, price, category]);
```

| SQLite | MySQL |
|---|---|
| `better-sqlite3`, `cafe.db` 파일 | `mysql2`, 별도 MySQL 서버와 `.env` |
| `INTEGER PRIMARY KEY AUTOINCREMENT` | `INT UNSIGNED AUTO_INCREMENT PRIMARY KEY` |
| `TEXT` | `VARCHAR(100)` 등 길이가 있는 문자열 |
| `datetime('now', 'localtime')` | `CURRENT_TIMESTAMP` (MySQL 세션 시간대 기준) |
| `prepare().all()/get()/run()` | `await execute(SQL, [값...])` |

`db.js`는 연결 풀, `helpers.js`는 입력 검증·비동기 오류 처리·서버 시작/종료를 공유한다.
각 `step*.js` 파일에서 해당 단계의 CRUD 쿼리를 확인할 수 있다.

## 연결 문제 확인

- `ECONNREFUSED`: MySQL 서버 실행 여부와 주소/포트를 확인한다.
- `ER_ACCESS_DENIED_ERROR`: 사용자와 비밀번호, 접속 권한을 확인한다.
- `ER_BAD_DB_ERROR`: 위의 CREATE DATABASE SQL과 `DB_NAME`을 확인한다.
- `ER_NO_SUCH_TABLE`: `npm run init`을 실행한다.
- `EADDRINUSE`: 기존 서버를 종료하거나 `PORT`를 변경한다.
