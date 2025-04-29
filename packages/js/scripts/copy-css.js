const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, '..', 'src', 'ui', 'index.css');
const destPath = path.join(__dirname, '..', 'src', 'ui', 'index.directcss');

try {
  fs.copyFileSync(sourcePath, destPath);
  console.log('Successfully copied index.css to index.directcss');
} catch (error) {
  console.error('Error copying file:', error);
  process.exit(1);
}
