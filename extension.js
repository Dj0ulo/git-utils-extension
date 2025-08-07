const vscode = require('vscode');

function activate(context) {
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
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
}
