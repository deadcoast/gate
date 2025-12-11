import { Hover, MarkupKind, Position } from "vscode-languageserver/node";
import { TextDocument } from "vscode-languageserver-textdocument";

export function getHover(doc: TextDocument, position: Position): Hover | null {
  const text = doc.getText();
  const offset = doc.offsetAt(position);
  const start = text.lastIndexOf(" ", offset - 1) + 1;
  const endSpace = text.indexOf(" ", offset);
  const endNewline = text.indexOf("\n", offset);
  const endCandidates = [endSpace, endNewline].filter((i) => i !== -1);
  const end = endCandidates.length ? Math.min(...endCandidates) : text.length;
  const word = text.slice(start, end);

  if (word.startsWith("%") && word.endsWith("%")) {
    return {
      contents: {
        kind: MarkupKind.Markdown,
        value: `**Context Variable**\\nSymbol: \`${word}\``,
      },
    };
  }

  if (word === "ϟ") {
    return {
      contents: {
        kind: MarkupKind.Markdown,
        value:
          "**ϟ SLEDGE SPARK**\\nRepresents Sledge discharge at a Gate boundary.",
      },
    };
  }

  if (word === "Δ") {
    return {
      contents: {
        kind: MarkupKind.Markdown,
        value: "**Δ Delta Shift**\\nRepresents recorded state transition.",
      },
    };
  }

  if (word === "↯") {
    return {
      contents: {
        kind: MarkupKind.Markdown,
        value: "**↯ Intent Discharge**\\nHuman-bound intent force.",
      },
    };
  }

  return null;
}
