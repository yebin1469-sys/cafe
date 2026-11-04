-- subject 성적 관리 실습용 스키마

CREATE DATABASE IF NOT EXISTS todo_app
  DEFAULT CHARACTER SET utf8mb4;

USE todo_app;

CREATE TABLE IF NOT EXISTS subject (
  id INT AUTO_INCREMENT PRIMARY KEY,
  subject VARCHAR(100) NOT NULL,
  score INT NOT NULL
);

-- 확인
DESC subject;
