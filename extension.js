const vscode = require('vscode');

function activate(context) {
  let disposable = vscode.commands.registerCommand('git-utils.undoCommit', function (sourceControl) {
    vscode.commands.executeCommand('git.undoCommit', sourceControl);
  });

  context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
}
