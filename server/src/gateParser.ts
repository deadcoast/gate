export interface GateToken {
  type: string;
  value: string;
  offset: number;
}

export interface GateASTNode {
  type: string;
  value?: string;
  children?: GateASTNode[];
}

export function tokenizeGate(text: string): GateToken[] {
  // Minimal tokenizer stub; real implementation would respect the full grammar.
  const tokens: GateToken[] = [];
  const regex =
    /!admin::|!system::|!rule::|set::|@meta::|%[A-Z]+%|> FUNCTION_CALL:|> STATE_CHANGE:|> DECLARATION::FORMAL:|#==SECTION:[^\n]+|#==TRACE:[^\n]+|"""[\s\S]*?"""|"(?:[^"\\]|\\.)*"|Δ|↯|ϟ|⌘|⌾|⇜|⇝|⇹|!!IRREVERSIBLE|\[[A-Z_]+:[0-9=>]+\]|\S+/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    tokens.push({ type: "token", value: match[0], offset: match.index });
  }
  return tokens;
}

export function parseGate(text: string): GateASTNode {
  // Very lightweight AST node wrapping the whole document.
  return {
    type: "Document",
    children: tokenizeGate(text).map((t) => ({
      type: "Token",
      value: t.value,
    })),
  };
}
