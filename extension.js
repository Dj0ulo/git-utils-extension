const vscode = require('vscode');
const { HistoryProvider } = require('./src/historyProvider');

function registerHistoryCommand(context, name, isLineHistory) {
  const viewId = isLineHistory ? 'lineHistory' : 'fileHistory';
  const contextName = isLineHistory ? 'git-utils.showLineHistoryView' : 'git-utils.showFileHistoryView';

  let provider;
  let currentFileUri;
  let currentLineNumber;

  const command = vscode.commands.registerCommand(name, () => {
    vscode.commands.executeCommand('setContext', contextName, true);
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      currentFileUri = editor.document.uri;
      if (isLineHistory) {
        currentLineNumber = editor.selection.active.line + 1;
      }
    }

    if (currentFileUri) {
      const lineNumber = isLineHistory ? currentLineNumber : undefined;
      const providerId = isLineHistory ? `${currentFileUri.toString()}:${lineNumber}` : currentFileUri.toString();
      const existingProviderId = provider ? (isLineHistory ? `${provider.fileUri.toString()}:${provider.lineNumber}` : provider.fileUri.toString()) : undefined;

      if (provider && providerId === existingProviderId) {
        provider.refresh();
      } else {
        provider = new HistoryProvider(currentFileUri, lineNumber);
        vscode.window.registerTreeDataProvider(viewId, provider);
      }
      vscode.commands.executeCommand('workbench.view.scm');
    }
  });
  context.subscriptions.push(command);
}

function activate(context) {
  vscode.commands.executeCommand('setContext', 'git-utils.showFileHistoryView', false);
  vscode.commands.executeCommand('setContext', 'git-utils.showLineHistoryView', false);

  registerHistoryCommand(context, 'git-utils.showFileHistory', false);
  registerHistoryCommand(context, 'git-utils.showLineHistory', true);

  let disposable = vscode.commands.registerCommand('git-utils.undoCommit', function (sourceControl) {
    vscode.commands.executeCommand('git.undoCommit', sourceControl);
  });

  context.subscriptions.push(disposable);

  let openFileDisposable = vscode.commands.registerCommand('git-utils.openFileInWriteMode', async () => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      const uri = editor.document.uri;
      const fileUri = vscode.Uri.file(uri.path);
      const selection = editor.selection;

      const doc = await vscode.workspace.openTextDocument(fileUri);
      const newEditor = await vscode.window.showTextDocument(doc, { preview: false });

      newEditor.selection = selection;
      newEditor.revealRange(selection, vscode.TextEditorRevealType.InCenter);
    }
  });

  context.subscriptions.push(openFileDisposable);

  const copyCommitId = vscode.commands.registerCommand('git-utils.copyCommitId', (item) => {
    vscode.env.clipboard.writeText(item.hash);
  });

  context.subscriptions.push(copyCommitId);

  const openInGitHub = vscode.commands.registerCommand('git-utils.openInGitHub', async (item) => {
    const git = vscode.extensions.getExtension('vscode.git').exports.getAPI(1);
    const repository = git.getRepository(item.fileUri);
    if (repository) {
      const remote = repository.state.remotes[0];
      if (remote && remote.fetchUrl) {
        const match = /github\.com[:/](.*)\.git/.exec(remote.fetchUrl);
        if (match) {
          const repoPath = match[1];
          const url = `https://github.com/${repoPath}/commit/${item.hash}`;
          vscode.env.openExternal(vscode.Uri.parse(url));
        }
      }
    }
  });

  context.subscriptions.push(openInGitHub);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
}