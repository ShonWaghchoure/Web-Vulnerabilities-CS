-- Lab 4 - SQL Injection (Authentication Bypass)
-- Run with:  mysql -u root < db/schema.sql

DROP DATABASE IF EXISTS lab4_sqli;
CREATE DATABASE lab4_sqli;
USE lab4_sqli;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50),
  password VARCHAR(50)
);

INSERT INTO users (username, password) VALUES
  ('admin', 'admin123'),
  ('alice', 'alice123'),
  ('bob',   'bob123');
