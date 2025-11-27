import axios from 'axios';
import { 
  LoginResponse, 
  Centralidade, 
  Bloco, 
  Predio, 
  Apartamento, 
  Pagamento, 
  Divida, 
  Caixa,
  User,
  Notice
} from '../types';

// Configuration
const API_URL = 'http://transparencia.arksoft-angola.com/api';
// FORCE MOCK FOR DEMO PURPOSES since we cannot access the real API from here
const USE_MOCK = true; 

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- MOCK DATA GENERATORS ---
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const mockAdmin: User = {
  id: 1,
  name: "Administrador Sistema",
  email: "admin@transparencia.com",
  username: "admin",
  role: "admin_global",
  token: "mock-jwt-token-xyz-123"
};

const mockMorador: User = {
  id: 2,
  name: "Manuel Joaquim",
  email: "manuel@email.com",
  username: "morador",
  role: "morador",
  token: "mock-jwt-token-abc-456"
};

const mockCaixa: Caixa = {
  n_codicaixa: 1,
  n_saldcaixa: 12500000.00,
  n_limicaixa: 50000,
  c_nomeentid: "trapredi",
  n_codientid: 1,
  updated_at: "2024-05-20T10:00:00Z"
};

const mockPagamentos: Pagamento[] = Array.from({ length: 15 }).map((_, i) => ({
  n_codipagam: i + 1,
  n_valopagam: Math.floor(Math.random() * 50000) + 5000,
  d_datapagam: new Date(2024, 4, Math.floor(Math.random() * 30) + 1).toISOString(),
  c_descric: `Pagamento de Condomínio Ref ${202400 + i}`,
  n_codiapart: Math.floor(Math.random() * 50) + 1,
  n_codidivid: i + 100,
  status: Math.random() > 0.8 ? 'Pendente' : 'Confirmado'
}));

const mockCentralidades: Centralidade[] = [
  { n_codicentr: 1, c_desccentr: 'Centralidade do Kilamba', n_nblocentr: 24, n_codicoord: 1, n_codiender: 1, n_codiadmin: 1 },
  { n_codicentr: 2, c_desccentr: 'Vida Pacífica (Zango 0)', n_nblocentr: 18, n_codicoord: 2, n_codiender: 2, n_codiadmin: 1 },
  { n_codicentr: 3, c_desccentr: 'Centralidade do Sequele', n_nblocentr: 30, n_codicoord: 3, n_codiender: 3, n_codiadmin: 1 },
];

const mockBlocos = (centrId: number): Bloco[] => Array.from({ length: 8 }).map((_, i) => ({
  n_codibloco: (centrId * 100) + i,
  c_descbloco: `Bloco ${String.fromCharCode(65 + i)}`,
  n_nblocentr: 1,
  n_codicoord: 1,
  n_codicaixa: 1,
  c_ruablco: `Rua ${i + 1}`,
  n_codicentr: centrId
}));

const mockPredios = (blocoId: number): Predio[] => Array.from({ length: 4 }).map((_, i) => ({
  n_codipredi: (blocoId * 100) + i,
  c_descpredi: `Prédio ${i + 1}`,
  n_codibloco: blocoId,
  c_nomeentid: 'trapredi'
}));

const mockNotices: Notice[] = [
    {
        id: '1',
        title: 'Manutenção do Elevador',
        content: 'Informamos que o elevador do Bloco A estará em manutenção no dia 25/05.',
        sender: 'Administração',
        senderRole: 'admin_bloco',
        date: new Date().toISOString(),
        isRead: false,
        type: 'broadcast',
        recipients: 'Todos os moradores'
    },
    {
        id: '2',
        title: 'Reunião de Condomínio',
        content: 'Convocatória para reunião geral na próxima sexta-feira às 18h.',
        sender: 'Admin Global',
        senderRole: 'admin_global',
        date: new Date(Date.now() - 86400000).toISOString(),
        isRead: true,
        type: 'urgent',
        recipients: 'Todos os moradores'
    }
];

// --- API SERVICE ---

export const ApiService = {
  auth: {
    login: async (credentials: any) => {
      if (USE_MOCK) {
        await delay(800);
        
        // Check for morador
        if (credentials.username.toLowerCase() === 'morador') {
            return {
                token: mockMorador.token!,
                user: mockMorador
            };
        }

        // Simulate success for any other non-empty credentials as admin
        if (credentials.username && credentials.password) {
            return {
                token: mockAdmin.token!,
                user: mockAdmin
            };
        }
        throw new Error('Invalid Credentials');
      }
      const response = await api.post<LoginResponse>('/auth/login', credentials);
      return response.data;
    },
    me: async () => {
        if (USE_MOCK) return mockAdmin;
        const response = await api.get('/auth/me');
        return response.data;
    },
    logout: async () => {
       // Local cleanup handled in component
       if (!USE_MOCK) await api.post('/auth/logout');
    },
    updateProfile: async (data: any) => {
        if (USE_MOCK) { await delay(1000); return true; }
        // const response = await api.put('/auth/profile', data);
        return true;
    }
  },
  centralidades: {
    getAll: async () => {
      if (USE_MOCK) { await delay(500); return mockCentralidades; }
      const response = await api.get<Centralidade[]>('/centralidades');
      return response.data;
    }
  },
  blocos: {
    getByCentralidade: async (idCentr: number) => {
      if (USE_MOCK) { await delay(300); return mockBlocos(idCentr); }
      const response = await api.get<Bloco[]>(`/blocos/centralidade/${idCentr}`);
      return response.data;
    }
  },
  predios: {
    getByBloco: async (idBloco: number) => {
      if (USE_MOCK) { await delay(300); return mockPredios(idBloco); }
      const response = await api.get<Predio[]>(`/predios/bloco/${idBloco}`);
      return response.data;
    }
  },
  finance: {
    getPagamentos: async () => {
      if (USE_MOCK) { await delay(600); return mockPagamentos; }
      const response = await api.get<Pagamento[]>('/pagamentos');
      return response.data;
    },
    getCaixa: async () => {
      if (USE_MOCK) { await delay(400); return mockCaixa; }
      const response = await api.get<Caixa>('/caixas/coord');
      return response.data;
    }
  },
  notices: {
      getAll: async () => {
          if (USE_MOCK) { await delay(400); return mockNotices; }
          // return api.get...
          return mockNotices;
      },
      create: async (notice: Partial<Notice>) => {
          if (USE_MOCK) { await delay(600); return { ...notice, id: Math.random().toString() }; }
          return { ...notice, id: 'new' };
      }
  }
};

export default api;