import { TextDocument } from "vscode-languageserver-textdocument";
import { parseGate } from "./gateParser";

export interface IRInstruction {
  op: string;
  args: { [key: string]: string };
}

export interface IRProgram {
  instructions: IRInstruction[];
}

export function buildIR(doc: TextDocument): IRProgram {
  const ast = parseGate(doc.getText());
  // Stub: IR is not deeply analyzed, but a basic program is returned.
  const instructions: IRInstruction[] = [];
  if (ast.children) {
    for (const node of ast.children) {
      if (!node.value) continue;
      if (node.value.startsWith("> FUNCTION_CALL")) {
        instructions.push({ op: "CALL", args: { raw: node.value } });
      } else if (node.value.startsWith("> STATE_CHANGE")) {
        instructions.push({ op: "STATE_BLOCK", args: { raw: node.value } });
      }
    }
  }
  return { instructions };
}
