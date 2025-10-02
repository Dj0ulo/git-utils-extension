const vscode = require('vscode');

class HistoryItem extends vscode.TreeItem {
  constructor(label, hash, filePath, parentHash) {
    super(label, vscode.TreeItemCollapsibleState.None);
    this.hash = hash; // Use 'hash' for the full hash
    this.contextValue = 'commit';

    const right = vscode.Uri.from({
        scheme: "git",
        path: filePath,
        query: JSON.stringify({ path: filePath, ref: this.hash }),
    });
    const left = parentHash
        ? vscode.Uri.from({
              scheme: "git",
              path: filePath,
              query: JSON.stringify({ path: filePath, ref: parentHash }),
          })
        : vscode.Uri.from({
              scheme: "git",
              path: filePath,
              query: JSON.stringify({
                  path: filePath,
                  ref: "4b825dc642cb6eb9a060e54bf8d69288fbee4904",
              }),
          });
    const title = `${hash} vs ${parentHash ? parentHash.substring(0, 7) : 'Initial Commit'}`;

    this.command = {
      command: 'vscode.diff',
      title: title,
      arguments: [left, right, title]
    };
  }
}

module.exports = { HistoryItem };
