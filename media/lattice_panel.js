document.body.innerHTML = `
  <style>
    body { font-family: monospace; background:#050510; color:#f8f8f2; }
    #app { padding: 10px; white-space: pre; }
  </style>
  <h2>ELATTICE Visualization (ASCII)</h2>
  <div id="app"></div>
`;

const example = `
NODES:
  • %MODEL%::TITLE
  • GATE13_BREAK
  • CEREMONY_BLOCK

EDGES:
  %MODEL%::TITLE  ~  GATE13_BREAK
  CEREMONY_BLOCK  -> %MODEL%::TITLE
`;

document.getElementById("app").textContent = example;
