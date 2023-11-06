import React, { useRef, useEffect } from 'react';

const PDFTronWebViewer = ({ initialDoc }) => {
  const viewer = useRef(null);

  useEffect(() => {
    let instance;
    // Dynamically import the 'WebViewer' because it's not server-side renderable
    import('@pdftron/webviewer').then((WebViewer) => {
      instance = WebViewer.default({
        path: '/webviewer/lib',
        licenseKey: 'demo:1699180588093:7cc4c39103000000003cabc8000676a4df2978ec98a297264c41f1f7e5',
        initialDoc,
      }, viewer.current).then((instance) => {
        // Now you can use the WebViewer instance and the docViewer API
        const { docViewer } = instance;
        docViewer.on('documentLoaded', () => {
          console.log('Document loaded');
        });
        // other event handlers and API calls
      });
    });

    // Cleanup function if the component unmounts
    return () => {
      if (instance) {
        instance.dispose();
      }
    };
  }, [initialDoc]);

  return (
    <div className="webviewer" ref={viewer} style={{ height: '100vh' }}></div>
  );
};

export default PDFTronWebViewer;
