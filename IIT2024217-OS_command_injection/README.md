# OS Command Injection — demo and mitigation

In-band variant (command output returned). Built for **IT-30001 Cyber Security**,
Assignment: Web Server Security. A "ping a host" tool that is vulnerable to OS
command injection, alongside a secured version of the same feature.

> **Intentionally vulnerable.** Run on `localhost` only. Test only this application.

## Run

Requires Node.js (18+).

```bash
npm install
npm start
```

Open http://localhost:3000.

## Layout

| File | Purpose |
|------|---------|
| `server.js` | Vulnerable route (`/vulnerable/ping`) and secured route (`/secure/ping`), both commented. |
| `public/index.html` | UI and the full write-up (a)-(e). |
| `public/app.js`, `public/style.css` | Minimal front end. |

## What to show in the video / viva

1. **Vulnerable endpoint** — ping `127.0.0.1`, then inject `127.0.0.1; id`
   (or `127.0.0.1 && cat /etc/passwd`). The injected command's output comes back.
2. **Root cause** — user input concatenated into a shell command string.
3. **Secured endpoint** — submit the same payload; it is rejected / fails. Screenshot this.
4. **Mitigation** — `execFile` with an argument vector (no shell) + allow-list validation.
5. **Other mitigations (theory)** — least privilege, native libraries, safe errors
   (see the write-up section on the page).

## Ownership declaration (Table 3)

| Member name | Roll number | Category | Variant implemented |
|-------------|-------------|----------|---------------------|
|  |  | OS command injection | In-band (command output returned) |

Fill this in for the member who built this variant, and add the other members'
rows for their categories.

## Note

The code and exploit need to be explained individually at the viva, so read
through the comments in `server.js` and the write-up on the page rather than only
running it.
