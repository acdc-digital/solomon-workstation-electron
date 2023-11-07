import React, { useRef, useEffect } from 'react';

const PDFTronWebViewer = ({ initialDoc }) => {
  const viewer = useRef(null);

  useEffect(() => {
    let instance; // Define instance here so it's available in both the initializeViewer and cleanup function

    async function initializeViewer() {
      try {
        const WebViewer = await import('@pdftron/webviewer');
        instance = await WebViewer.default({
          path: '/webviewer/lib',
          licenseKey: 'insert-license-key-here', // Make sure to use the actual license key
          initialDoc,
        }, viewer.current);

        const { docViewer } = instance;
        docViewer.on('documentLoaded', () => {
          console.log('Document loaded');
        });
        // other event handlers and API calls
      } catch (error) {
        console.error('Error initializing PDFTron WebViewer', error);
      }
    }

    initializeViewer();

    // Cleanup function if the component unmounts
    return () => {
      // Dispose of the WebViewer instance
      if (instance) {
        instance.dispose();
      }
    };
  }, [initialDoc]);

  return (
    // For the PDFTronWebViewer component
    <div className="webviewer" ref={viewer} style={{ height: '100%', width: '100%', margin: 0, padding: 0, overflow: 'hidden' }}></div>
  );
};

export default PDFTronWebViewer;

