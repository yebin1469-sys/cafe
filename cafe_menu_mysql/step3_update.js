// 단계 5 (step3): 메뉴 수정 — Update
// 실행: node step3_update.js → http://localhost:3000/menus

const express = require("express");
const db = require("./db");
const { asyncHandler, validMenu, startServer } = require("./helpers");
const path = require("path");

const app = express();
const PORT = Number(process.env.PORT || 3000);


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.redirect("/menus"));

// [R] 목록
app.get("/menus", asyncHandler(async (req, res) => {
  const [menus] = await db.execute("SELECT * FROM menus ORDER BY category, price");
  res.render("menu_step3", { menus });
}));

// [C] 추가
app.post("/menus", asyncHandler(async (req, res) => {
  const name = (typeof req.body.name === "string" ? req.body.name : "").trim();
  const price = Number(req.body.price);
  if (!validMenu(req.body)) return res.redirect("/menus");

  await db.execute("INSERT INTO menus (name, price, category) VALUES (?, ?, ?)",
    [name, price, req.body.category]);
  res.redirect("/menus");
}));

// [U] 수정 폼 보여주기: GET /menus/:id/edit
app.get("/menus/:id/edit", asyncHandler(async (req, res) => {
  const [[menu]] = await db.execute("SELECT * FROM menus WHERE id = ?", [req.params.id]);
  if (!menu) return res.redirect("/menus");
  res.render("edit", { menu });
}));

// [U] 수정 실행: POST /menus/:id/edit → UPDATE
app.post("/menus/:id/edit", asyncHandler(async (req, res) => {
  const name = (typeof req.body.name === "string" ? req.body.name : "").trim();
  const price = Number(req.body.price);
  if (validMenu(req.body)) {
    await db.execute("UPDATE menus SET name = ?, price = ?, category = ? WHERE id = ?",
      [name, price, req.body.category, req.params.id]);
  }
  res.redirect("/menus");
}));

startServer(app, db, PORT);
