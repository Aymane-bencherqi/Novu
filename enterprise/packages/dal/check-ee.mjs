import spawn from 'cross-spawn';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'node:fs';
const dirname = path.dirname(fileURLToPath(import.meta.url));

const ROOT_PATH = path.resolve(dirname);
const ENCODING_TYPE = 'utf8';
const NEW_LINE_CHAR = '\n';

class CliLogs {
  constructor() {
    this._logs = [];
    this.log = this.log.bind(this);
  }

  log(log) {
    const cleanLog = log.trim();
    if (cleanLog.length) {
      this._logs.push(cleanLog);
    }
  }

  get logs() {
    return this._logs;
  }

  get joinedLogs() {
    return this.logs.join(NEW_LINE_CHAR);
  }
}

function pnpmRun(...args) {
  const logData = new CliLogs();
  let pnpmProcess;

  return new Promise((resolve, reject) => {
    const processOptions = {
      cwd: ROOT_PATH,
      env: process.env,
      shell: true, // Add shell option for Windows
    };

    pnpmProcess = spawn('pnpm', args, processOptions);

    pnpmProcess.stdin.setEncoding(ENCODING_TYPE);
    pnpmProcess.stdout.setEncoding(ENCODING_TYPE);
    pnpmProcess.stderr.setEncoding(ENCODING_TYPE);
    pnpmProcess.stdout.on('data', logData.log);
    pnpmProcess.stderr.on('data', logData.log);

    pnpmProcess.on('close', (code) => {
      if (code !== 0) {
        reject(logData.joinedLogs);
      } else {
        resolve(logData.joinedLogs);
      }
    });

    pnpmProcess.on('error', (err) => {
      reject(`Failed to start process: ${err.message}`);
    });
  });
}

function ensureDistDirectory() {
  const distPath = path.resolve(ROOT_PATH, 'dist');
  if (!fs.existsSync(distPath)) {
    fs.mkdirSync(distPath, { recursive: true });
  }

  // Create a placeholder index.js and index.d.ts if they don't exist
  const indexJsPath = path.join(distPath, 'index.js');
  const indexDtsPath = path.join(distPath, 'index.d.ts');

  if (!fs.existsSync(indexJsPath)) {
    fs.writeFileSync(indexJsPath, '"use strict";\nObject.defineProperty(exports, "__esModule", { value: true });\n');
  }

  if (!fs.existsSync(indexDtsPath)) {
    fs.writeFileSync(indexDtsPath, 'export {};\n');
  }
}

try {
  const hasSrcFolder = fs.existsSync(path.resolve(ROOT_PATH, 'src'));
  if (hasSrcFolder) {
    await pnpmRun('build:esm');
  } else {
    console.log('No src directory found. Creating empty dist directory with placeholder files.');
    ensureDistDirectory();
  }
} catch (error) {
  console.error('Error in check-ee.mjs:', error);
  process.exit(1);
}
