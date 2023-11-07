const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const { exec } = require('child_process');

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true, // It's recommended to set this to false and use contextIsolation
      contextIsolation: true,  // This should be set to true to avoid security issues
    },
  });

  const port = process.env.PORT || 3000;
  const url = isDev
    ? `http://localhost:${port}`
    : `http://localhost:${port}`; // Pointing to localhost server even in production

  mainWindow.loadURL(url);

  // Open the DevTools in development mode.
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if(url.startsWith('http')) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
  });
}

function startServer() {
  if (!isDev) {
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
  startServer(); // Start the server
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

