// 단계 4 (step2): 메뉴 추가 — Create
// 실행: node step2_create.js → http://localhost:3000/menus

const express = require("express");
const db = require("./db");
const { asyncHandler, validMenu, startServer } = require("./helpers");
const path = require("path");

const app = express();
const PORT = Number(process.env.PORT || 3000);


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true })); // 폼 데이터 처리

app.get("/", (req, res) => res.redirect("/menus"));

// [R] 목록
app.get("/menus", asyncHandler(async (req, res) => {
  const [menus] = await db.execute("SELECT * FROM menus ORDER BY category, price");
  res.render("menu_step2", { menus });
}));

// [C] 추가: 폼 POST → INSERT → redirect
app.post("/menus", asyncHandler(async (req, res) => {
  const name = (typeof req.body.name === "string" ? req.body.name : "").trim();
  const price = Number(req.body.price);
  const category = req.body.category;

  // 입력 검증
  if (!validMenu(req.body)) {
    return res.redirect("/menus");
  }

  await db.execute("INSERT INTO menus (name, price, category) VALUES (?, ?, ?)",
    [name, price, category]); // ? 플레이스홀더 — SQL 인젝션 방지

  res.redirect("/menus"); // 새로고침해도 중복 등록되지 않도록 redirect
}));

startServer(app, db, PORT);
