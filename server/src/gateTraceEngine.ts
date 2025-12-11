import { TextDocument } from "vscode-languageserver-textdocument";
import { buildIR } from "./gateIR";

export function compileToTrace(doc: TextDocument): string {
  const ir = buildIR(doc);
  const lines: string[] = [];
  lines.push("#==TRACE:COMPILED");
  for (const instr of ir.instructions) {
    if (instr.op === "CALL") {
      lines.push(">trace::FUNCTION:");
      lines.push(`    raw:"${instr.args.raw}"`);
    } else if (instr.op === "STATE_BLOCK") {
      lines.push("#==TRACE:STATE");
      lines.push(">trace::STATE:");
      lines.push(`    raw:"${instr.args.raw}"`);
    }
  }
  if (ir.instructions.length === 0) {
    lines.push("# no IR instructions detected");
  }
  return lines.join("\n");
}
