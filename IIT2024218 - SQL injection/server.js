// SQL Injection: Authentication Bypass
// Node.js + Express + MySQL

require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');

const app = express();
app.use(express.json());
app.use(express.static('public'));

// connect to database (change password if your MySQL has one)
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: process.env.DB_PASS || '',
  database: 'lab4_sqli'
});

db.connect(function (err) {
  if (err) {
    console.log('DB connection error:', err.message);
    return;
  }
  console.log('Connected to MySQL');
});

// login route
app.post('/login', function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  const secure = req.body.secure;   // true = use the safe version

  if (secure) {
    // safe: parameterized query (? placeholders)
    const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
    db.query(sql, [username, password], function (err, results) {
      if (err) return res.json({ ok: false, message: err.message, sql: sql });
      showResult(res, results, sql);
    });
  } else {
    // vulnerable: input is put directly into the query string
    const sql = "SELECT * FROM users WHERE username = '" + username + "' AND password = '" + password + "'";
    db.query(sql, function (err, results) {
      if (err) return res.json({ ok: false, message: err.message, sql: sql });
      showResult(res, results, sql);
    });
  }
});

function showResult(res, results, sql) {
  if (results.length > 0) {
    res.json({ ok: true, message: 'Login successful, Welcome ' + results[0].username, sql: sql });
  } else {
    res.json({ ok: false, message: 'Login failed', sql: sql });
  }
}

app.listen(3000, function () {
  console.log('Server running on http://localhost:3000');
});
