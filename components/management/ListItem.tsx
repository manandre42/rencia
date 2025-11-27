import React from 'react';
import { ChevronRight, Trash2, Info } from 'lucide-react';
import { motion } from 'framer-motion';

interface ListItemProps {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  onClick?: () => void;
  meta?: { id: number | string };
  action?: React.ReactNode;
  onDelete?: () => void;
  canDelete?: boolean;
  onInfo?: () => void;
}

const ListItem: React.FC<ListItemProps> = ({ title, subtitle, icon: Icon, onClick, meta, action, onDelete, canDelete = false, onInfo }) => (
  <motion.tr 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors group cursor-pointer"
    onClick={onClick}
  >
    <td className="p-4 text-gray-400 font-mono text-xs w-16">{meta?.id}</td>
    <td className="p-4 font-medium text-gray-900 flex items-center">
        <div className="bg-gray-100 p-2 rounded-md mr-3 group-hover:bg-white group-hover:shadow-sm transition-all">
          <Icon className="w-4 h-4 text-gray-500 group-hover:text-primary-600 transition-colors"/>
        </div>
        {title}
    </td>
    <td className="p-4 text-gray-600 text-sm hidden md:table-cell">{subtitle}</td>
    <td className="p-4 text-right flex justify-end items-center space-x-1">
        {onInfo && (
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onInfo();
                }}
                className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-all"
                title="Ver Informações do Administrador"
            >
                <Info className="w-4 h-4" />
            </button>
        )}
        
        {canDelete && (
           <button 
             onClick={(e) => {
               e.stopPropagation();
               if (onDelete) onDelete();
             }}
             className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all opacity-0 group-hover:opacity-100"
           >
             <Trash2 className="w-4 h-4" />
           </button>
        )}
        
        {action ? action : (
            <button className="text-primary-600 hover:bg-primary-600 hover:text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100">
                <ChevronRight className="w-4 h-4" />
            </button>
        )}
    </td>
  </motion.tr>
);

export default ListItem;