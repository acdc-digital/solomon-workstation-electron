// components/MainLayout.tsx
import React from 'react';
import Sidebar from './Sidebar'; // Import your Sidebar component

const MainLayout = ({ children }) => {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar style={{ width: '300px', flexShrink: 0 }} />
      <main style={{ flexGrow: 1 }}>
        {children} {/* This is where the main page content will go */}
      </main>
    </div>
  );
};

export default MainLayout;
