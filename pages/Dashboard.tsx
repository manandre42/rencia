import React, { useEffect, useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { ArrowUpRight, ArrowDownRight, Wallet, Users, Building, Activity, Network, Bell, ChevronRight } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { ApiService } from '../services/api';
import { Caixa, Pagamento, Notice } from '../types';
import { motion } from 'framer-motion';
import NetworkMap from '../components/NetworkMap';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [caixa, setCaixa] = useState<Caixa | null>(null);
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [recentNotices, setRecentNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNetworkMap, setShowNetworkMap] = useState(false);
  
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isMorador = user.role === 'morador';
  const isAdminGlobal = user.role === 'admin_global';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const caixaData = await ApiService.finance.getCaixa();
        const pagamentosData = await ApiService.finance.getPagamentos();
        // Fetch notices if morador
        if (isMorador) {
            const noticesData = await ApiService.notices.getAll();
            setRecentNotices(noticesData.slice(0, 3));
        }
        setCaixa(caixaData);
        setPagamentos(pagamentosData);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isMorador]);

  const chartData = [
    { name: 'Jan', receita: 4000, despesa: 2400, saldo: 1600 },
    { name: 'Fev', receita: 3000, despesa: 1398, saldo: 1602 },
    { name: 'Mar', receita: 2000, despesa: 9800, saldo: -7800 },
    { name: 'Abr', receita: 2780, despesa: 3908, saldo: -1128 },
    { name: 'Mai', receita: 1890, despesa: 4800, saldo: -2910 },
    { name: 'Jun', receita: 2390, despesa: 3800, saldo: -1410 },
    { name: 'Jul', receita: 3490, despesa: 4300, saldo: -810 },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const StatCard = ({ title, value, icon: Icon, trend, sub, onClick }: any) => (
    <motion.div 
      variants={itemVariants}
      className={`bg-white p-6 h-full flex flex-col justify-between border-t-4 border-transparent hover:border-primary-600 shadow-sm hover:shadow-lg transition-all duration-300 ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold">{title}</p>
          <h3 className="text-3xl font-light text-gray-900 mt-2 tracking-tight">{value}</h3>
        </div>
        <div className="p-2 bg-gray-100 rounded-sm">
          <Icon className="w-5 h-5 text-gray-700" />
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
         {trend !== undefined && (
            <div className={`flex items-center text-sm ${trend > 0 ? 'text-green-700' : 'text-red-600'}`}>
            {trend > 0 ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
            <span className="font-mono font-medium">{Math.abs(trend)}%</span>
            </div>
         )}
         <span className="text-xs text-gray-400">{sub || "vs mês passado"}</span>
      </div>
    </motion.div>
  );

  return (
    <PageTransition>
      <motion.div 
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex justify-between items-end pb-4 border-b border-gray-200">
          <div>
            <h1 className="text-4xl font-light text-gray-900 tracking-tight">Dashboard</h1>
            <p className="text-gray-500 mt-1 text-sm">
                Bem-vindo, <span className="font-medium text-gray-800">{user.name?.split(' ')[0]}</span>. 
                {isMorador 
                    ? " Aqui está a transparência financeira do seu condomínio."
                    : " Visão geral e administrativa do sistema."
                }
            </p>
          </div>
          <div className="flex space-x-2">
             {isAdminGlobal && (
                 <button 
                    onClick={() => setShowNetworkMap(!showNetworkMap)}
                    className={`px-4 py-2 text-sm font-medium border transition-colors flex items-center ${
                        showNetworkMap ? 'bg-carbon-900 text-white border-carbon-900' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                 >
                    <Network className="w-4 h-4 mr-2" />
                    {showNetworkMap ? 'Ocultar Mapa' : 'Mapa de Rede'}
                 </button>
             )}
            <button className="bg-primary-600 text-white px-6 py-3 text-sm font-medium hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-600 active:bg-primary-800 shadow-sm">
                Gerar Relatório Mensal
            </button>
          </div>
        </div>

        {/* Global Admin Network Map */}
        {showNetworkMap && isAdminGlobal && (
            <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="overflow-hidden"
            >
                <NetworkMap />
            </motion.div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Saldo Global" 
            value={loading ? "..." : `Kz ${new Intl.NumberFormat('pt-AO').format(caixa?.n_saldcaixa || 0)}`} 
            icon={Wallet} 
            trend={12} 
            sub="Conta do Condomínio"
          />
          <StatCard 
            title="Pagamentos Recentes" 
            value={pagamentos.length.toString()} 
            icon={Activity} 
            trend={8}
            sub="Últimos 30 dias" 
          />
          <StatCard 
            title="Total Moradores" 
            value="3,402" 
            icon={Users} 
            trend={2.4} 
            onClick={() => !isMorador && navigate('/moradores')}
          />
           <StatCard 
            title="Unidades Ativas" 
            value="89%" 
            icon={Building} 
            trend={-0.5} 
            sub="Ocupação"
            onClick={() => !isMorador && navigate('/gestao')}
          />
        </div>

        {/* Content Section: Charts or Notices for Residents */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Chart */}
          <motion.div variants={itemVariants} className="lg:col-span-2 bg-white p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-lg font-normal text-gray-900">Evolução Financeira</h3>
                <div className="flex space-x-2">
                    <span className="flex items-center text-xs text-gray-500"><span className="w-2 h-2 rounded-full bg-primary-600 mr-1"></span> Receita</span>
                    <span className="flex items-center text-xs text-gray-500"><span className="w-2 h-2 rounded-full bg-gray-800 mr-1"></span> Despesa</span>
                </div>
            </div>
            {/* Added min-w-0 to parent and minWidth to ResponsiveContainer to fix resize warnings */}
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0f62fe" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#0f62fe" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6f6f6f', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#6f6f6f', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#161616', border: 'none', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                    cursor={{ stroke: '#0f62fe', strokeWidth: 1 }}
                  />
                  <Area type="monotone" dataKey="receita" stroke="#0f62fe" strokeWidth={2} fillOpacity={1} fill="url(#colorReceita)" />
                  <Area type="monotone" dataKey="despesa" stroke="#393939" strokeWidth={2} fillOpacity={0} fill="#393939" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Sidebar Content: Notifications (Residents) or Chart (Admins) */}
          <motion.div variants={itemVariants} className="flex flex-col gap-4">
             {isMorador ? (
                 /* Notices Card for Residents */
                 <div className="bg-white p-6 shadow-sm border border-gray-100 flex-1 flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-normal text-gray-900">Notificações Recentes</h3>
                        <Bell className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                        {recentNotices.length > 0 ? (
                            recentNotices.map(notice => (
                                <div key={notice.id} className="p-3 bg-gray-50 border-l-2 border-primary-500 rounded-r-sm hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => navigate('/avisos')}>
                                    <h4 className="font-semibold text-sm text-gray-800">{notice.title}</h4>
                                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{notice.content}</p>
                                    <span className="text-[10px] text-gray-400 mt-2 block">{new Date(notice.date).toLocaleDateString()}</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-400 text-center py-4">Nenhuma notificação nova.</p>
                        )}
                    </div>
                    <button onClick={() => navigate('/avisos')} className="mt-4 w-full py-2 text-xs font-medium text-primary-600 hover:bg-primary-50 rounded transition-colors flex items-center justify-center">
                        Ver todas <ChevronRight className="w-3 h-3 ml-1"/>
                    </button>
                 </div>
             ) : (
                 /* Secondary Chart for Admins */
                 <div className="bg-white p-6 shadow-sm border border-gray-100 flex flex-col h-full">
                    <h3 className="text-lg font-normal text-gray-900 mb-2">Fluxo Líquido</h3>
                    <p className="text-sm text-gray-500 mb-6">Comparativo mensal</p>
                    <div className="flex-1 min-h-[200px] w-full min-w-0">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                        <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6f6f6f', fontSize: 10}} dy={5} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#6f6f6f', fontSize: 10}} />
                        <Tooltip cursor={{fill: '#f4f4f4'}} contentStyle={{ fontSize: '12px' }} />
                        <Bar dataKey="saldo" fill="#0f62fe" radius={[2, 2, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                    </div>
                </div>
             )}
          </motion.div>
        </div>

        {/* Recent Transactions Table Preview */}
        <motion.div variants={itemVariants} className="bg-white border border-gray-200 shadow-sm overflow-hidden">
             <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                 <h3 className="font-medium text-gray-800">Últimos Pagamentos</h3>
                 <button className="text-primary-600 text-sm hover:underline">Ver todos</button>
             </div>
             <table className="w-full text-left text-sm">
                 <thead className="bg-white text-gray-500 font-normal">
                     <tr className="border-b border-gray-200">
                         <th className="p-4 font-normal">Descrição</th>
                         <th className="p-4 font-normal">Data</th>
                         <th className="p-4 font-normal">Valor</th>
                         <th className="p-4 font-normal">Estado</th>
                     </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                     {pagamentos.slice(0, 5).map((p) => (
                         <tr key={p.n_codipagam} className="hover:bg-gray-50 transition-colors">
                             <td className="p-4 text-gray-900 font-medium">{p.c_descric}</td>
                             <td className="p-4 text-gray-500">{new Date(p.d_datapagam).toLocaleDateString()}</td>
                             <td className="p-4 text-gray-900 font-mono">Kz {p.n_valopagam.toLocaleString()}</td>
                             <td className="p-4">
                                 <span className={`px-2 py-1 text-xs font-medium border ${
                                     p.status === 'Confirmado' 
                                     ? 'bg-green-50 text-green-700 border-green-200' 
                                     : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                 }`}>
                                     {p.status}
                                 </span>
                             </td>
                         </tr>
                     ))}
                 </tbody>
             </table>
        </motion.div>
      </motion.div>
    </PageTransition>
  );
};

export default Dashboard;