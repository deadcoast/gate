import { TextDocument } from "vscode-languageserver-textdocument";

export function evaluateEvolutionReport(doc: TextDocument): string {
  const text = doc.getText();
  const hasTorchbearer = text.includes("Torchbearer");
  const hasEcho = text.includes("ECHO") || text.includes("#==TRACE:ECHO");

  let potential = 0.3;
  if (hasTorchbearer) potential += 0.3;
  if (hasEcho) potential += 0.2;

  return [
    "#==TRACE:EVOLUTION",
    `>trace::EVOLUTION:`,
    `    potential:"${potential.toFixed(2)}"`,
    `    arc:"ASCENT"`,
    `    note:"Heuristic evolution estimate based on titles and echoes"`,
  ].join("\n");
}
