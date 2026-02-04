import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Only create client if env vars are available
export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export const isSupabaseConfigured = !!supabase;

export type Revendedor = {
  id: number;
  nome_completo: string;
  empresa_loja: string | null;
  cnpj: string | null;
  cidade_estado: string;
  telefone_whatsapp: string;
  email: string | null;
  instagram_redes: string | null;
  tempo_mercado: string | null;
  entende_proposito: string | null;
  vende_calcados_vestuario: string | null;
  forma_venda: string | null;
  o_que_chamou_atencao: string | null;
  segue_padroes_marca: string | null;
  pares_por_mes: string | null;
  status: 'pendente' | 'aprovado' | 'rejeitado';
  created_at: string;
  updated_at: string | null;
};
