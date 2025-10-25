import { createClient } from '@supabase/supabase-js';
import { demoSupabase } from './demoSupabase';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if demo mode is enabled via environment variable
const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true' || !supabaseUrl || !supabaseAnonKey;

if (isDemoMode) {
  console.log('🚀 LicitMind rodando em modo demonstração');
  console.log('📝 Use qualquer email/senha para fazer login');
  console.log('⚙️ Para usar dados reais, configure as variáveis do Supabase no arquivo .env');
} else {
  console.log('✅ LicitMind conectado ao Supabase');
  console.log('🔐 Autenticação real ativada');
}

export const supabase = isDemoMode 
  ? (demoSupabase as any)
  : createClient<Database>(supabaseUrl, supabaseAnonKey);