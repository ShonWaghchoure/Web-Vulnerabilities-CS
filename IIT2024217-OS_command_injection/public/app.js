async function run(endpoint, inputId, outId) {
  const host = document.getElementById(inputId).value;
  const out = document.getElementById(outId);
  out.textContent = 'running...';
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ host })
    });
    out.textContent = await res.text();
  } catch (e) {
    out.textContent = 'request failed: ' + e.message;
  }
}

document.getElementById('vuln-btn').addEventListener('click', () =>
  run('/vulnerable/ping', 'vuln-in', 'vuln-out'));

document.getElementById('safe-btn').addEventListener('click', () =>
  run('/secure/ping', 'safe-in', 'safe-out'));
