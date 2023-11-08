// preload.js
const { contextBridge, ipcRenderer } = require('electron');
const path = require('path'); // Import the path module

contextBridge.exposeInMainWorld('electronAPI', {
  invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
  
  joinPath: (...paths) => path.join(...paths), // Expose a function to join paths

  getStats: async (path) => ipcRenderer.invoke('get-stats', path),

  readDirectoryPage: async (path, pageNumber, pageSize) => {
    try {
      return await ipcRenderer.invoke('read-directory-page', path, pageNumber, pageSize);
    } catch (error) {
      console.error(`Error while reading directory page: ${error}`);
      throw error;
    }
  },

  // The rest of your IPC calls can be defined here.
  // Ensure all IPC calls are wrapped with try-catch blocks for robust error handling.
});

