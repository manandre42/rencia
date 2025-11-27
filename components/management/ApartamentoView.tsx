import React, { useEffect, useState } from 'react';
import { UserCircle, Plus, DoorOpen, MoreHorizontal } from 'lucide-react';
import { ApiService } from '../../services/api';
import { Predio, Apartamento } from '../../types';
import { AnimatePresence, motion } from 'framer-motion';
import CreationModal from './CreationModal';
import { useNotification } from '../NotificationSystem';
import AdminInfoModal from './AdminInfoModal';
import ListItem from './ListItem'; // Reusing ListItem for consistency or keep table layout? Using table layout but with info logic.

interface Props {
  predio: Predio;
  userRole: string;
}

const ApartamentoView: React.FC<Props> = ({ predio, userRole }) => {
  const [data, setData] = useState<Apartamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showToast, confirm } = useNotification();
  
  // Info Modal State
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [selectedResident, setSelectedResident] = useState<any>(null);
  const [selectedUnit, setSelectedUnit] = useState('');

  useEffect(() => {
    setLoading(true);
    // Simulating API call for apartments
    setTimeout(() => {
        const mockApts: Apartamento[] = Array.from({length: 12}).map((_, i) => ({
            n_codiapart: i + 1,
            c_portapart: `${Math.floor(i/4) + 1}0${(i%4)+1}`,
            c_tipoapart: i % 2 === 0 ? 'T3' : 'T4',
            n_nandapart: Math.floor(i/4) + 1,
            n_codiconta: i,
            n_codipredi: predio.n_codipredi,
            morador: i % 3 === 0 ? {
              n_codimorad: i,
              c_nomemorad: "Morador Oculto",
              c_bi_morad: "...",
              c_tel_morad: "...",
              c_email_morad: "...",
              is_public_profile: false
            } : {
              n_codimorad: i,
              c_nomemorad: `Morador Exemplo ${i}`,
              c_bi_morad: "00123LA012",
              c_tel_morad: "923 456 789",
              c_email_morad: `morador.${i}@email.com`,
              is_public_profile: true
            }
        }));
        setData(mockApts);
        setLoading(false);
    }, 500);
  }, [predio]);

  const handleDelete = (id: number, name: string) => {
    confirm({
        title: 'Remover Morador/Apartamento',
        message: `Tem certeza que deseja remover o apartamento "${name}"?`,
        isDestructive: true,
        onConfirm: () => {
             setData(prev => prev.filter(item => item.n_codiapart !== id));
             showToast('Apartamento removido com sucesso.', 'success');
        }
    });
  };

  const handleInfo = (apt: Apartamento) => {
      if (apt.morador) {
          setSelectedResident({
              name: apt.morador.c_nomemorad,
              email: apt.morador.c_email_morad,
              phone: apt.morador.c_tel_morad,
              role: 'Morador'
          });
          setSelectedUnit(`Apt ${apt.c_portapart} - ${predio.c_descpredi}`);
          setInfoModalOpen(true);
      } else {
          showToast('Este apartamento está vago.', 'info');
      }
  };

  // Global, Bloco, and Predio Admin can add Apartments
  const canAdd = ['admin_global', 'admin_bloco', 'admin_predio'].includes(userRole);
  const isAdmin = userRole.startsWith('admin');

  return (
    <div className="min-h-[400px]">
        <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-b border-gray-200">
             <div className="flex flex-col">
                 <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Apartamentos</h2>
                 <span className="text-[10px] text-gray-400 font-mono">EM: {predio.c_descpredi}</span>
            </div>
             {canAdd && (
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-carbon-900 text-white px-3 py-1.5 text-xs font-medium hover:bg-carbon-800 transition-all flex items-center shadow-sm rounded-sm"
                >
                    <Plus className="w-3 h-3 mr-1"/>
                    Cadastrar apartamento
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
                Nenhum apartamento encontrado.
            </div>
        )}

        <table className="w-full text-left border-collapse">
            <tbody className="divide-y divide-gray-100">
                <AnimatePresence>
                {data.map(a => {
                    // Logic: Admins see all. Residents see only Public Profiles.
                    const isVisible = isAdmin || (a.morador && a.morador.is_public_profile);
                    const displayName = isVisible && a.morador ? a.morador.c_nomemorad : (a.morador ? "Privado" : "Vago");
                    const hasInfo = isVisible && a.morador;

                    return (
                    <motion.tr 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        key={a.n_codiapart} 
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                        <td className="p-4 text-gray-400 font-mono text-xs w-16">{a.c_portapart}</td>
                        <td className="p-4" onClick={() => hasInfo && handleInfo(a)} style={{cursor: hasInfo ? 'pointer' : 'default'}}>
                            <div className="flex items-center group">
                                <div className={`p-2 rounded-full mr-3 ${isVisible && a.morador ? 'bg-green-100 text-green-700 group-hover:bg-green-200' : 'bg-gray-100 text-gray-400'}`}>
                                    <UserCircle className="w-5 h-5"/>
                                </div>
                                <div>
                                    <div className={`text-sm font-medium ${isVisible ? 'text-gray-900 group-hover:text-primary-600' : 'text-gray-400 italic'}`}>
                                        {displayName}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {a.c_tipoapart} • Andar {a.n_nandapart}
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td className="p-4 hidden md:table-cell text-right">
                            {a.morador && !a.morador.is_public_profile && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-500 text-[10px] rounded border border-gray-200 uppercase tracking-wide">Privado</span>
                            )}
                            {a.morador && a.morador.is_public_profile && (
                                <span className="px-2 py-1 bg-blue-50 text-primary-700 text-[10px] rounded border border-blue-100 uppercase tracking-wide">Visível</span>
                            )}
                        </td>
                        <td className="p-4 text-right flex justify-end gap-2 items-center">
                             {canAdd && (
                                <button 
                                    onClick={() => handleDelete(a.n_codiapart, a.c_portapart)}
                                    className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-gray-100"
                                >
                                    <MoreHorizontal className="w-4 h-4"/>
                                </button>
                             )}
                        </td>
                    </motion.tr>
                )})}
                </AnimatePresence>
            </tbody>
        </table>

        <CreationModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          type="apartamento"
          parentName={predio.c_descpredi}
        />

        <AdminInfoModal 
            isOpen={infoModalOpen}
            onClose={() => setInfoModalOpen(false)}
            entityName={selectedUnit}
            roleLabel="Morador"
            data={selectedResident}
        />
    </div>
  )
}
export default ApartamentoView;