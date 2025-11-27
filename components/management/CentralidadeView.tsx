import React, { useEffect, useState } from 'react';
import { MapPin, Plus, DoorOpen } from 'lucide-react';
import { ApiService } from '../../services/api';
import ListItem from './ListItem';
import { Centralidade } from '../../types';
import { AnimatePresence } from 'framer-motion';
import CreationModal from './CreationModal';
import { useNotification } from '../NotificationSystem';
import AdminInfoModal from './AdminInfoModal';

interface Props {
  onSelect: (c: Centralidade) => void;
  userRole: string;
}

const CentralidadeView: React.FC<Props> = ({ onSelect, userRole }) => {
  const [data, setData] = useState<Centralidade[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Admin Info Modal State
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [selectedEntityName, setSelectedEntityName] = useState('');

  const { showToast, confirm } = useNotification();

  useEffect(() => {
    ApiService.centralidades.getAll().then(res => {
        setData(res);
        setLoading(false);
    });
  }, []);

  const handleDelete = (id: number, name: string) => {
    confirm({
        title: 'Excluir Centralidade',
        message: `Tem certeza que deseja excluir "${name}"? Esta ação removerá também todos os blocos, prédios e moradores associados.`,
        isDestructive: true,
        confirmText: 'Excluir Definitivamente',
        onConfirm: () => {
            // Simulate API delete
            setData(prev => prev.filter(item => item.n_codicentr !== id));
            showToast('Centralidade excluída com sucesso.', 'success');
        }
    });
  };

  const handleInfo = (name: string) => {
      setSelectedEntityName(name);
      setInfoModalOpen(true);
  };

  // Only Global Admin can add/delete Centralities
  const canModify = userRole === 'admin_global';

  return (
    <div className="min-h-[400px]">
        <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Centralidades</h2>
             {canModify && (
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-carbon-900 text-white px-3 py-1.5 text-xs font-medium hover:bg-carbon-800 transition-all flex items-center shadow-sm rounded-sm"
                >
                    <Plus className="w-3 h-3 mr-1"/>
                    Cadastrar Centralidade
                </button>
            )}
        </div>
        
        {loading && (
             <div className="p-8 flex justify-center">
                 <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
             </div>
        )}

        {!loading && data.length === 0 && (
            <div className="p-12 text-center text-gray-400 font-light">
                <DoorOpen className="w-12 h-12 mx-auto mb-4 opacity-20"/>
                Nenhuma centralidade encontrada.
            </div>
        )}

        <table className="w-full text-left border-collapse">
            <tbody className="divide-y divide-gray-100">
                <AnimatePresence>
                {data.map(c => (
                    <ListItem 
                        key={c.n_codicentr}
                        meta={{id: c.n_codicentr}}
                        title={c.c_desccentr}
                        subtitle={`${c.n_nblocentr} Blocos registrados`}
                        icon={MapPin}
                        onClick={() => onSelect(c)}
                        canDelete={canModify}
                        onDelete={() => handleDelete(c.n_codicentr, c.c_desccentr)}
                        onInfo={() => handleInfo(c.c_desccentr)}
                    />
                ))}
                </AnimatePresence>
            </tbody>
        </table>

        <CreationModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          type="centralidade"
        />

        <AdminInfoModal 
            isOpen={infoModalOpen}
            onClose={() => setInfoModalOpen(false)}
            entityName={selectedEntityName}
            roleLabel="Admin Centralidade (C-Admin)"
        />
    </div>
  )
}
export default CentralidadeView;