// 단계 3 (step1): 메뉴 목록 표시 — Read
// 실행: node step1_list.js → http://localhost:3000/menus

const express = require("express");
const db = require("./db");
const { asyncHandler, validMenu, startServer } = require("./helpers");
const path = require("path");

const app = express();
const PORT = Number(process.env.PORT || 3000);


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => res.redirect("/menus"));

// [R] 목록 조회
app.get("/menus", asyncHandler(async (req, res) => {
  // mysql2/promise: execute() → [행 배열, 필드 정보]
  const [menus] = await db.execute("SELECT * FROM menus ORDER BY category, price");

  res.render("menu_step1", { menus });
}));

startServer(app, db, PORT);
