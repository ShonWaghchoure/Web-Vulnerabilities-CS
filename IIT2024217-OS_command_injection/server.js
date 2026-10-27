// OS Command Injection demo — in-band variant (command output returned).
// IT-30001 Cyber Security assignment. Run LOCALLY only.
//
// Security notes for this file:
//   * /vulnerable/ping is INTENTIONALLY vulnerable. It is the exhibit. Do not fix it.
//   * /secure/ping is the fixed version of the same feature.
//   * Everything else below is hardened so the ONLY exploitable thing is the exhibit.

const express = require('express');
const os = require('os');
const { exec, execFile } = require('child_process');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '127.0.0.1';                 // FIX: bind to loopback only (see note at bottom)

app.disable('x-powered-by');              // FIX: don't advertise the framework/version
app.use(express.urlencoded({ extended: false, limit: '10kb' }));  // FIX: cap body size
app.use(express.json({ limit: '10kb' }));
app.use(express.static(path.join(__dirname, 'public')));

// ping uses a different count flag on Windows (-n) vs Linux/macOS (-c)
const COUNT_FLAG = os.platform() === 'win32' ? '-n' : '-c';

// ---------------------------------------------------------------------------
// (a) VULNERABLE IMPLEMENTATION  --  INTENTIONAL, the demo exhibit.
// ---------------------------------------------------------------------------
// The flaw: `host` is concatenated into a command STRING and handed to a shell
// (exec runs it via /bin/sh -c or cmd.exe). The shell interprets metacharacters
// (; && | ` $()), so an attacker can append their own commands.
app.post('/vulnerable/ping', (req, res) => {
  const host = (req.body.host || '').toString();

  const cmd = `ping ${COUNT_FLAG} 1 ${host}`;            // <-- the vulnerable line

  exec(cmd, { timeout: 10000 }, (error, stdout, stderr) => {
    const body =
      `$ ${cmd}\n\n` +
      (stdout || '') +
      (stderr || '') +
      (error ? `\n[process exited: ${error.code ?? error.message}]` : '');
    res.type('text/plain').send(body);
  });
});

// ---------------------------------------------------------------------------
// (d) SECURED IMPLEMENTATION — same feature, same payloads now fail.
// ---------------------------------------------------------------------------
// Primary mitigation: NO SHELL. execFile runs the binary directly with an
// explicit argument vector, so `host` is one literal argument to ping.
// Extra layer (defense in depth): allow-list validation before anything runs.
//
// Regex is anchored ^...$. Note: in JavaScript (no /m flag) $ matches only the
// true end of the string and NOT before a trailing newline, so the classic
// newline-injection bypass that affects this pattern in some other languages
// does not apply here.
const HOST_ALLOWLIST = /^[A-Za-z0-9.-]{1,253}$/;

app.post('/secure/ping', (req, res) => {
  const host = (req.body.host || '').toString().trim();

  // Layer 1 — allow-list: accept only hostname / IPv4 characters.
  if (!HOST_ALLOWLIST.test(host)) {
    return res
      .status(400)
      .type('text/plain')
      .send('Rejected: input failed allow-list validation (only letters, digits, "." and "-" allowed).');
  }

  // Layer 2 — no shell: argument vector. `--` ends option parsing so a value
  // starting with "-" cannot be read as a flag.
  execFile('ping', [COUNT_FLAG, '1', '--', host], { timeout: 10000 }, (error, stdout, stderr) => {
    const body =
      `ping ${COUNT_FLAG} 1 ${host}\n\n` +
      (stdout || '') +
      (stderr || '') +
      (error ? `\n[process exited: ${error.code ?? error.message}]` : '');
    res.type('text/plain').send(body);
  });
});

// FIX: listen on 127.0.0.1 only. The default (0.0.0.0 / ::) would expose an
// app that hands out remote code execution to every machine on the network.
app.listen(PORT, HOST, () => {
  console.log(`OS command injection demo running at http://${HOST}:${PORT}`);
  console.log('Intentionally vulnerable — bound to localhost only.');
});
