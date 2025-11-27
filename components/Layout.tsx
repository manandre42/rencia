import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex bg-[#f4f4f4] min-h-screen font-sans overflow-hidden">
      {/* Sidebar handles its own responsive behavior via props */}
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      <div className="flex-1 flex flex-col min-w-0 md:ml-64 transition-all duration-300">
        <Header onMenuClick={toggleSidebar} />
        
        <main className="flex-1 pt-20 px-4 md:px-8 pb-8 overflow-y-auto h-screen scroll-smooth">
          <Outlet />
        </main>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
          onClick={closeSidebar}
        />
      )}
    </div>
  );
};

export default Layout;