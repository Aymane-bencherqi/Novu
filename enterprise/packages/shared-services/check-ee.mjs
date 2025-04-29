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

function runCommand(command, args) {
  const logData = new CliLogs();
  let childProcess;

  return new Promise((resolve, reject) => {
    const processOptions = {
      cwd: ROOT_PATH,
      env: { ...process.env },
      shell: true,
    };

    childProcess = spawn(command, args, processOptions);

    childProcess.stdin.setEncoding(ENCODING_TYPE);
    childProcess.stdout.setEncoding(ENCODING_TYPE);
    childProcess.stderr.setEncoding(ENCODING_TYPE);
    childProcess.stdout.on('data', logData.log);
    childProcess.stderr.on('data', logData.log);

    childProcess.on('close', (code) => {
      if (code !== 0) {
        reject(logData.joinedLogs);
      } else {
        resolve(logData.joinedLogs);
      }
    });

    childProcess.on('error', (err) => {
      reject(`Failed to start process: ${err.message}`);
    });
  });
}

function ensureBuildDirectory() {
  const buildPath = path.resolve(ROOT_PATH, 'build');
  if (!fs.existsSync(buildPath)) {
    fs.mkdirSync(buildPath, { recursive: true });
  }

  // Create main directory and files
  const mainPath = path.join(buildPath, 'main');
  if (!fs.existsSync(mainPath)) {
    fs.mkdirSync(mainPath, { recursive: true });
  }

  const mainIndexJsPath = path.join(mainPath, 'index.js');
  const mainIndexDtsPath = path.join(mainPath, 'index.d.ts');

  if (!fs.existsSync(mainIndexJsPath)) {
    fs.writeFileSync(
      mainIndexJsPath,
      '"use strict";\nObject.defineProperty(exports, "__esModule", { value: true });\n'
    );
  }

  if (!fs.existsSync(mainIndexDtsPath)) {
    fs.writeFileSync(mainIndexDtsPath, 'export {};\n');
  }

  // Create module directory and files
  const modulePath = path.join(buildPath, 'module');
  if (!fs.existsSync(modulePath)) {
    fs.mkdirSync(modulePath, { recursive: true });
  }

  const moduleIndexJsPath = path.join(modulePath, 'index.js');
  const moduleIndexDtsPath = path.join(modulePath, 'index.d.ts');

  if (!fs.existsSync(moduleIndexJsPath)) {
    fs.writeFileSync(
      moduleIndexJsPath,
      '"use strict";\nObject.defineProperty(exports, "__esModule", { value: true });\n'
    );
  }

  if (!fs.existsSync(moduleIndexDtsPath)) {
    fs.writeFileSync(moduleIndexDtsPath, 'export {};\n');
  }
}

async function runBuild() {
  const srcPath = path.resolve(ROOT_PATH, 'src');
  const hasSrcFolder = fs.existsSync(srcPath);
  const hasSrcFiles = hasSrcFolder && fs.readdirSync(srcPath).length > 0;

  if (hasSrcFiles) {
    try {
      await runCommand('npx', ['tsc', '-p', 'tsconfig.json']);
    } catch (error) {
      if (error.includes('No inputs were found')) {
        console.log(
          'No TypeScript files found in src directory. Creating empty build directory with placeholder files.'
        );
        ensureBuildDirectory();
      } else {
        console.error('Error during build:', error);
        process.exit(1);
      }
    }
  } else {
    console.log('No src directory or files found. Creating empty build directory with placeholder files.');
    ensureBuildDirectory();
  }
}

try {
  await runBuild();
} catch (error) {
  console.error('Error in check-ee.mjs:', error);
  process.exit(1);
}
