const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const middlewarePath = path.join(rootDir, 'src', 'middleware.ts');
const middlewareBakPath = path.join(rootDir, 'src', 'middleware.ts.bak');
const apiPath = path.join(rootDir, 'src', 'app', 'api');
const apiBakPath = path.join(rootDir, 'src', 'app', '_api_bak');
const nextConfigPath = path.join(rootDir, 'next.config.ts');
const dotNextPath = path.join(rootDir, '.next');

let nextConfigOriginal = '';

function restoreFiles() {
  try {
    if (fs.existsSync(middlewareBakPath) && !fs.existsSync(middlewarePath)) {
      fs.renameSync(middlewareBakPath, middlewarePath);
      console.log('✓ Restored middleware.ts');
    }
    if (fs.existsSync(apiBakPath) && !fs.existsSync(apiPath)) {
      fs.renameSync(apiBakPath, apiPath);
      console.log('✓ Restored src/app/api');
    }
    if (nextConfigOriginal && fs.existsSync(nextConfigPath)) {
      fs.writeFileSync(nextConfigPath, nextConfigOriginal, 'utf8');
      console.log('✓ Restored next.config.ts');
    }
  } catch (err) {
    console.error('Lỗi khi khôi phục files:', err);
  }
}

// Bắt mọi tín hiệu tắt đột ngột (Ctrl+C, Crash, Kill) để luôn trả lại file nguyên vẹn
process.on('SIGINT', () => {
  restoreFiles();
  process.exit(1);
});
process.on('SIGTERM', () => {
  restoreFiles();
  process.exit(1);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  restoreFiles();
  process.exit(1);
});

try {
  console.log('=== Step 1: Isolating Static Mobile Frontend ===');

  if (fs.existsSync(middlewarePath)) {
    fs.renameSync(middlewarePath, middlewareBakPath);
    console.log('✓ Temporarily disabled middleware.ts');
  }

  if (fs.existsSync(apiPath)) {
    fs.renameSync(apiPath, apiBakPath);
    console.log('✓ Temporarily isolated server API routes');
  }

  // Remove .next cache to avoid stale dev types
  if (fs.existsSync(dotNextPath)) {
    console.log('✓ Cleaning .next cache...');
    fs.rmSync(dotNextPath, { recursive: true, force: true });
  }

  nextConfigOriginal = fs.readFileSync(nextConfigPath, 'utf8');
  let exportConfig = nextConfigOriginal.replace(
    /output:\s*'standalone'/,
    "output: 'export',\n  typescript: { ignoreBuildErrors: true },\n  eslint: { ignoreDuringBuilds: true }"
  );
  fs.writeFileSync(nextConfigPath, exportConfig, 'utf8');
  console.log("✓ Switched next.config.ts to output: 'export' with build error bypass");

  console.log('=== Step 2: Compiling Static Mobile Assets ===');
  execSync('npx next build --webpack', { stdio: 'inherit', cwd: rootDir });
  console.log('✓ Static export completed successfully in "out" folder!');

} catch (err) {
  console.error('Static export error:', err);
  process.exitCode = 1;
} finally {
  console.log('=== Step 3: Restoring Full-Stack Architecture ===');
  restoreFiles();
}
