// Express 4는 비동기 함수의 오류를 자동 전달하지 않으므로 감싼다.
const asyncHandler = (handler) => (req, res, next) => {
  Promise.resolve(handler(req, res, next)).catch(next);
};

function validMenu(body) {
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const price = Number(body.price);
  return name.length > 0 && name.length <= 100 &&
    typeof body.price === "string" && body.price.trim() !== "" &&
    Number.isInteger(price) && price >= 0 && price <= 2147483647 &&
    ["커피", "티", "디저트"].includes(body.category);
}

async function startServer(app, db, port) {
  app.use((err, req, res, next) => {
    console.error("요청 처리 실패:", err.code || err.message);
    res.status(500).send("데이터베이스 처리 중 오류가 발생했습니다. 서버 로그를 확인하세요.");
  });
  try {
    await db.execute("SELECT id FROM menus LIMIT 1");
    const server = app.listen(port, () => {
      console.log(`카페 메뉴(MySQL) 서버 실행 중: http://localhost:${port}/menus`);
    });
    server.on("error", async (err) => {
      console.error("서버 시작 실패:", err.code || err.message);
      await db.end();
      process.exitCode = 1;
    });
    const shutdown = () => server.close(async () => { await db.end(); });
    process.once("SIGINT", shutdown);
    process.once("SIGTERM", shutdown);
  } catch (err) {
    console.error("DB 연결 실패. .env 설정과 npm run init 실행 여부를 확인하세요:", err.code || err.message);
    await db.end();
    process.exitCode = 1;
  }
}

module.exports = { asyncHandler, validMenu, startServer };
