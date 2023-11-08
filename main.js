const { app, BrowserWindow, shell, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs').promises; // Moved to the top for better structure
const isDev = require('electron-is-dev');

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
  });

  const port = process.env.PORT || 3000;
  const url = isDev
    ? `http://localhost:${port}`
    : `file://${path.join(__dirname, '../build/index.html')}`; // Adjust for production

  mainWindow.loadURL(url);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http')) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
  });
}

function setupIPC() {
  ipcMain.handle('directory:read', async (event, targetPath) => {
    try {
      // Sanitize the targetPath here to avoid directory traversal issues
      const normalizedPath = path.normalize(targetPath);
      // Perform additional checks as necessary to ensure `normalizedPath` is safe
      const dirents = await fs.readdir(normalizedPath, { withFileTypes: true });
      const files = [];
      const directories = [];

      for (const dirent of dirents) {
        if (dirent.isFile()) {
          const stats = await fs.stat(path.join(normalizedPath, dirent.name));
          files.push({
            name: dirent.name,
            size: stats.size,
            modified: stats.mtime
          });
        } else if (dirent.isDirectory()) {
          directories.push(dirent.name);
        }
      }

      return { files, directories };
    } catch (error) {
      console.error(`Error reading directory at ${targetPath}: ${error}`);
      throw error;
    }
  });

  // The 'file:stats' IPC call seems unnecessary as the stats are now being fetched in 'directory:read'
  // Remove or comment out the 'file:stats' handler if not used elsewhere.

  // Additional IPC event handlers can be set up here
}

function startServer() {
  if (!isDev) {
    const { exec } = require('child_process');
    // Start your production server here
    const server = exec('npm run start'); // Adjust this command to your needs

    server.stdout.on('data', (data) => {
      console.log(`Server: ${data}`);
    });

    server.stderr.on('data', (data) => {
      console.error(`Server Error: ${data}`);
    });

    server.on('close', (code) => {
      console.log(`Server process exited with code ${code}`);
    });
  }
}

app.whenReady().then(() => {
  setupIPC();
  startServer();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
