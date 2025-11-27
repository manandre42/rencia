import React from 'react';
import { motion } from 'framer-motion';
import { Building2 } from 'lucide-react';

const SplashScreen: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-carbon-900 text-white"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-primary-600/30">
          <Building2 className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-light tracking-widest mb-2">TRANSPARÊNCIA</h1>
        <div className="h-1 w-16 bg-primary-600 rounded-full mb-4"></div>
        <p className="text-gray-400 text-sm tracking-wide">Gestão Inteligente</p>
      </motion.div>
    </motion.div>
  );
};

export default SplashScreen;