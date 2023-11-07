import React from 'react';
import Sidebar from '../components/Sidebar';
import PDFTronWebViewer from '../components/PDFTronWebViewer';
import Chat from '../components/Chat'; // Import the chat component
import Box from '@mui/material/Box';

export default function Home() {
  const initialDocUrl = 'https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf';

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: 'background.default', m: 0, p: 0, overflow: 'hidden' }}>
      {/* Sidebar with fixed width */}
      <Box sx={{ width: 185, height: '100%', flexShrink: 0, zIndex: 10 }}>
        <Sidebar />
      </Box>

      {/* PDF Viewer with flex-grow to fill the remaining space */}
      <Box sx={{ flexGrow: 1, height: '100%', maxWidth: 'calc(100% - 535px)', overflow: 'hidden' }}>
        <PDFTronWebViewer initialDoc={initialDocUrl} />
      </Box>

      {/* Chat column */}
      <Box sx={{ width: 350, height: '100%', flexShrink: 0, zIndex: 10, overflow: 'hidden' }}>
        <Chat />
      </Box>
    </Box>
  );
}



