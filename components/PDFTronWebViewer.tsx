import React, { useRef, useEffect } from 'react';

const PDFTronWebViewer = ({ initialDoc }) => {
  const viewer = useRef(null);

  useEffect(() => {
    let instance;

    // This function should be defined outside of the initializeViewer function.
    const initializeViewer = async () => {
      try {
        const WebViewer = await import('@pdftron/webviewer');
        instance = await WebViewer.default({
          path: '/webviewer/lib',
          licenseKey: 'insert-license-key-here', // Make sure to use your actual license key
          initialDoc,
        }, viewer.current);

        instance.docViewer.on('documentLoaded', () => {
          console.log('Document loaded');
        });
        // Add other event handlers and API calls as needed
      } catch (error) {
        console.error('Error initializing PDFTron WebViewer', error);
      }
    };

    initializeViewer();

    // Cleanup function
    return () => {
      // Check if the dispose function exists before calling it
      if (instance && typeof instance.dispose === 'function') {
        instance.dispose();
      }
    };
  }, [initialDoc]); // Ensure the effect runs again if initialDoc changes

  return (
    <div className="webviewer" ref={viewer} style={{ height: '100%', width: '100%', margin: 0, padding: 0, overflow: 'hidden' }}></div>
  );
};

export default PDFTronWebViewer;


