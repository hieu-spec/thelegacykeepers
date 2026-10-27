const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const zipPath = path.join(
  process.env.LOCALAPPDATA,
  'electron',
  'Cache',
  '60b62c26a87223a26b919ccbdd07cf1a183db20ae9d2d4d57db8080f0a010515',
  'electron-v33.2.1-win32-x64.zip'
);
const outDir = path.join(rootDir, 'dist-exe', 'The Legacy Keepers-win32-x64');
const resourcesDir = path.join(outDir, 'resources');
const appDir = path.join(resourcesDir, 'app');
const standaloneTarget = path.join(resourcesDir, 'standalone');
const standaloneSource = path.join(rootDir, '.next', 'standalone');

console.log('=== Building Windows Desktop Executable (.exe) ===');

if (!fs.existsSync(zipPath)) {
  console.error('Electron prebuilt zip not found at:', zipPath);
  process.exit(1);
}

// 1. Clean and prepare target directory
if (fs.existsSync(outDir)) {
  console.log('1. Cleaning existing dist-exe folder...');
  fs.rmSync(outDir, { recursive: true, force: true });
}
fs.mkdirSync(outDir, { recursive: true });

// 2. Extract Electron binaries using PowerShell Expand-Archive
console.log('2. Extracting Electron Windows runtime...');
execSync(
  `powershell -NoProfile -Command "Expand-Archive -LiteralPath '${zipPath}' -DestinationPath '${outDir}' -Force"`,
  { stdio: 'inherit' }
);

// 3. Rename electron.exe to 'The Legacy Keepers.exe'
const srcExe = path.join(outDir, 'electron.exe');
const targetExe = path.join(outDir, 'The Legacy Keepers.exe');
if (fs.existsSync(srcExe)) {
  fs.renameSync(srcExe, targetExe);
  console.log('3. Renamed binary to: The Legacy Keepers.exe');
}

// 4. Create resources/app
fs.mkdirSync(appDir, { recursive: true });
fs.copyFileSync(
  path.join(rootDir, 'electron-build', 'package.json'),
  path.join(appDir, 'package.json')
);
fs.copyFileSync(
  path.join(rootDir, 'electron-build', 'main.js'),
  path.join(appDir, 'main.js')
);
console.log('4. Injected Electron main launcher into resources/app');

// 5. Copy standalone server into resources/standalone
console.log('5. Copying Next.js standalone bundle into resources/standalone...');
execSync(
  `powershell -NoProfile -Command "Copy-Item -Recurse -Force '${standaloneSource}' '${standaloneTarget}'"`,
  { stdio: 'inherit' }
);

console.log('=== Windows Executable Build Complete! ===');
console.log('Executable path:', targetExe);
