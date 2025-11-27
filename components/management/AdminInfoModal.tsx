import React from 'react';
import Modal from '../Modal';
import { User, Mail, Phone, ShieldCheck, MapPin } from 'lucide-react';

interface AdminInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityName: string;
  roleLabel: string;
  data?: {
    name: string;
    email: string;
    phone: string;
    role?: string;
  };
}

const AdminInfoModal: React.FC<AdminInfoModalProps> = ({ isOpen, onClose, entityName, roleLabel, data }) => {
  // Use provided data or generate mock data based on entity name
  const info = data || {
    name: `Admin ${entityName.split(' ').slice(0, 2).join(' ')}`,
    email: `admin.${entityName.toLowerCase().replace(/\s/g, '.').replace(/[^\w.]/g, '')}@sistema.com`,
    phone: '+244 923 000 000',
    role: roleLabel
  };

  const isResident = roleLabel.includes('Morador');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isResident ? "Informações do Morador" : "Informações do Administrador"}>
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center py-4 border-b border-gray-100">
           <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${isResident ? 'bg-green-100 text-green-700' : 'bg-carbon-100 text-carbon-600'}`}>
             <User className="w-8 h-8" />
           </div>
           <h3 className="text-lg font-semibold text-gray-900">{info.name}</h3>
           <span className={`px-3 py-1 text-xs rounded-full font-medium mt-1 border ${
               isResident 
               ? 'bg-green-50 text-green-700 border-green-100' 
               : 'bg-blue-50 text-primary-700 border-blue-100'
            }`}>
             {info.role || roleLabel}
           </span>
        </div>

        <div className="space-y-4">
            <div className="bg-gray-50 p-3 rounded-sm border border-gray-100 flex items-center">
                {isResident ? <MapPin className="w-5 h-5 text-gray-400 mr-3" /> : <ShieldCheck className="w-5 h-5 text-gray-400 mr-3" />}
                <div>
                    <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">{isResident ? "Residência" : "Responsável Por"}</p>
                    <p className="text-sm font-medium text-gray-800">{entityName}</p>
                </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-sm border border-gray-100 flex items-center">
                <Mail className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                    <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">{isResident ? "Email Pessoal" : "Email Corporativo"}</p>
                    <a href={`mailto:${info.email}`} className="text-sm font-medium text-primary-600 hover:underline">
                        {info.email}
                    </a>
                </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-sm border border-gray-100 flex items-center">
                <Phone className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                    <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">Telefone</p>
                    <p className="text-sm font-medium text-gray-800">{info.phone}</p>
                </div>
            </div>
        </div>

        <div className="flex justify-end pt-2">
            <button 
                onClick={onClose}
                className="w-full bg-carbon-900 text-white py-2 rounded-sm text-sm font-medium hover:bg-carbon-800 transition-colors"
            >
                Fechar
            </button>
        </div>
      </div>
    </Modal>
  );
};

export default AdminInfoModal;