// directory.ts
import { ipcMain, IpcMainInvokeEvent } from 'electron';
import fsPromises from 'fs/promises';
import pathUtil from 'path';

// Standardizing the event names
const READ_DIRECTORY = 'directory:read';

// Helper function to sanitize and validate the path
const sanitizePath = (targetPath: string): string => {
  // Placeholder for path sanitation logic
  // TODO: Implement path normalization and sanitation checks here
  return pathUtil.normalize(targetPath);
};

// Helper function to format file stats
const formatFileStats = (dirent: fsPromises.Dirent, filePath: string) => {
  // Placeholder for formatting file stats logic
  // TODO: Implement logic to convert stats to a human-readable format
  return fsPromises.stat(filePath).then(stat => ({
    name: dirent.name,
    size: stat.size, // You may want to format this to a more readable format
    modified: stat.mtime.toISOString().split('T')[0],
    isDirectory: dirent.isDirectory()
  }));
};

ipcMain.handle(READ_DIRECTORY, async (event: IpcMainInvokeEvent, targetPath: string, page: number = 1, pageSize: number = 10) => {
  const sanitizedPath = sanitizePath(targetPath);
  // TODO: Implement pagination logic using `page` and `pageSize` parameters

  try {
    const dirents = await fsPromises.readdir(sanitizedPath, { withFileTypes: true });
    const directoryContents = await Promise.all(dirents.map(dirent => {
      const fullPath = pathUtil.join(sanitizedPath, dirent.name);
      return formatFileStats(dirent, fullPath);
    }));

    // TODO: Filter and paginate results based on `page` and `pageSize`
    const paginatedContents = directoryContents; // Placeholder for actual pagination logic

    return {
      directories: paginatedContents.filter(item => item.isDirectory),
      files: paginatedContents.filter(item => !item.isDirectory),
    };
  } catch (error) {
    console.error('Error reading directory', error);
    throw error; // Rethrow the error so the renderer process can handle it
  }
});


