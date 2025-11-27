import React, { useState } from 'react';
import PageTransition from '../components/PageTransition';
import { Centralidade, Bloco, Predio } from '../types';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import CentralidadeView from '../components/management/CentralidadeView';
import BlocoView from '../components/management/BlocoView';
import PredioView from '../components/management/PredioView';
import ApartamentoView from '../components/management/ApartamentoView';

const Management = () => {
  // Navigation Stack State
  const [level, setLevel] = useState<'centralidades' | 'blocos' | 'predios' | 'apartamentos'>('centralidades');
  
  // Selection Context
  const [selectedCentr, setSelectedCentr] = useState<Centralidade | null>(null);
  const [selectedBloco, setSelectedBloco] = useState<Bloco | null>(null);
  const [selectedPredio, setSelectedPredio] = useState<Predio | null>(null);

  // User Role
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = user.role;

  const navigateToBlocos = (c: Centralidade) => {
    setSelectedCentr(c);
    setLevel('blocos');
  };

  const navigateToPredios = (b: Bloco) => {
    setSelectedBloco(b);
    setLevel('predios');
  };

  const navigateToApartamentos = (p: Predio) => {
      setSelectedPredio(p);
      setLevel('apartamentos');
  }

  const handleBack = () => {
      if (level === 'apartamentos') { setLevel('predios'); setSelectedPredio(null); }
      else if (level === 'predios') { setLevel('blocos'); setSelectedBloco(null); }
      else if (level === 'blocos') { setLevel('centralidades'); setSelectedCentr(null); }
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
                <h1 className="text-3xl font-light text-gray-900 tracking-tight">Gestão de Unidades</h1>
                <p className="text-gray-500 mt-1 text-sm">Gerencie a hierarquia de centralidades, blocos, prédios e moradores.</p>
            </div>
        </div>

        {/* Breadcrumb Navigation */}
        <div className="bg-white p-2 md:p-4 border-b border-gray-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between overflow-x-auto rounded-t-sm">
            <div className="flex items-center space-x-1 text-sm whitespace-nowrap">
                <button onClick={() => { setLevel('centralidades'); setSelectedCentr(null); setSelectedBloco(null); setSelectedPredio(null); }} className={`px-2 py-1 rounded hover:bg-gray-100 ${level === 'centralidades' ? 'font-semibold text-primary-600' : 'text-gray-500'}`}>Centralidades</button>
                {selectedCentr && <ChevronRight className="w-4 h-4 text-gray-300"/>}
                
                {selectedCentr && (
                    <button onClick={() => { setLevel('blocos'); setSelectedBloco(null); setSelectedPredio(null); }} className={`px-2 py-1 rounded hover:bg-gray-100 ${level === 'blocos' ? 'font-semibold text-primary-600' : 'text-gray-500'}`}>{selectedCentr.c_desccentr}</button>
                )}
                {selectedBloco && <ChevronRight className="w-4 h-4 text-gray-300"/>}
                
                {selectedBloco && (
                    <button onClick={() => { setLevel('predios'); setSelectedPredio(null); }} className={`px-2 py-1 rounded hover:bg-gray-100 ${level === 'predios' ? 'font-semibold text-primary-600' : 'text-gray-500'}`}>{selectedBloco.c_descbloco}</button>
                )}
                {selectedPredio && <ChevronRight className="w-4 h-4 text-gray-300"/>}

                {selectedPredio && (
                    <span className="px-2 py-1 font-semibold text-primary-600">{selectedPredio.c_descpredi}</span>
                )}
            </div>
            
            {level !== 'centralidades' && (
                <button onClick={handleBack} className="mt-2 md:mt-0 text-xs flex items-center text-gray-500 hover:text-gray-900 uppercase font-bold tracking-wider">
                    <ArrowLeft className="w-3 h-3 mr-1"/> Voltar
                </button>
            )}
        </div>

        {/* Main Content Area */}
        <div className="bg-white border border-gray-200 min-h-[500px] relative shadow-sm rounded-b-sm overflow-hidden">
            {level === 'centralidades' && (
                <CentralidadeView onSelect={navigateToBlocos} userRole={userRole} />
            )}
            {level === 'blocos' && selectedCentr && (
                <BlocoView centralidade={selectedCentr} onSelect={navigateToPredios} userRole={userRole} />
            )}
            {level === 'predios' && selectedBloco && (
                <PredioView bloco={selectedBloco} onSelect={navigateToApartamentos} userRole={userRole} />
            )}
            {level === 'apartamentos' && selectedPredio && (
                <ApartamentoView predio={selectedPredio} userRole={userRole} />
            )}
        </div>
      </div>
    </PageTransition>
  );
};

export default Management;