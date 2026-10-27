/**
 * VULNERABLE server — Reflected XSS
 * Run:  node vulnerable.js
 * Then open: http://localhost:3000/
 */

const express = require("express");
const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send(`
    <html>
      <head><title>Vulnerable Search (Reflected XSS)</title></head>
      <body style="font-family: sans-serif; max-width: 600px; margin: 40px auto;">
        <h2>Search our site</h2>
        <form action="/search" method="GET">
          <input type="text" name="q" placeholder="Type something..." style="width:300px;">
          <button type="submit">Search</button>
        </form>
        <p style="color:gray">Try: &lt;script&gt;alert('XSS')&lt;/script&gt;</p>
      </body>
    </html>
  `);
});

app.get("/search", (req, res) => {
  const query = req.query.q || "";

  
  res.send(`
    <html>
      <head><title>Search Results</title></head>
      <body style="font-family: sans-serif; max-width: 600px; margin: 40px auto;">
        <h2>Results for: ${query}</h2>
        <p><a href="/">Back to search</a></p>
      </body>
    </html>
  `);
});
// ---------------------------------------------------------------------------

app.listen(PORT, () => {
  console.log(`[VULNERABLE] Reflected XSS demo running at http://localhost:${PORT}`);
  console.log(`Try: http://localhost:${PORT}/search?q=<script>alert('XSS')</script>`);
});
