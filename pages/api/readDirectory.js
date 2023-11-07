// pages/api/readDirectory.js

export default async function handler(req, res) {
	const fs = require('fs').promises;
	const path = req.query.path;
  
	try {
	  const files = await fs.readdir(path);
	  res.status(200).json(files);
	} catch (error) {
	  console.error('Error reading directory', error);
	  res.status(500).json({ error: 'Error reading directory' });
	}
  }
  