const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const http = require('http');
const net = require('net');

let mainWindow = null;
let currentPort = 3333;

function getAvailablePort(startPort = 3333) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(startPort, '127.0.0.1', () => {
      server.close(() => resolve(startPort));
    });
    server.on('error', () => {
      resolve(getAvailablePort(startPort + 1));
    });
  });
}

function checkServerReady(port, retries = 50, interval = 200) {
  return new Promise((resolve, reject) => {
    let count = 0;
    const test = () => {
      const req = http.get(`http://127.0.0.1:${port}`, (res) => {
        resolve(true);
      });
      req.on('error', () => {
        count++;
        if (count >= retries) {
          reject(new Error('Internal server timeout'));
        } else {
          setTimeout(test, interval);
        }
      });
    };
    test();
  });
}

async function startServer(port) {
  process.env.PORT = String(port);
  process.env.HOSTNAME = '127.0.0.1';
  process.env.NODE_ENV = 'production';

  // Determine standalone path
  const standaloneDir = app.isPackaged
    ? path.join(process.resourcesPath, 'standalone')
    : path.join(__dirname, '..', '.next', 'standalone');

  process.chdir(standaloneDir);
  const serverPath = path.join(standaloneDir, 'server.js');
  console.log('[Electron] Starting Next.js standalone from:', serverPath);
  require(serverPath);
}

async function createWindow() {
  try {
    currentPort = await getAvailablePort(3333);
    console.log('[Electron] Using port:', currentPort);

    await startServer(currentPort);
    await checkServerReady(currentPort);
    console.log('[Electron] Server ready at port:', currentPort);

    mainWindow = new BrowserWindow({
      width: 1440,
      height: 900,
      minWidth: 1024,
      minHeight: 720,
      title: 'The Legacy Keepers - Người Gìn Giữ Di Sản',
      backgroundColor: '#070D18',
      autoHideMenuBar: true,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
      },
    });

    mainWindow.loadURL(`http://127.0.0.1:${currentPort}`);

    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
      if (url.startsWith('http:') || url.startsWith('https:')) {
        shell.openExternal(url);
        return { action: 'deny' };
      }
      return { action: 'allow' };
    });

    mainWindow.on('closed', () => {
      mainWindow = null;
    });
  } catch (err) {
    console.error('[Electron] Error launching application:', err);
    app.quit();
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
