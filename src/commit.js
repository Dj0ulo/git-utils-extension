const vscode = require('vscode');

class Commit extends vscode.TreeItem {
  constructor(label, shortHash, fullHash, fileUri, previousHash) {
    super(label, vscode.TreeItemCollapsibleState.None);
    this.shortHash = shortHash;
    this.hash = fullHash; // Use 'hash' for the full hash
    this.fileUri = fileUri;
    this.contextValue = 'commit';

    const right = this.fileUri.with({
        scheme: "git",
        path: this.fileUri.path,
        query: JSON.stringify({ path: this.fileUri.path, ref: this.hash }),
    });
    const left = previousHash
        ? this.fileUri.with({
              scheme: "git",
              path: this.fileUri.path,
              query: JSON.stringify({ path: this.fileUri.path, ref: previousHash }),
          })
        : this.fileUri.with({
              scheme: "git",
              path: this.fileUri.path,
              query: JSON.stringify({
                  path: this.fileUri.path,
                  ref: "4b825dc642cb6eb9a060e54bf8d69288fbee4904",
              }),
          });
    const title = `${this.shortHash} vs ${previousHash ? previousHash.substring(0, 7) : 'Initial Commit'}`;

    this.command = {
      command: 'vscode.diff',
      title: title,
      arguments: [left, right, title]
    };
  }
}

module.exports = { Commit };
