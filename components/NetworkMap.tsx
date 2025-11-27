import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Layers, Building, MapPin, ChevronRight, ChevronDown, Share2 } from 'lucide-react';

// Enhanced Mock Data
const MOCK_DATA = {
    id: 'root',
    name: 'Rede Imobiliária Nacional',
    type: 'root',
    children: [
        {
            id: 'c1', name: 'Centralidade do Kilamba', type: 'centralidade',
            children: [
                { 
                    id: 'b1', name: 'Bloco A', type: 'bloco', 
                    children: [
                        {id: 'p1', name: 'Prédio 1', type: 'predio'}, 
                        {id: 'p2', name: 'Prédio 2', type: 'predio'}
                    ] 
                },
                { 
                    id: 'b2', name: 'Bloco B', type: 'bloco', 
                    children: [
                        {id: 'p3', name: 'Prédio 5', type: 'predio'}
                    ] 
                },
            ]
        },
        {
            id: 'c2', name: 'Vida Pacífica', type: 'centralidade',
            children: [
                { id: 'b4', name: 'Zango 0', type: 'bloco', children: [] }
            ]
        },
        {
            id: 'c3', name: 'Sequele', type: 'centralidade',
            children: []
        }
    ]
};

const Node = ({ data, level = 0, isLast = false }: { data: any, level?: number, isLast?: boolean }) => {
    const [isOpen, setIsOpen] = useState(false);
    const hasChildren = data.children && data.children.length > 0;

    const toggleOpen = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (hasChildren) setIsOpen(!isOpen);
    };

    const getIcon = () => {
        switch(data.type) {
            case 'root': return <Share2 className="w-5 h-5 text-gray-200" />;
            case 'centralidade': return <MapPin className="w-4 h-4 text-blue-400" />;
            case 'bloco': return <Layers className="w-4 h-4 text-purple-400" />;
            case 'predio': return <Building className="w-4 h-4 text-green-400" />;
            default: return <Building2 className="w-4 h-4 text-gray-400" />;
        }
    };

    const getStyles = () => {
         switch(data.type) {
            case 'root': return 'border-gray-500 bg-gray-800';
            case 'centralidade': return 'border-blue-500/50 bg-blue-900/10 hover:bg-blue-900/20';
            case 'bloco': return 'border-purple-500/50 bg-purple-900/10 hover:bg-purple-900/20';
            case 'predio': return 'border-green-500/50 bg-green-900/10 hover:bg-green-900/20';
            default: return 'border-gray-500 bg-gray-900';
        }
    };

    // Responsive Line Connector Logic
    // Mobile: Left borders. Desktop: Top borders.
    
    return (
        <div className={`flex flex-col ${level === 0 ? 'items-start md:items-center' : 'items-start md:items-center'} relative w-full md:w-auto`}>
            
            {/* Desktop: Vertical Line from Parent */}
            {level > 0 && (
                <div className="hidden md:block absolute -top-8 left-1/2 w-px h-8 bg-gray-700"></div>
            )}

            {/* The Node Card */}
            <motion.div 
                layout
                onClick={toggleOpen}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`
                    relative z-20 flex items-center p-3 rounded-md border backdrop-blur-md cursor-pointer transition-all 
                    ${getStyles()}
                    ${isOpen ? 'ring-1 ring-white/20 shadow-lg' : 'shadow-sm'}
                    w-full md:w-auto md:min-w-[180px] my-1 md:my-0
                `}
            >
                {/* Mobile Tree Branch Connector */}
                {level > 0 && (
                    <div className="md:hidden absolute -left-4 top-1/2 w-4 h-px bg-gray-700"></div>
                )}

                <div className={`mr-3 p-2 rounded-full bg-white/5 border border-white/10 ${data.type === 'root' ? 'hidden md:block' : ''}`}>
                    {getIcon()}
                </div>
                
                <div className="flex-1">
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider font-mono leading-none mb-1">{data.type === 'root' ? 'Rede' : data.type}</div>
                    <div className="text-sm font-medium text-gray-100 leading-tight">{data.name}</div>
                </div>
                
                {hasChildren && (
                    <div className={`ml-2 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-90 md:rotate-180' : ''}`}>
                        {isOpen ? <ChevronDown className="w-4 h-4"/> : <ChevronRight className="w-4 h-4"/>}
                    </div>
                )}
            </motion.div>

            {/* Children Container */}
            <AnimatePresence>
                {isOpen && hasChildren && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="
                            w-full md:w-auto
                            flex flex-col md:flex-row 
                            md:items-start md:justify-center
                            
                            /* Mobile Styles: Vertical Tree with Indent */
                            pl-6 ml-3 
                            border-l border-dashed border-gray-700 
                            
                            /* Desktop Styles: Horizontal Tree without Left Border */
                            md:pl-0 md:ml-0 md:border-l-0 
                            md:pt-8 md:space-x-8
                        "
                    >
                        {data.children.map((child: any, idx: number) => (
                            <div key={child.id} className="relative w-full md:w-auto pt-2 md:pt-0">
                                <Node 
                                    data={child} 
                                    level={level + 1} 
                                    isLast={idx === data.children.length - 1} 
                                />
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const NetworkMap = () => {
    return (
        <div className="w-full bg-[#111] border border-gray-800 rounded-sm overflow-hidden flex flex-col md:h-[600px] h-[500px] relative">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-10 bg-gradient-to-b from-[#111] to-transparent pointer-events-none">
                <div>
                    <h3 className="text-white font-light text-lg tracking-tight flex items-center">
                        <Share2 className="w-4 h-4 mr-2 text-primary-600"/> Mapa de Rede
                    </h3>
                    <p className="text-gray-500 text-[10px] font-mono mt-1">ESTRUTURA HIERÁRQUICA</p>
                </div>
                <div className="hidden md:flex space-x-2 pointer-events-auto">
                    {/* Legend for Desktop */}
                    <div className="flex items-center space-x-3 bg-black/40 backdrop-blur px-3 py-1 rounded border border-white/5 text-[10px]">
                        <span className="flex items-center text-gray-400"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1"></span> Centralidade</span>
                        <span className="flex items-center text-gray-400"><span className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-1"></span> Bloco</span>
                        <span className="flex items-center text-gray-400"><span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1"></span> Prédio</span>
                    </div>
                </div>
            </div>

            {/* Grid Background */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" 
                 style={{ 
                     backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', 
                     backgroundSize: '40px 40px' 
                 }}>
            </div>

            {/* Scrollable Area - Added dark-scroll class */}
            <div className="flex-1 overflow-auto p-6 pt-20 custom-scrollbar dark-scroll">
                 {/* Replaced fixed width constraints with w-fit to ensure scrollbar triggers on overflow */}
                 <div className="w-fit min-w-full md:flex md:justify-center mx-auto">
                     <Node data={MOCK_DATA} />
                 </div>
            </div>

            {/* Mobile Legend Footer */}
            <div className="md:hidden p-2 bg-[#161616] border-t border-gray-800 flex justify-around text-[10px] text-gray-400">
                <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-blue-500 mr-1"></span> Centr.</span>
                <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-purple-500 mr-1"></span> Bloco</span>
                <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span> Prédio</span>
            </div>
        </div>
    );
};

export default NetworkMap;