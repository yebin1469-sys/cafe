# 10주차 — MySQL 기초와 연동

데이터를 파일이 아닌 데이터베이스에 저장하고, Express에서 읽어 온다.

## 실습 1. MySQL 설치와 접속
1. https://dev.mysql.com/downloads/ 에서 MySQL Community Server를 설치한다 (root 비밀번호를 기억할 것).
2. MySQL Workbench 또는 터미널로 접속한다.
```bash
mysql -u root -p
```

## 실습 2. 데이터베이스와 테이블 생성
`lab2_schema.sql`의 내용을 실행한다.

## 실습 3. SQL로 CRUD 연습
`lab3_crud.sql`의 문장을 한 줄씩 실행하며 결과를 확인한다.

## 실습 4~5. Express에서 DB 연동 (최종 제출물)
```bash
cd week10
npm install
# db.js에서 본인의 MySQL 비밀번호로 수정할 것!
node app.js        # → http://localhost:3000/todos
```

| 파일 | 역할 |
|---|---|
| `lab2_schema.sql` | DB·테이블 생성 |
| `lab3_crud.sql` | INSERT/SELECT/UPDATE/DELETE 연습 |
| `db.js` | mysql2 연결 설정 (실습 4) |
| `app.js` | 조회 결과를 EJS로 출력 (실습 5) |
| `views/todos.ejs` | 할 일 목록 화면 |

## 추가 실습 — subject 성적 CRUD (EJS + MySQL)

`subject_schema.sql`을 실행하면 다음 구조의 테이블이 생성된다.

```sql
subject(id INT AUTO_INCREMENT, subject VARCHAR(100), score INT)
```

`db.js`의 MySQL 비밀번호를 설정한 뒤, 아래 파일을 단계별로 실행한다.

| 명령 | 기능 |
|---|---|
| `npm run subject:select` | 성적 조회 (`subject_select.js`) |
| `npm run subject:insert` | 성적 추가 (`subject_ins.js`) |
| `npm run subject:edit` | 성적 수정 (`subject_edit.js`) |
| `npm run subject:delete` 또는 `npm run subject:crud` | 성적 삭제까지 포함한 전체 CRUD (`subject_del.js`) |

브라우저 주소는 <http://localhost:3000/subjects>이다. 각 단계는 하나씩 실행하고, 다음 단계로 넘어갈 때 `Ctrl+C`로 종료한다.

## 추가 실습 — 카페 메뉴 CRUD (실습 6, SQLite)

`cafe_menu/` 폴더에서 진행한다. MySQL 설치 없이 **SQLite**로 카페 메뉴 목록 표시와
CRUD를 단계 1~7로 실습한다. DB(`cafe.db`)와 테이블은 미리 생성되어 있다.
자세한 단계별 명령어는 `cafe_menu/README.md` 참조.

```bash
cd cafe_menu
npm install
node step1_list.js   # 단계별로 step2, step3, step4 순서로 실행
```
