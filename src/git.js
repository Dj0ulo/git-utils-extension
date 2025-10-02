const { spawnSync } = require('child_process');
const { HistoryItem: Commit } = require('./commit');
const vscode = require('vscode');
const path = require('path');


/**
 * 
 * @param {*} command 
 * @param {*} options 
 * @returns { Promise<{stdout: String, stderr}> }
 */
function execGit(command, args, options) {
  return new Promise((resolve) => {
    resolve(spawnSync("git", [command, ...args], { encoding: "utf8", ...options }));
  });
}

async function fileHistory(filePath) {
    const cwd = path.dirname(filePath);
    const parseData = (rawCommit) => rawCommit.trim().split("\x00")[0].split("\x1f");

    try {
        const { stdout } = await execGit("log", [ "--follow", "--pretty=format:%H%x1f%an%x1f%ar%x1f%s", "--", filePath ], { cwd });
        const commits = stdout
            .trim()
            .split("\n")
            .filter((line) => line)
        return commits.map((commitData, index) => {
            const [hash, author, date, subject] = parseData(commitData)
            const label = `${subject} – ${author} (${date})`;
            const prevCommit = commits[index + 1];
            const previousHash = prevCommit ? parseData(prevCommit)[0] : null;
            return new Commit(label, hash, filePath, previousHash);
        });
    } catch (err) {
        vscode.window.showErrorMessage(`Error getting history: ${err.message}`);
        return [];
    }
}

async function lineBlameHistory(filePath, line, commit="HEAD") {
    const cwd = path.dirname(filePath);
    try {
        const { stdout } = await execGit("blame", [ "-p", "-L", `${line},+1`, commit, "--", filePath ], { cwd });
        const data = stdout
            .split("\n")
            .reduce((acc, line, i) => {
                const splitted = line.split(" ");
                if (i == 0) {
                    acc.commit = splitted[0];
                    acc.line = splitted[1];
                } else if(splitted[0] === "summary") {
                    acc.summary = line.slice("summary ".length);
                } else if(splitted[0] === "previous") {
                    acc.previous = splitted[1];
                    acc.previousFileName = splitted.slice(2).join(" ");
                } else if(splitted[0] === "filename") {
                    acc.filename = line.slice("filename ".length);
                }
                return acc;
            }, {});
        const item = new Commit(data.summary, data.commit, cwd + '/' + data.previousFileName, data.previous);
        if (!data.previous) {
            return [item];
        }
        return [item, ...(await lineBlameHistory(cwd + '/' + data.previousFileName, data.line, data.previous)).filter(r => r)];
    } catch (error) {
        return [];
    }
}

module.exports = { execGit, lineBlameHistory, fileHistory };
