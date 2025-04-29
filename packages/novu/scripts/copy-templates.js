const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, '..', 'src', 'commands', 'init', 'templates');
const destDir = path.join(__dirname, '..', 'dist', 'src', 'commands', 'init', 'templates');

// Create destination directory if it doesn't exist
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Copy app templates
const appTemplates = fs.readdirSync(sourceDir).filter((file) => file.startsWith('app'));
for (const template of appTemplates) {
  const sourcePath = path.join(sourceDir, template);
  const destPath = path.join(destDir, template);
  fs.cpSync(sourcePath, destPath, { recursive: true });
}

// Copy github template
const githubSource = path.join(sourceDir, 'github');
const githubDest = path.join(destDir, 'github');
fs.cpSync(githubSource, githubDest, { recursive: true });

console.log('Successfully copied templates');
