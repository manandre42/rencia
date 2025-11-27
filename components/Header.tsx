import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, User, Search, Menu } from 'lucide-react';
import ProfileSettingsModal from './ProfileSettingsModal';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const checkUser = () => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse user");
            }
        }
    };
    
    checkUser();
    // Listen for storage changes in case profile is updated
    window.addEventListener('storage', checkUser);
    return () => window.removeEventListener('storage', checkUser);
  }, []);

  const getRoleLabel = (role: string) => {
      if (role === 'morador') return 'Morador';
      if (role === 'admin_global') return 'Admin Global';
      if (role === 'admin_bloco') return 'Admin de Bloco';
      return 'Administrador';
  };

  return (
    <>
    <header className="h-16 bg-white/90 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-4 md:px-6 fixed top-0 right-0 left-0 md:left-64 z-30 transition-all duration-300">
      
      <div className="flex items-center w-full max-w-xl">
        <button 
          onClick={onMenuClick}
          className="mr-4 p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-md md:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="relative w-full hidden md:block">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="w-4 h-4 text-gray-400" />
          </span>
          <input
            type="text"
            placeholder="Pesquisar..."
            className="w-full py-2 pl-10 pr-4 text-sm bg-gray-50 border-b border-transparent focus:border-primary-600 focus:bg-white focus:outline-none transition-all rounded-t-sm"
          />
        </div>
      </div>

      <div className="flex items-center space-x-3 md:space-x-6">
        <button 
          onClick={() => navigate('/avisos')}
          className="relative p-2 text-gray-500 hover:text-primary-600 transition-colors hover:bg-gray-50 rounded-full"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
        
        <div className="h-8 w-px bg-gray-200 hidden md:block"></div>

        <div 
            onClick={() => setIsProfileOpen(true)}
            className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="text-right hidden md:block">
             <div className="text-sm font-medium text-gray-800 group-hover:text-primary-700 transition-colors">{user ? user.name : 'Usuário'}</div>
             <div className="text-xs text-gray-400 font-light">{getRoleLabel(user?.role)}</div>
          </div>
          <div className="w-9 h-9 bg-primary-600 rounded-full flex items-center justify-center text-white font-medium shadow-md shadow-primary-600/20 group-hover:ring-2 ring-offset-2 ring-primary-600 transition-all">
            {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
          </div>
        </div>
      </div>
    </header>

    <ProfileSettingsModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </>
  );
};

export default Header;