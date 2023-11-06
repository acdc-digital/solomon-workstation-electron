// index.tsx
import React from 'react';
import Sidebar from '../components/Sidebar';
import PDFTronWebViewer from '../components/PDFTronWebViewer'; // Ensure the path is correct

export default function Home() {
  const initialDocUrl = 'https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf';

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-cyan-500 to-blue-700 text-white">
      {/* Flex container for sidebar and PDF viewer */}
      <div className="flex flex-row min-h-screen w-full">
        {/* Sidebar with fixed width */}
        <div className="w-64 flex-shrink-0"> {/* Adjust the width as necessary */}
          <Sidebar />
        </div>
        {/* PDF Viewer */}
        <div className="flex-grow">
          <PDFTronWebViewer initialDoc={initialDocUrl} />
        </div>
      </div>
    </div>
  );
}

