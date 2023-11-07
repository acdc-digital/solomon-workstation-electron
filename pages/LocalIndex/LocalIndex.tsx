// pages/LocalIndex.js
import React, { useState } from 'react';
import LayoutWithSidebar from '../../components/LayoutWithSidebar';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

// Mock functions to get file type, size, and modified date
const getFileType = (filename) => {
  // Assuming a simple check based on the extension
  return filename.split('.').pop().toUpperCase();
};

// This would normally be calculated on server or by using node's fs.stat or similar
const getFileSize = (filename) => '42 KB'; // Placeholder value
const getFileModifiedDate = (filename) => '2023-01-01'; // Placeholder value

const LocalIndex = ({ initialDirectoryContents }) => {
  const [currentPath, setCurrentPath] = useState('/Users/matthewsimon/Documents');
  const [directoryContents, setDirectoryContents] = useState(initialDirectoryContents.map((name) =>({
    name,
    type: getFileType(name), 
    size: getFileSize(name), 
    modified: getFileModifiedDate(name)
  })));

  const handleFolderClick = async (folderName) => {
    // Implement navigation logic here...
  };

  return (
    <LayoutWithSidebar>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 900 }} aria-label="documents table">
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
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                onClick={() => handleFolderClick(file.name)}
                style={{ cursor: 'pointer' }}
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
    </LayoutWithSidebar>
  );
};

export async function getServerSideProps(context) {
  // Import statements should be at the top of the file in actual code
  const fs = require('fs').promises;
  const path = '/Users/matthewsimon/Documents';

  // Add logic for retrieving file details (type, size, modified date)
  let filesData = await fs.readdir(path).catch((error) => {
    console.error('Error reading directory', error);
    return [];
  });

  // This array will contain objects with the file details instead of just file names.
  
  return {
    props: {
      initialDirectoryContents: filesData,
    },
  };
}

export default LocalIndex;