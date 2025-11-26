
import * as vscode from 'vscode';
import * as path from 'path';
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind
} from 'vscode-languageclient/node';

let client: LanguageClient | undefined;

export function activate(context: vscode.ExtensionContext) {
  const serverModule = context.asAbsolutePath(path.join('out', 'server.js'));

  const serverOptions: ServerOptions = {
    run:   { module: serverModule, transport: TransportKind.ipc },
    debug: { module: serverModule, transport: TransportKind.ipc, options: { execArgv: ['--nolazy', '--inspect=6009'] } }
  };

  const clientOptions: LanguageClientOptions = {
    documentSelector: [{ language: 'gate' }],
    synchronize: {
      fileEvents: vscode.workspace.createFileSystemWatcher('**/*.gate')
    }
  };

  client = new LanguageClient(
    'gateLSP',
    'Gate Pattern Language Server',
    serverOptions,
    clientOptions
  );

  context.subscriptions.push(client.start());

  context.subscriptions.push(
    vscode.commands.registerCommand('gate.compileToTrace', () => compileToTrace(context)),
    vscode.commands.registerCommand('gate.renderELattice', () => renderELattice(context)),
    vscode.commands.registerCommand('gate.evaluateEvolution', () => evaluateEvolution(context)),
    vscode.commands.registerCommand('gate.showGateBreakPreview', () => showGateBreakPreview(context))
  );

  if (client) {
    client.onNotification('gate/playSound', (sound: string) => {
      playSound(context, sound);
    });
    client.onNotification('gate/showCeremony', (data: { title: string }) => {
      showCeremonyPopup(data.title);
    });
  }
}

export function deactivate(): Thenable<void> | undefined {
  if (!client) {
    return undefined;
  }
  return client.stop();
}

function compileToTrace(context: vscode.ExtensionContext) {
  if (!client) { return; }
  const editor = vscode.window.activeTextEditor;
  if (!editor) { return; }
  client.sendRequest('gate/compileToTrace', { uri: editor.document.uri.toString() }).then((trace: string) => {
    const panel = vscode.window.createWebviewPanel(
      'gateTrace',
      'Gate Execution Trace',
      vscode.ViewColumn.Beside,
      {}
    );
    panel.webview.html = `<pre>${trace.replace(/</g, '&lt;')}</pre>`;
  });
}

function renderELattice(context: vscode.ExtensionContext) {
  const panel = vscode.window.createWebviewPanel(
    'gateLattice',
    'Gate ELATTICE',
    vscode.ViewColumn.Beside,
    { enableScripts: true }
  );
  const scriptPath = vscode.Uri.file(path.join(context.extensionPath, 'media', 'lattice_panel.js'));
  const scriptUri = panel.webview.asWebviewUri(scriptPath);
  panel.webview.html = `
    <html>
    <body>
      <h2>ELATTICE Visualization</h2>
      <div id="app"></div>
      <script src="${scriptUri}"></script>
    </body>
    </html>
  `;
}

function evaluateEvolution(context: vscode.ExtensionContext) {
  if (!client) { return; }
  const editor = vscode.window.activeTextEditor;
  if (!editor) { return; }
  client.sendRequest('gate/evaluateEvolution', { uri: editor.document.uri.toString() }).then((report: string) => {
    vscode.window.showInformationMessage(report);
  });
}

function showGateBreakPreview(context: vscode.ExtensionContext) {
  if (!client) { return; }
  const editor = vscode.window.activeTextEditor;
  if (!editor) { return; }
  client.sendRequest('gate/showGateBreakPreview', { uri: editor.document.uri.toString(), position: editor.selection.active }).then((preview: string) => {
    vscode.window.showInformationMessage(preview);
  });
}

function playSound(context: vscode.ExtensionContext, soundName: string) {
  // VSCode doesn't natively play audio; this is a placeholder hook.
  // A custom client bridge or external helper would be required for real audio.
  console.log('SLEDGE_SOUND', soundName);
}

function showCeremonyPopup(title: string) {
  vscode.window.showInformationMessage(`✨ CEREMONY: ${title} ✨`);
}
