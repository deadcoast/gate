
const vscode = acquireVsCodeApi();

document.body.innerHTML = `
  <style>
    body { font-family: monospace; background:#111; color:#eee; }
    .col { float:left; width:48%; margin:1%; }
    pre { background:#222; padding:8px; border-radius:4px; }
  </style>
  <div class="col">
    <h3>Source (read-only view)</h3>
    <pre id="source"></pre>
  </div>
  <div class="col">
    <h3>IR / Trace</h3>
    <pre id="trace"></pre>
  </div>
`;

window.addEventListener('message', event => {
  const data = event.data;
  if (data.type === 'source') {
    document.getElementById('source').textContent = data.payload;
  }
  if (data.type === 'trace') {
    document.getElementById('trace').textContent = data.payload;
  }
});
