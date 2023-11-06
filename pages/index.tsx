import React from 'react';
import Sidebar from '../components/Sidebar';
import PDFTronWebViewer from '../components/PDFTronWebViewer';
import Box from '@mui/material/Box';

export default function Home() {
  const initialDocUrl = 'https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf';

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default', m: 0, p: 0 }}>
  {/* Sidebar with fixed width */}
  <Box sx={{ width: 185, flexShrink: 0, zIndex: 10, m: 0, p: 0 }}>
    <Sidebar />
  </Box>
  {/* PDF Viewer with flex-grow to fill the remaining space */}
  <Box sx={{ flexGrow: 1, overflow: 'auto', m: 0, p: 0 }}>
    <PDFTronWebViewer initialDoc={initialDocUrl} />
  </Box>
</Box>
  );
}


