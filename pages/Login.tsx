import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ApiService } from '../services/api';
import { motion } from 'framer-motion';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await ApiService.auth.login(formData);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      navigate('/');
    } catch (err) {
      setError('Credenciais inválidas. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#161616] font-sans p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex w-full max-w-4xl h-[600px] shadow-2xl overflow-hidden rounded-sm"
      >
        {/* Left Side - Visual (Dark) */}
        <div className="w-1/2 bg-[#161616] relative hidden md:flex flex-col justify-between p-12 text-white border-r border-[#393939]">
            <div className="z-10">
                <h1 className="text-4xl font-light mb-4 tracking-tight text-white">Transparência</h1>
                <p className="text-gray-400 font-light text-sm max-w-xs leading-relaxed">
                    Gestão imobiliária inteligente e transparente. 
                    <br/>Conectando moradores, administração e finanças em tempo real.
                </p>
            </div>
            
            <div className="z-10 relative">
               <div className="h-1 w-16 bg-[#0f62fe] mb-8"></div>
               <p className="text-xs text-gray-500 font-mono">
                 © 2024 Arksoft Angola.<br/>Todos os direitos reservados.
               </p>
            </div>

            {/* Decoration Circle - mimicking the glass effect in screenshot */}
            <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-gradient-to-br from-[#262626] to-[#161616] border border-[#393939] opacity-50 backdrop-blur-3xl shadow-2xl pointer-events-none"></div>
            <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-[#0f62fe] opacity-5 blur-[80px] pointer-events-none"></div>
        </div>

        {/* Right Side - Form (White) */}
        <div className="w-full md:w-1/2 bg-white p-8 md:p-16 flex flex-col justify-center relative">
          <div className="mb-10">
            <h2 className="text-3xl font-semibold text-gray-900 mb-2 tracking-tight">Bem-vindo</h2>
            <p className="text-gray-500 text-sm">Insira os seus dados para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Usuário</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full bg-gray-50 border-b-2 border-gray-200 px-4 py-3 text-gray-900 focus:border-[#0f62fe] focus:bg-white focus:outline-none transition-all placeholder-gray-400 text-sm"
                placeholder="Seu nome de usuário"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Senha</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-gray-50 border-b-2 border-gray-200 px-4 py-3 text-gray-900 focus:border-[#0f62fe] focus:bg-white focus:outline-none transition-all placeholder-gray-400 text-sm"
                placeholder="Sua senha"
                required
              />
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="text-red-600 text-xs bg-red-50 p-3 border-l-2 border-red-500"
              >
                {error}
              </motion.div>
            )}

            <div className="flex justify-between items-center pt-2">
              <a href="#" className="text-xs text-[#0f62fe] hover:underline font-medium">Esqueceu a senha?</a>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#0f62fe] text-white px-8 py-3 text-sm font-medium hover:bg-[#0353e9] transition-all disabled:opacity-50 flex items-center shadow-lg shadow-blue-500/20 active:transform active:scale-95"
              >
                {loading ? '...' : 'Entrar'}
                <ArrowRight className="ml-2 w-4 h-4" />
              </button>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                <p className="text-[10px] text-gray-400">
                  Ambiente de Teste: <span className="font-mono text-gray-600">admin</span> ou <span className="font-mono text-gray-600">morador</span>
                </p>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;