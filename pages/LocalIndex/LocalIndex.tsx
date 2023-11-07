// pages/LocalIndex.js
import React, { useState } from 'react';
import LayoutWithSidebar from '../../components/LayoutWithSidebar';
 // Import the layout component

const LocalIndex = ({ initialDirectoryContents }) => {
  const [currentPath, setCurrentPath] = useState('/Users/matthewsimon/Documents');
  const [directoryContents, setDirectoryContents] = useState(initialDirectoryContents);

  const handleFolderClick = async (folderName) => {
    const newPath = `${currentPath}/${folderName}`;
    setCurrentPath(newPath);

    const res = await fetch(`/api/readDirectory?path=${encodeURIComponent(newPath)}`);
    if (res.ok) {
      const files = await res.json();
      setDirectoryContents(files);
    }
  };

  // Render the directory contents
  return (
    <LayoutWithSidebar> {/* Wrap the content with the layout */}
      <div>
        {directoryContents.map((name) => (
          <div key={name} onClick={() => handleFolderClick(name)} style={{ cursor: 'pointer', padding: '5px' }}>
            {name}
          </div>
        ))}
      </div>
    </LayoutWithSidebar> /* Close the layout wrapper */
  );
};

// Server-side data fetching for initial directory contents
export async function getServerSideProps(context) {
  const fs = require('fs').promises;
  const path = '/Users/matthewsimon/Documents';

  const files = await fs.readdir(path).catch((error) => {
    console.error('Error reading directory', error);
    return [];
  });

  return {
    props: {
      initialDirectoryContents: files,
    },
  };
}

export default LocalIndex;
