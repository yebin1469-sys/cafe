// 실행: npm run init — menus 테이블의 기존 데이터를 모두 지우고 초기화한다.
const db = require("./db");

async function main() {
  try {
    await db.execute("DROP TABLE IF EXISTS menus");
    await db.execute(`
      CREATE TABLE menus (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        price INT UNSIGNED NOT NULL,
        category VARCHAR(20) NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    const seed = [
      ["아메리카노", 4500, "커피"],
      ["카페라떼", 5000, "커피"],
      ["바닐라라떼", 5500, "커피"],
      ["얼그레이 티", 4800, "티"],
      ["치즈케이크", 6500, "디저트"],
      ["크루아상", 4000, "디저트"],
    ];
    for (const menu of seed) {
      await db.execute("INSERT INTO menus (name, price, category) VALUES (?, ?, ?)", menu);
    }
    console.log("MySQL 초기화 완료 — menus 테이블에 예시 메뉴 6개를 넣었습니다.");
  } catch (err) {
    console.error("DB 초기화 실패:", err.code || err.message);
    process.exitCode = 1;
  } finally {
    await db.end();
  }
}

main();
