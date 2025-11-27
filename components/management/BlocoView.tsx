import React, { useEffect, useState } from 'react';
import { Layers, Plus, DoorOpen } from 'lucide-react';
import { ApiService } from '../../services/api';
import ListItem from './ListItem';
import { Bloco, Centralidade } from '../../types';
import { AnimatePresence } from 'framer-motion';
import CreationModal from './CreationModal';
import { useNotification } from '../NotificationSystem';
import AdminInfoModal from './AdminInfoModal';

interface Props {
  centralidade: Centralidade;
  onSelect: (b: Bloco) => void;
  userRole: string;
}

const BlocoView: React.FC<Props> = ({ centralidade, onSelect, userRole }) => {
  const [data, setData] = useState<Bloco[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Admin Info Modal State
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [selectedEntityName, setSelectedEntityName] = useState('');

  const { showToast, confirm } = useNotification();

  useEffect(() => {
    setLoading(true);
    ApiService.blocos.getByCentralidade(centralidade.n_codicentr).then(res => {
        setData(res);
        setLoading(false);
    });
  }, [centralidade]);

  const handleDelete = (id: number, name: string) => {
    confirm({
        title: 'Excluir Bloco',
        message: `Tem certeza que deseja excluir "${name}"?`,
        isDestructive: true,
        onConfirm: () => {
            setData(prev => prev.filter(item => item.n_codibloco !== id));
            showToast('Bloco excluído com sucesso.', 'success');
        }
    });
  };

  const handleInfo = (name: string) => {
      setSelectedEntityName(name);
      setInfoModalOpen(true);
  };

  // Only Global Admin can add Blocos/Quarteirões
  const canModify = userRole === 'admin_global';

  return (
    <div className="min-h-[400px]">
        <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-b border-gray-200">
            <div className="flex flex-col">
                 <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Blocos</h2>
                 <span className="text-[10px] text-gray-400 font-mono">EM: {centralidade.c_desccentr}</span>
            </div>
             {canModify && (
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-carbon-900 text-white px-3 py-1.5 text-xs font-medium hover:bg-carbon-800 transition-all flex items-center shadow-sm rounded-sm"
                >
                    <Plus className="w-3 h-3 mr-1"/>
                    Cadastrar bloco
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
                Nenhum bloco encontrado nesta centralidade.
            </div>
        )}

        <table className="w-full text-left border-collapse">
            <tbody className="divide-y divide-gray-100">
                <AnimatePresence>
                {data.map(b => (
                    <ListItem 
                        key={b.n_codibloco}
                        meta={{id: b.n_codibloco}}
                        title={b.c_descbloco}
                        subtitle={b.c_ruablco}
                        icon={Layers}
                        onClick={() => onSelect(b)}
                        canDelete={canModify}
                        onDelete={() => handleDelete(b.n_codibloco, b.c_descbloco)}
                        onInfo={() => handleInfo(b.c_descbloco)}
                    />
                ))}
                </AnimatePresence>
            </tbody>
        </table>

        <CreationModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          type="bloco"
          parentName={centralidade.c_desccentr}
        />

        <AdminInfoModal 
            isOpen={infoModalOpen}
            onClose={() => setInfoModalOpen(false)}
            entityName={selectedEntityName}
            roleLabel="Admin Bloco (B-Admin)"
        />
    </div>
  )
}
export default BlocoView;