import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import SplashScreen from './components/SplashScreen';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Management from './pages/Management';
import Notices from './pages/Notices';

// Guard for protected routes
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="gestao" element={<Management />} />
          <Route path="avisos" element={<Notices />} />
          <Route path="moradores" element={<div className="p-8 text-2xl text-gray-300 font-light">Módulo de Moradores (Em desenvolvimento)</div>} />
          <Route path="financas" element={<div className="p-8 text-2xl text-gray-300 font-light">Módulo de Finanças (Em desenvolvimento)</div>} />
          <Route path="documentos" element={<div className="p-8 text-2xl text-gray-300 font-light">Documentos & Relatórios (Em desenvolvimento)</div>} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </HashRouter>
  );
}

export default App;