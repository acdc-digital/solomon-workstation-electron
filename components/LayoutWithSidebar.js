// components/LayoutWithSidebar.js
import Sidebar from '../components/Sidebar'; // Replace with your actual sidebar component path

const LayoutWithSidebar = ({ children }) => {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar style={{ width: '250px', flexShrink: 0 }} />
      <main style={{ flexGrow: 1 }}>
        {children}
      </main>
    </div>
  );
};

export default LayoutWithSidebar;
