const { exec } = require('child_process');
const { Commit } = require('./commit');

function execGit(command, options) {
  return new Promise((resolve, reject) => {
    exec(command, options, (err, stdout, stderr) => {
      if (err) {
        return reject(err);
      }
      resolve({ stdout, stderr });
    });
  });
}

function parseGitLog(stdout, fileUri) {
  if (!stdout) {
    return [];
  }
  const commits = stdout.trim().split('\x01').filter(line => line);
  return commits.map((commitData, index) => {
    const [shortHash, fullHash, author, date, subject] = commitData.trim().split('\x00')[0].split('\x1f');
    const label = `${subject} – ${author} (${date})`;
    const previousCommitData = commits[index + 1];
    const previousHash = previousCommitData ? previousCommitData.trim().split('\x00')[0].split('\x1f')[1] : null;
    return new Commit(label, shortHash, fullHash, fileUri, previousHash);
  });
}

module.exports = { execGit, parseGitLog };
