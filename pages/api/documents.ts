// pages/api/documents.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const basePath = '/Users/matthewsimon/Documents';

const getFileType = (filename: string) => {
    const parts = filename.split('.');
    return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : 'UNKNOWN';
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const files = await fs.promises.readdir(basePath);
        const filesData = await Promise.all(
            files.map(async (file) => {
                const filePath = path.join(basePath, file);
                const stats = await fs.promises.stat(filePath);
                return {
                    name: file,
                    path: filePath,
                    type: stats.isDirectory() ? 'FOLDER' : getFileType(file),
                    size: stats.size,
                    modified: stats.mtime.toISOString(),
                };
            })
        );

        // Respond with the array of files and their details
        res.status(200).json(filesData);
    } catch (error) {
        console.error('Error reading directory', error);
        res.status(500).json({ error: 'Failed to read directory' });
    }
}