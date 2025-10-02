const vscode = require('vscode');
const { lineBlameHistory, fileHistory } = require('./git');

class HistoryProvider {
  constructor(fileUri, lineNumber) {
    this.fileUri = fileUri;
    this.lineNumber = lineNumber;
    this._onDidChangeTreeData = new vscode.EventEmitter();
    this.onDidChangeTreeData = this._onDidChangeTreeData.event;
  }

  refresh() {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element) {
    return element;
  }

  async getChildren(element) {
    if (!this.fileUri) {
      return [];
    }

    if (this.lineNumber) {
        return await lineBlameHistory(this.fileUri.fsPath, this.lineNumber);
    }
    return await fileHistory(this.fileUri.fsPath);
  }
}

module.exports = { HistoryProvider };
