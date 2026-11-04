const db = require("./db");

async function main() {
  try {
    const [menus] = await db.execute("SELECT * FROM menus ORDER BY category, price");
    console.log(`menus 테이블: 총 ${menus.length}개`);
    console.table(menus);
  } catch (err) {
    console.error("DB 조회 실패:", err.code || err.message);
    process.exitCode = 1;
  } finally {
    await db.end();
  }
}

main();
