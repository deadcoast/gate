
import { Position } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';

export function getGateBreakPreview(doc: TextDocument, _position: Position): string {
  const text = doc.getText();
  const match = text.match(/gate:(\d+)/);
  const gate = match ? parseInt(match[1], 10) : 13;
  const newGate = gate - 1;
  return [
    'GATE BREAK PREVIEW',
    '────────────────────',
    `Gate: ${gate} → ${newGate}`,
    'Irreversibility: TRUE',
    'Sledge Cost: 1'
  ].join('\n');
}
