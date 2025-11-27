// Auth Types
export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  role: 'admin_global' | 'admin_bloco' | 'admin_predio' | 'morador';
  token?: string;
  permissions?: string[];
}

export interface LoginResponse {
  token: string;
  user: User;
}

// Models based on PHP Eloquent classes

export interface Centralidade {
  n_codicentr: number;
  c_desccentr: string;
  n_nblocentr: number;
  n_codicoord: number;
  n_codiender: number;
  n_codiadmin: number;
}

export interface Bloco {
  n_codibloco: number;
  c_descbloco: string; // e.g., "Bloco A"
  n_nblocentr: number;
  n_codicoord: number;
  n_codicaixa: number;
  c_ruablco: string;
  n_codicentr: number;
}

export interface Predio {
  n_codipredi: number;
  c_descpredi: string;
  n_codibloco: number;
  c_nomeentid: string; // e.g., "trapredi"
  n_andares?: number; // Added for vertical scalability
}

export interface Apartamento {
  n_codiapart: number;
  c_portapart: string; // e.g., "101"
  c_tipoapart: string; // e.g., "T3"
  n_nandapart: number; // The floor number
  d_dacrapart?: string;
  n_codiconta: number;
  n_codipredi: number;
  n_codimorad?: number;
  morador?: Morador;
}

export interface Morador {
  n_codimorad: number;
  c_nomemorad: string;
  c_bi_morad: string;
  c_tel_morad: string;
  c_email_morad: string;
  // Privacy setting: if true, other residents in the building can see this profile
  is_public_profile: boolean; 
}

export interface Pagamento {
  n_codipagam: number;
  n_valopagam: number;
  d_datapagam: string; // date
  c_descric: string;
  n_codiapart: number;
  n_codidivid: number;
  status?: 'Pendente' | 'Confirmado' | 'Cancelado'; 
}

export interface Divida {
  n_codidivid: number;
  n_valodivid: number;
  c_descdivid: string;
  d_datadivid: string;
  n_codiconta: number;
}

export interface Caixa {
  n_codicaixa: number;
  n_saldcaixa: number;
  n_limicaixa: number;
  c_nomeentid: string;
  n_codientid: number;
  create_at?: string;
  updated_at?: string;
}

export interface Banco {
  n_codibanco: number;
  c_entibanco: string; 
  c_descbanco: string; 
  n_saldbanco: number;
  d_dacrbanco?: string;
  n_codicoord: number;
  n_codientid: number;
  c_nomeentid: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  sender: string;
  senderRole?: string;
  date: string;
  isRead: boolean;
  type: 'broadcast' | 'direct' | 'urgent';
  recipients?: string; // Description of recipients e.g., "Todos os moradores"
}