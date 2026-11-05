const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const outDir = path.join(rootDir, 'dist-exe', 'The Legacy Keepers-win32-x64');
const resourcesDir = path.join(outDir, 'resources');
const appDir = path.join(resourcesDir, 'app');
const standaloneTarget = path.join(resourcesDir, 'standalone');
const standaloneSource = path.join(rootDir, '.next', 'standalone');

console.log('=== Building Windows Desktop Executable (.exe) ===');

function findElectronZip() {
  const localAppData =
    process.env.LOCALAPPDATA || path.join(os.homedir(), 'AppData', 'Local');
  const cacheDir = path.join(localAppData, 'electron', 'Cache');
  if (!fs.existsSync(cacheDir)) return null;

  function walk(dir) {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          const found = walk(fullPath);
          if (found) return found;
        } else if (
          entry.isFile() &&
          entry.name.startsWith('electron-') &&
          entry.name.includes('win32-x64') &&
          entry.name.endsWith('.zip')
        ) {
          return fullPath;
        }
      }
    } catch {}
    return null;
  }
  return walk(cacheDir);
}

const zipPath = findElectronZip();
console.log('📂 Detected Electron Prebuilt Runtime:', zipPath || 'Not found');

if (!zipPath || !fs.existsSync(zipPath)) {
  console.log('⚠️ Electron prebuilt cache not found. Attempting electron-packager fallback...');
  try {
    execSync('npx electron-packager . "The Legacy Keepers" --platform=win32 --arch=x64 --out=dist-exe --overwrite', {
      stdio: 'inherit',
      cwd: rootDir,
    });
    console.log('✅ Packaged with electron-packager successfully!');
    process.exit(0);
  } catch (e) {
    console.error('❌ Failed to package Windows executable:', e.message);
    process.exit(1);
  }
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
const electronBuildDir = path.join(rootDir, 'electron-build');
if (fs.existsSync(electronBuildDir)) {
  fs.copyFileSync(
    path.join(electronBuildDir, 'package.json'),
    path.join(appDir, 'package.json')
  );
  fs.copyFileSync(
    path.join(electronBuildDir, 'main.js'),
    path.join(appDir, 'main.js')
  );
  console.log('4. Injected Electron main launcher into resources/app');
}

// 5. Copy standalone server into resources/standalone
if (fs.existsSync(standaloneSource)) {
  console.log('5. Copying Next.js standalone bundle into resources/standalone...');
  execSync(
    `powershell -NoProfile -Command "Copy-Item -Recurse -Force '${standaloneSource}' '${standaloneTarget}'"`,
    { stdio: 'inherit' }
  );
}

console.log('=== Windows Executable Build Complete! ===');
console.log('Executable path:', targetExe);
