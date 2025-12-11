import { Diagnostic, DiagnosticSeverity } from "vscode-languageserver/node";
import { TextDocument } from "vscode-languageserver-textdocument";

export function getDiagnostics(doc: TextDocument): Diagnostic[] {
  const text = doc.getText();
  const diagnostics: Diagnostic[] = [];

  const idx = text.indexOf("break_gate");
  if (
    idx !== -1 &&
    !text.includes('? confirm:"YES"') &&
    !text.includes('?confirm:"YES"')
  ) {
    const pos = doc.positionAt(idx);
    diagnostics.push({
      message: 'break_gate detected without explicit ? confirm:"YES"',
      severity: DiagnosticSeverity.Warning,
      range: {
        start: pos,
        end: { line: pos.line, character: pos.character + "break_gate".length },
      },
      source: "gate-lsp",
    });
  }

  if (text.includes("!!IRREVERSIBLE") && text.includes('STATUS="ACTIVE"')) {
    diagnostics.push({
      message:
        'Irreversibility marker present with STATUS="ACTIVE"; check gate state logic.',
      severity: DiagnosticSeverity.Information,
      range: {
        start: { line: 0, character: 0 },
        end: { line: 0, character: 1 },
      },
      source: "gate-lsp",
    });
  }

  return diagnostics;
}
