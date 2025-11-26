
import {
  createConnection,
  ProposedFeatures,
  TextDocuments,
  TextDocumentSyncKind,
  InitializeParams,
  Hover,
  Position
} from 'vscode-languageserver/node';
import { TextDocument } from 'vscode-languageserver-textdocument';

import { getHover } from './gateHover';
import { getDiagnostics } from './gateDiagnostics';
import { compileToTrace } from './gateTraceEngine';
import { evaluateEvolutionReport } from './gateEvolution';
import { getGateBreakPreview } from './gateLattice';

const connection = createConnection(ProposedFeatures.all);
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

connection.onInitialize((_params: InitializeParams) => {
  return {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental,
      hoverProvider: true
    }
  };
});

documents.onDidChangeContent(change => {
  const diagnostics = getDiagnostics(change.document);
  connection.sendDiagnostics({ uri: change.document.uri, diagnostics });
});

connection.onHover(params => {
  const doc = documents.get(params.textDocument.uri);
  if (!doc) return null;
  return getHover(doc, params.position);
});

connection.onRequest('gate/compileToTrace', (params: { uri: string }) => {
  const doc = documents.get(params.uri);
  if (!doc) { return ''; }
  return compileToTrace(doc);
});

connection.onRequest('gate/evaluateEvolution', (params: { uri: string }) => {
  const doc = documents.get(params.uri);
  if (!doc) { return 'No document.'; }
  return evaluateEvolutionReport(doc);
});

connection.onRequest('gate/showGateBreakPreview', (params: { uri: string, position: Position }) => {
  const doc = documents.get(params.uri);
  if (!doc) { return 'No document.'; }
  return getGateBreakPreview(doc, params.position);
});

documents.listen(connection);
connection.listen();
