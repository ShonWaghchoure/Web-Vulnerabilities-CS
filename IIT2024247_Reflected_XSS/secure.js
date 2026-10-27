/**
 * MITIGATED server — same feature, fixed with output encoding.
 * Run:  node secure.js
 * Then open: http://localhost:3000/
 * Try the same payload as before — it will now be shown as plain text.
 */

const express = require("express");
const app = express();
const PORT = 3000;

// A minimal, explicit HTML-escaping function (no external library needed,
// but in a real project you'd use a framework's built-in auto-escaping,
// e.g. a templating engine like EJS/Pug, or a library like `escape-html`).
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

app.get("/", (req, res) => {
  res.send(`
    <html>
      <head><title>Secure Search (XSS Fixed)</title></head>
      <body style="font-family: sans-serif; max-width: 600px; margin: 40px auto;">
        <h2>Search our site (secure)</h2>
        <form action="/search" method="GET">
          <input type="text" name="q" placeholder="Type something..." style="width:300px;">
          <button type="submit">Search</button>
        </form>
        <p style="color:gray">Try the same payload: &lt;script&gt;alert('XSS')&lt;/script&gt;</p>
      </body>
    </html>
  `);
});

app.get("/search", (req, res) => {
  const query = req.query.q || "";

  // FIX: escape user input before inserting it into HTML.
  const safeQuery = escapeHtml(query);

  res.send(`
    <html>
      <head><title>Search Results</title></head>
      <body style="font-family: sans-serif; max-width: 600px; margin: 40px auto;">
        <h2>Results for: ${safeQuery}</h2>
        <p><a href="/">Back to search</a></p>
      </body>
    </html>
  `);
});
// ---------------------------------------------------------------------------

app.listen(PORT, () => {
  console.log(`[SECURE] Mitigated Reflected XSS demo running at http://localhost:${PORT}`);
  console.log(`Try the SAME payload as before: http://localhost:${PORT}/search?q=<script>alert('XSS')</script>`);
});
