// 과목 등록
// 실행: node sample_post1.js
const { db, createApp, asyncHandler, integer, subjectName, start } = require("./sample_common");
const app = createApp();

app.get("/", asyncHandler(async (req, res) => {
  const [subjects] = await db.execute("SELECT id, menu, price FROM cafe ORDER BY id DESC");
  res.render("list", { subjects });
}));

app.get("/insert", asyncHandler(async (req, res) => {
  const [subjects] = await db.execute("SELECT id, menu, price FROM cafe ORDER BY id DESC");
  res.render("insert", { subjects });
}));
app.post("/insert", asyncHandler(async (req, res) => {
  const subject = subjectName(req.body.subject);
  const score = integer(req.body.score);
  if (!subject || [...subject].length > 100 || score === null || score < -2147483648 || score > 2147483647) {
    return res.status(400).render("sample_error", { message: "입력값 또는 대상 ID를 확인하세요." });
  }
  await db.execute("INSERT INTO cafe (menu, price) VALUES (?, ?)", [subject, score]);
  // POST ?? ? GET?? ???? ????? ?? ?? ??? ????.
  res.redirect(303, "/");
}));

app.get("/update", asyncHandler(async (req, res) => {
  const [subjects] = await db.execute("SELECT id, menu, price FROM cafe ORDER BY id DESC");
  res.render("update", { subjects });
}));
app.post("/update", asyncHandler(async (req, res) => {
  const id = integer(req.body.id);
  const subject = subjectName(req.body.subject);
  const score = integer(req.body.score);
  if (id === null || id <= 0 || !subject || [...subject].length > 100 || score === null || score < -2147483648 || score > 2147483647) {
    return res.status(400).render("sample_error", { message: "입력값 또는 대상 ID를 확인하세요." });
  }
  const [result] = await db.execute("UPDATE cafe SET menu = ?, price = ? WHERE id = ?", [subject, score, id]);
  if (result.affectedRows === 0) return res.status(404).render("sample_error", { message: "입력값 또는 대상 ID를 확인하세요." });
  // POST ?? ? GET?? ???? ????? ?? ?? ??? ????.
  res.redirect(303, "/update");
}));

app.get("/delete", asyncHandler(async (req, res) => {
  const [subjects] = await db.execute("SELECT id, menu, price FROM cafe ORDER BY id DESC");
  res.render("delete", { subjects });
}));
app.post("/delete", asyncHandler(async (req, res) => {
  const id = integer(req.body.id);
  if (id === null || id <= 0) {
    return res.status(400).render("sample_error", { message: "입력값 또는 대상 ID를 확인하세요." });
  }
  const [result] = await db.execute("DELETE FROM cafe WHERE id = ?", [id]);
  if (result.affectedRows === 0) return res.status(404).render("sample_error", { message: "입력값 또는 대상 ID를 확인하세요." });
  // POST ?? ? GET?? ???? ????? ?? ?? ??? ????.
  res.redirect(303, "/delete");
}));

start(app, "SUBJECT CRUD");
