import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  Wallet, 
  LogOut, 
  FileText,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role !== 'morador';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    // Avisos removed from sidebar, now exclusive to Header notification bell
    ...(isAdmin ? [
      { icon: Building2, label: 'Gestão Predial', path: '/gestao' },
      { icon: Users, label: 'Moradores', path: '/moradores' },
    ] : []),
    { icon: Wallet, label: 'Finanças', path: '/financas' },
    { icon: FileText, label: 'Relatórios', path: '/documentos' },
  ];

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-40 w-64 bg-carbon-900 text-white transform transition-transform duration-300 ease-in-out shadow-2xl
    ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
    md:translate-x-0 md:shadow-xl
  `;

  return (
    <aside className={sidebarClasses}>
      <div className="flex items-center justify-between h-16 px-4 bg-carbon-900 border-b border-carbon-700">
        <div className="flex items-center">
          {/* Logo updated to represent a condominium complex */}
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center mr-3 shadow-lg shadow-primary-900/50">
             <Building2 className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-sm tracking-wide text-gray-100">TRANSPARÊNCIA</span>
        </div>
        <button onClick={onClose} className="md:hidden text-gray-400 hover:text-white">
          <X className="w-6 h-6" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto mt-6">
        <div className="px-4 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Menu Principal
        </div>
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                onClick={() => {
                   if (window.innerWidth < 768) onClose();
                }}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm transition-all duration-200 border-l-4 ${
                    isActive
                      ? 'bg-carbon-800 border-primary-600 text-white font-medium'
                      : 'border-transparent text-gray-400 hover:bg-carbon-800 hover:text-white hover:border-carbon-500'
                  }`
                }
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-carbon-700 bg-carbon-900">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 text-sm text-gray-400 hover:text-white hover:bg-carbon-800 rounded transition-colors group"
        >
          <LogOut className="w-5 h-5 mr-3 group-hover:text-red-400 transition-colors" />
          Sair do Sistema
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;