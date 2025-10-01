const vscode = require('vscode');

class Commit extends vscode.TreeItem {
  constructor(label, shortHash, fullHash, fileUri) {
    super(label, vscode.TreeItemCollapsibleState.None);
    this.shortHash = shortHash;
    this.hash = fullHash; // Use 'hash' for the full hash
    this.fileUri = fileUri;
    this.contextValue = 'commit';
  }
}

module.exports = { Commit };
