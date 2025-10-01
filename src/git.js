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
  return stdout.trim().split('\x01').filter(line => line).map(commitData => {
    const [shortHash, fullHash, author, date, subject] = commitData.trim().split('\x00')[0].split('\x1f');
    const label = `${subject} – ${author} (${date})`;
    return new Commit(label, shortHash, fullHash, fileUri);
  });
}

module.exports = { execGit, parseGitLog };
