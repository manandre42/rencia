import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { User, Mail, Lock, Phone } from 'lucide-react';
import { useNotification } from './NotificationSystem';
import { ApiService } from '../services/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileSettingsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const { showToast } = useNotification();
  const [user, setUser] = useState<any>({});
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (isOpen) {
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        setUser(storedUser);
        setFormData(prev => ({
            ...prev,
            name: storedUser.name || '',
            email: storedUser.email || '',
            phone: storedUser.phone || ''
        }));
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
        showToast("As senhas não coincidem.", "error");
        return;
    }

    setLoading(true);

    try {
        await ApiService.auth.updateProfile(formData);
        showToast("Perfil atualizado com sucesso!", "success");
        
        // Update local storage
        const updatedUser = { ...user, name: formData.name, email: formData.email };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        onClose();
    } catch (e) {
        showToast("Erro ao atualizar perfil.", "error");
    } finally {
        setLoading(false);
    }
  };

  const InputField = ({ label, name, icon: Icon, type = "text", value, onChange, placeholder }: any) => (
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
          className="w-full pl-10 pr-3 py-2 bg-gray-50 border-b-2 border-gray-200 focus:border-primary-600 focus:outline-none transition-colors text-sm text-gray-900 placeholder-gray-400"
          placeholder={placeholder}
        />
      </div>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Configurações de Perfil">
      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div className="flex flex-col items-center justify-center mb-6">
            <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-light mb-2 shadow-lg">
                {user.name ? user.name.charAt(0).toUpperCase() : <User />}
            </div>
            <p className="text-sm text-gray-500">{user.role === 'morador' ? 'Morador' : 'Administrador'}</p>
        </div>

        <div className="space-y-4">
            <h4 className="text-xs font-semibold text-gray-800 uppercase border-b border-gray-100 pb-2">Dados Pessoais</h4>
            <InputField label="Nome Completo" name="name" icon={User} value={formData.name} onChange={handleChange} />
            <InputField label="Email" name="email" icon={Mail} type="email" value={formData.email} onChange={handleChange} />
            <InputField label="Telefone" name="phone" icon={Phone} value={formData.phone} onChange={handleChange} placeholder="+244..." />
        </div>

        <div className="space-y-4">
            <h4 className="text-xs font-semibold text-gray-800 uppercase border-b border-gray-100 pb-2 mt-6">Segurança</h4>
            <InputField label="Senha Atual" name="currentPassword" icon={Lock} type="password" value={formData.currentPassword} onChange={handleChange} placeholder="Obrigatório para alterações" />
            <div className="grid grid-cols-2 gap-4">
                <InputField label="Nova Senha" name="newPassword" icon={Lock} type="password" value={formData.newPassword} onChange={handleChange} placeholder="Opcional" />
                <InputField label="Confirmar Senha" name="confirmPassword" icon={Lock} type="password" value={formData.confirmPassword} onChange={handleChange} placeholder="Repita a nova senha" />
            </div>
        </div>

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
            className="px-6 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-sm shadow-sm transition-all disabled:opacity-50"
          >
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ProfileSettingsModal;