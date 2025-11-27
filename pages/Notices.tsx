import React, { useEffect, useState } from 'react';
import { Mail, Send, Reply, Bell, User, CheckCircle, Filter } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { ApiService } from '../services/api';
import { Notice } from '../types';
import { motion } from 'framer-motion';
import Modal from '../components/Modal';
import { useNotification } from '../components/NotificationSystem';

const Notices = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const { showToast } = useNotification();
  
  // Compose State
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [recipientGroup, setRecipientGroup] = useState('admins');

  useEffect(() => {
    ApiService.notices.getAll().then(data => {
        setNotices(data);
        setLoading(false);
    });
  }, []);

  const handleSend = async (e: React.FormEvent) => {
      e.preventDefault();
      // Mock API call
      await ApiService.notices.create({
          title: subject,
          content: message,
          sender: user.name,
          date: new Date().toISOString(),
          type: 'direct' // Logic to determine type based on recipient
      });
      showToast('Aviso enviado com sucesso!', 'success');
      setIsComposeOpen(false);
      setSubject('');
      setMessage('');
  };

  const handleForward = (notice: Notice) => {
      setSubject(`ENC: ${notice.title}`);
      setMessage(`\n\n--- Mensagem Original de ${notice.sender} ---\n${notice.content}`);
      setIsComposeOpen(true);
  };

  const RecipientSelector = () => {
      if (user.role === 'morador') {
          return (
              <div className="mb-4">
                  <label className="text-xs font-bold text-gray-500 uppercase">Para</label>
                  <div className="w-full p-2 bg-gray-100 rounded text-sm text-gray-700 border border-gray-200 mt-1">
                      Administração do Condomínio
                  </div>
              </div>
          );
      }
      return (
          <div className="mb-4">
              <label className="text-xs font-bold text-gray-500 uppercase">Destinatários</label>
              <select 
                className="w-full p-2 bg-gray-50 border border-gray-200 rounded text-sm mt-1 focus:border-primary-600 focus:outline-none"
                value={recipientGroup}
                onChange={(e) => setRecipientGroup(e.target.value)}
              >
                  <option value="building">Todos os Moradores do Prédio</option>
                  <option value="block">Todos os Administradores do Bloco</option>
                  {user.role === 'admin_global' && <option value="all">Todos os Moradores (Broadcast)</option>}
                  <option value="admins">Outros Administradores</option>
              </select>
          </div>
      );
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-light text-gray-900 tracking-tight">Avisos e Comunicados</h1>
                <p className="text-gray-500 mt-1 text-sm">Central de comunicação do condomínio.</p>
            </div>
            <button 
                onClick={() => {
                    setSubject('');
                    setMessage('');
                    setIsComposeOpen(true);
                }}
                className="bg-carbon-900 text-white px-4 py-2 text-sm font-medium hover:bg-carbon-800 transition-colors flex items-center rounded-sm shadow-sm"
            >
                <Send className="w-4 h-4 mr-2" />
                Novo Aviso
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Sidebar Filter - simplified for demo */}
            <div className="md:col-span-1 space-y-4">
                <div className="bg-white p-4 shadow-sm border border-gray-200 rounded-sm">
                    <h3 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center">
                        <Filter className="w-3 h-3 mr-1"/> Filtros
                    </h3>
                    <ul className="space-y-2 text-sm">
                        <li className="flex justify-between items-center p-2 bg-blue-50 text-primary-700 rounded cursor-pointer font-medium">
                            <span>Caixa de Entrada</span>
                            <span className="bg-primary-200 text-primary-800 px-1.5 py-0.5 rounded-full text-xs">2</span>
                        </li>
                        <li className="flex justify-between items-center p-2 hover:bg-gray-50 text-gray-600 rounded cursor-pointer transition-colors">
                            <span>Enviados</span>
                        </li>
                        <li className="flex justify-between items-center p-2 hover:bg-gray-50 text-gray-600 rounded cursor-pointer transition-colors">
                            <span>Importantes</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Message List */}
            <div className="md:col-span-2 space-y-4">
                {loading ? (
                    <div className="text-center py-10"><div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto"></div></div>
                ) : (
                    notices.map((notice) => (
                        <motion.div 
                            key={notice.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`bg-white p-5 border-l-4 shadow-sm rounded-sm ${notice.type === 'urgent' ? 'border-red-500' : 'border-primary-600'}`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center space-x-2">
                                    {notice.type === 'urgent' ? <Bell className="w-4 h-4 text-red-500"/> : <Mail className="w-4 h-4 text-gray-400"/>}
                                    <h3 className="font-semibold text-gray-900">{notice.title}</h3>
                                    {!notice.isRead && <span className="bg-blue-100 text-blue-800 text-[10px] px-2 py-0.5 rounded-full">Novo</span>}
                                </div>
                                <span className="text-xs text-gray-400">{new Date(notice.date).toLocaleDateString()}</span>
                            </div>
                            
                            <p className="text-gray-600 text-sm mb-4 leading-relaxed whitespace-pre-wrap">
                                {notice.content}
                            </p>
                            
                            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                                <div className="flex items-center text-xs text-gray-500">
                                    <User className="w-3 h-3 mr-1"/>
                                    <span className="font-medium mr-1">{notice.sender}</span>
                                    <span className="text-gray-400">({notice.senderRole === 'admin_global' ? 'Admin Global' : 'Administração'})</span>
                                </div>
                                
                                {user.role !== 'morador' && (
                                    <button 
                                        onClick={() => handleForward(notice)}
                                        className="text-primary-600 hover:text-primary-800 text-xs font-medium flex items-center transition-colors"
                                    >
                                        <Reply className="w-3 h-3 mr-1"/> Encaminhar
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>

        <Modal isOpen={isComposeOpen} onClose={() => setIsComposeOpen(false)} title="Novo Aviso">
            <form onSubmit={handleSend} className="space-y-4">
                <RecipientSelector />
                
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Assunto</label>
                    <input 
                        className="w-full p-2 bg-gray-50 border-b-2 border-gray-200 mt-1 focus:border-primary-600 focus:outline-none text-sm"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Resumo do aviso..."
                        required
                    />
                </div>

                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Mensagem</label>
                    <textarea 
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded mt-1 focus:border-primary-600 focus:outline-none text-sm h-32 resize-none"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Digite o conteúdo do comunicado..."
                        required
                    />
                </div>

                <div className="flex justify-end pt-4 space-x-2">
                    <button 
                        type="button" 
                        onClick={() => setIsComposeOpen(false)}
                        className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded"
                    >
                        Cancelar
                    </button>
                    <button 
                        type="submit"
                        className="bg-primary-600 text-white px-6 py-2 text-sm font-medium hover:bg-primary-700 rounded shadow-sm flex items-center"
                    >
                        <Send className="w-4 h-4 mr-2"/> Enviar
                    </button>
                </div>
            </form>
        </Modal>
      </div>
    </PageTransition>
  );
};

export default Notices;