const fs = require('fs');
const path = require('path');

const sourceCjsPath = path.join(__dirname, '..', 'package.cjs.json');
const sourceEsmPath = path.join(__dirname, '..', 'package.esm.json');
const destCjsPath = path.join(__dirname, '..', 'dist', 'cjs', 'package.json');
const destEsmPath = path.join(__dirname, '..', 'dist', 'esm', 'package.json');

try {
  fs.copyFileSync(sourceCjsPath, destCjsPath);
  fs.copyFileSync(sourceEsmPath, destEsmPath);
  console.log('Successfully copied package.json files');
} catch (error) {
  console.error('Error copying package.json files:', error);
  process.exit(1);
}
