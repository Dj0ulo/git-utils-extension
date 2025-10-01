const vscode = require('vscode');
const path = require('path');
const { execGit, parseGitLog } = require('./git');

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

    const cwd = path.dirname(this.fileUri.fsPath);
    const command = this.lineNumber
      ? `git log -L ${this.lineNumber},${this.lineNumber}:${this.fileUri.fsPath} --pretty=format:"%x01%h%x1f%H%x1f%an%x1f%ar%x1f%s%x00"`
      : `git log --follow --pretty=format:"%x01%h%x1f%H%x1f%an%x1f%ar%x1f%s%x00" -- ${this.fileUri.fsPath}`;

    try {
      const { stdout } = await execGit(command, { cwd });
      return parseGitLog(stdout, this.fileUri);
    } catch (err) {
      vscode.window.showErrorMessage(`Error getting history: ${err.message}`);
      return [];
    }
  }
}

module.exports = { HistoryProvider };
