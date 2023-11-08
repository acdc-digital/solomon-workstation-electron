import React, { useState } from 'react';
import Box from '@mui/material/Box'; // Import Box for layout
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Sidebar from '../../components/Sidebar'; // Replace with the actual path to your Sidebar component

// Mock functions to get file type, size, and modified date
const getFileType = (filename) => {
  // Assuming a simple check based on the extension
  return filename.split('.').pop().toUpperCase();
};

const getFileSize = (filename) => '42 KB'; // Placeholder value
const getFileModifiedDate = (filename) => '2023-01-01'; // Placeholder value

const LocalIndex = ({ initialDirectoryContents }) => {
  const [currentPath, setCurrentPath] = useState('/Users/matthewsimon/Documents');
  const [directoryContents, setDirectoryContents] = useState(initialDirectoryContents.map((name) => ({
    name,
    type: getFileType(name),
    size: getFileSize(name),
    modified: getFileModifiedDate(name)
  })));

  const handleFolderClick = async (folderName) => {
    // Implement navigation logic here...
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: 'background.default', m: 0, p: 0 }}>
      {/* Sidebar with fixed width */}
      <Box sx={{ width: 185, flexShrink: 0 }}>
        <Sidebar />
      </Box>

      {/* Main content area */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
        <TableContainer component={Paper} sx={{ maxHeight: '100%' }}>
          <Table stickyHeader aria-label="documents table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>Date Modified</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {directoryContents.map((file) => (
                <TableRow
                  key={file.name}
                  onClick={() => handleFolderClick(file.name)}
                  hover
                  sx={{ cursor: 'pointer', '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">{file.name}</TableCell>
                  <TableCell>{file.type}</TableCell>
                  <TableCell>{file.size}</TableCell>
                  <TableCell>{file.modified}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export async function getServerSideProps(context) {
  const fs = require('fs').promises;
  const path = '/Users/matthewsimon/Documents';

  let filesData = await fs.readdir(path).catch((error) => {
    console.error('Error reading directory', error);
    return [];
  });

  return {
    props: {
      initialDirectoryContents: filesData,
    },
  };
}

export default LocalIndex;
