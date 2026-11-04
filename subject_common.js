const path = require("path");

const asyncHandler = (handler) => (req, res, next) => {
  Promise.resolve(handler(req, res, next)).catch(next);
};

function validSubject(body) {
  const subject = typeof body.subject === "string" ? body.subject.trim() : "";
  const score = Number(body.score);

  return subject.length > 0 && subject.length <= 100 &&
    typeof body.score === "string" && body.score.trim() !== "" &&
    Number.isInteger(score) && score >= 0 && score <= 100;
}

function setupApp(app) {
  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "views"));
  app.use(require("express").urlencoded({ extended: true }));
  app.get("/", (req, res) => res.redirect("/subjects"));
}

async function startServer(app, db, port, label) {
  app.use((err, req, res, next) => {
    console.error("요청 처리 실패:", err.code || err.message);
    res.status(500).send("데이터베이스 처리 중 오류가 발생했습니다.");
  });

  try {
    await db.execute("SELECT id FROM subject LIMIT 1");
    const server = app.listen(port, () => {
      console.log(`${label} 실행 중: http://localhost:${port}/subjects`);
    });
    server.on("error", async (err) => {
      console.error("서버 시작 실패:", err.code || err.message);
      await db.end();
      process.exitCode = 1;
    });
    const shutdown = () => server.close(async () => db.end());
    process.once("SIGINT", shutdown);
    process.once("SIGTERM", shutdown);
  } catch (err) {
    console.error("DB 연결 실패. db.js 설정과 subject_schema.sql 실행 여부를 확인하세요:", err.code || err.message);
    await db.end();
    process.exitCode = 1;
  }
}

module.exports = { asyncHandler, validSubject, setupApp, startServer };
