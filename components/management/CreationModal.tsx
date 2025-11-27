import React, { useState } from 'react';
import Modal from '../Modal';
import { User, Mail, Lock, Building, MapPin, Hash, Phone, CreditCard } from 'lucide-react';
import { useNotification } from '../NotificationSystem';

type EntityType = 'centralidade' | 'bloco' | 'predio' | 'apartamento';

interface CreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: EntityType;
  parentName?: string;
}

// --- Helper Component Defined Outside to prevent Focus Loss ---
const InputField = ({ label, name, icon: Icon, type = "text", placeholder, required = true, value, onChange }: any) => (
    <div className="space-y-1">
      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full pl-10 pr-3 py-2 bg-gray-50 border-b-2 border-gray-200 focus:border-primary-600 focus:outline-none transition-colors text-sm text-gray-900 placeholder-gray-400"
          placeholder={placeholder}
        />
      </div>
    </div>
);

const CreationModal: React.FC<CreationModalProps> = ({ isOpen, onClose, type, parentName }) => {
  const [loading, setLoading] = useState(false);
  const { showToast } = useNotification();
  
  // Generic form state
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    floors: '',
    door: '',
    type: 'T3',
    // Admin/Resident Data
    adminName: '',
    adminEmail: '',
    adminPassword: '',
    // Resident specific
    resBI: '',
    resPhone: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      console.log(`Created ${type}`, formData);
      
      const entityName = formData.name || formData.door || 'Nova unidade';
      showToast(`${entityName} cadastrado com sucesso!`, 'success');
      
      onClose();
      // Reset form if needed, though unmount usually handles it
    }, 1500);
  };

  const getTitle = () => {
    switch (type) {
      case 'centralidade': return 'Nova Centralidade';
      case 'bloco': return 'Novo Bloco / Quarteirão';
      case 'predio': return 'Novo Prédio';
      case 'apartamento': return 'Novo Apartamento';
      default: return 'Novo Registro';
    }
  };

  const getAdminLabel = () => {
    switch (type) {
      case 'centralidade': return 'Administrador de Centralidade (C-Admin)';
      case 'bloco': return 'Administrador de Bloco (B-Admin)';
      case 'predio': return 'Administrador de Prédio (P-Admin)';
      default: return 'Administrador';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getTitle()}>
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Context Info */}
        {parentName && (
           <div className="bg-blue-50 p-3 rounded text-xs text-blue-800 flex items-center">
             <span className="font-semibold mr-1">Vinculado a:</span> {parentName}
           </div>
        )}

        {/* Entity Details Section */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-800 border-l-4 border-primary-600 pl-2">Dados da Unidade</h4>
          
          {type === 'centralidade' && (
            <>
              <InputField label="Nome da Centralidade" name="name" icon={Building} value={formData.name} onChange={handleChange} placeholder="Ex: Centralidade do Kilamba" />
              <InputField label="Localização / Província" name="address" icon={MapPin} value={formData.address} onChange={handleChange} placeholder="Ex: Luanda, Belas" />
            </>
          )}

          {type === 'bloco' && (
            <>
              <InputField label="Nome do Bloco / Quarteirão" name="name" icon={Building} value={formData.name} onChange={handleChange} placeholder="Ex: Bloco A" />
              <InputField label="Rua / Endereço" name="address" icon={MapPin} value={formData.address} onChange={handleChange} placeholder="Ex: Rua 5" />
            </>
          )}

          {type === 'predio' && (
            <>
              <InputField label="Nome / Número do Prédio" name="name" icon={Building} value={formData.name} onChange={handleChange} placeholder="Ex: Prédio 12" />
              <div className="grid grid-cols-2 gap-4">
                  <InputField label="Entidade Gestora" name="address" icon={Building} value={formData.address} onChange={handleChange} placeholder="Ex: Trapredi" />
                  <InputField label="Nº de Andares" name="floors" icon={Hash} type="number" value={formData.floors} onChange={handleChange} placeholder="Ex: 12" />
              </div>
            </>
          )}

          {type === 'apartamento' && (
            <div className="grid grid-cols-2 gap-4">
               <InputField label="Nº da Porta" name="door" icon={Hash} value={formData.door} onChange={handleChange} placeholder="Ex: 102" />
               <InputField label="Andar" name="floors" icon={Hash} type="number" value={formData.floors} onChange={handleChange} placeholder="Ex: 1" />
               <div className="space-y-1 col-span-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Tipologia</label>
                  <select 
                    name="type" 
                    value={formData.type} 
                    onChange={handleChange}
                    className="w-full pl-3 pr-3 py-2 bg-gray-50 border-b-2 border-gray-200 focus:border-primary-600 focus:outline-none transition-colors text-sm text-gray-900"
                  >
                    <option value="T2">T2</option>
                    <option value="T3">T3</option>
                    <option value="T4">T4</option>
                    <option value="T5">T5</option>
                    <option value="Penthouse">Penthouse</option>
                  </select>
               </div>
            </div>
          )}
        </div>

        {/* User Linking Section */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <h4 className="text-sm font-semibold text-gray-800 border-l-4 border-gray-800 pl-2">
            {type === 'apartamento' ? 'Vincular Morador' : getAdminLabel()}
          </h4>
          
          {type !== 'apartamento' ? (
            /* Admin Fields */
            <>
              <InputField label="Nome Completo" name="adminName" icon={User} value={formData.adminName} onChange={handleChange} placeholder="Nome do Administrador" />
              <InputField label="Email Corporativo" name="adminEmail" icon={Mail} type="email" value={formData.adminEmail} onChange={handleChange} placeholder="admin@sistema.com" />
              <InputField label="Senha Inicial" name="adminPassword" icon={Lock} type="password" value={formData.adminPassword} onChange={handleChange} placeholder="••••••••" />
            </>
          ) : (
            /* Resident Fields */
            <>
               <InputField label="Nome do Morador" name="adminName" icon={User} value={formData.adminName} onChange={handleChange} placeholder="Nome do Responsável" />
               <div className="grid grid-cols-2 gap-4">
                  <InputField label="BI / Identificação" name="resBI" icon={CreditCard} value={formData.resBI} onChange={handleChange} placeholder="000123..." />
                  <InputField label="Telefone" name="resPhone" icon={Phone} value={formData.resPhone} onChange={handleChange} placeholder="923..." />
               </div>
               <InputField label="Email" name="adminEmail" icon={Mail} type="email" value={formData.adminEmail} onChange={handleChange} placeholder="email@exemplo.com" />
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end pt-4 space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-sm transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-sm shadow-sm transition-all disabled:opacity-50 flex items-center"
          >
            {loading ? 'Processando...' : 'Confirmar Cadastro'}
          </button>
        </div>

      </form>
    </Modal>
  );
};

export default CreationModal;