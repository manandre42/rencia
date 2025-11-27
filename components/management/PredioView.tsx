import React, { useEffect, useState } from 'react';
import { Building, Plus, DoorOpen } from 'lucide-react';
import { ApiService } from '../../services/api';
import ListItem from './ListItem';
import { Predio, Bloco } from '../../types';
import { AnimatePresence } from 'framer-motion';
import CreationModal from './CreationModal';
import { useNotification } from '../NotificationSystem';
import AdminInfoModal from './AdminInfoModal';

interface Props {
  bloco: Bloco;
  onSelect: (p: Predio) => void;
  userRole: string;
}

const PredioView: React.FC<Props> = ({ bloco, onSelect, userRole }) => {
  const [data, setData] = useState<Predio[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Admin Info Modal State
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [selectedEntityName, setSelectedEntityName] = useState('');

  const { showToast, confirm } = useNotification();

  useEffect(() => {
    setLoading(true);
    ApiService.predios.getByBloco(bloco.n_codibloco).then(res => {
        setData(res);
        setLoading(false);
    });
  }, [bloco]);

  const handleDelete = (id: number, name: string) => {
    confirm({
        title: 'Excluir Prédio',
        message: `Tem certeza que deseja excluir "${name}"?`,
        isDestructive: true,
        onConfirm: () => {
            setData(prev => prev.filter(item => item.n_codipredi !== id));
            showToast('Prédio excluído com sucesso.', 'success');
        }
    });
  };

  const handleInfo = (name: string) => {
      setSelectedEntityName(name);
      setInfoModalOpen(true);
  };

  // Global Admin and Bloco Admin can add Buildings
  const canModify = userRole === 'admin_global' || userRole === 'admin_bloco';

  return (
    <div className="min-h-[400px]">
        <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-b border-gray-200">
            <div className="flex flex-col">
                 <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Prédios</h2>
                 <span className="text-[10px] text-gray-400 font-mono">EM: {bloco.c_descbloco}</span>
            </div>
             {canModify && (
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-carbon-900 text-white px-3 py-1.5 text-xs font-medium hover:bg-carbon-800 transition-all flex items-center shadow-sm rounded-sm"
                >
                    <Plus className="w-3 h-3 mr-1"/>
                    Cadastrar predio
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
                Nenhum prédio encontrado neste bloco.
            </div>
        )}

        <table className="w-full text-left border-collapse">
            <tbody className="divide-y divide-gray-100">
                <AnimatePresence>
                {data.map(p => (
                    <ListItem 
                        key={p.n_codipredi}
                        meta={{id: p.n_codipredi}}
                        title={p.c_descpredi}
                        subtitle={`Entidade Gestora: ${p.c_nomeentid}`}
                        icon={Building}
                        onClick={() => onSelect(p)}
                        canDelete={canModify}
                        onDelete={() => handleDelete(p.n_codipredi, p.c_descpredi)}
                        onInfo={() => handleInfo(p.c_descpredi)}
                    />
                ))}
                </AnimatePresence>
            </tbody>
        </table>

        <CreationModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          type="predio"
          parentName={bloco.c_descbloco}
        />

        <AdminInfoModal 
            isOpen={infoModalOpen}
            onClose={() => setInfoModalOpen(false)}
            entityName={selectedEntityName}
            roleLabel="Admin Prédio (P-Admin)"
        />
    </div>
  )
}
export default PredioView;