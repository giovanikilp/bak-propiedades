// Cliente de Supabase para BAK Propiedades.
// IMPORTANTE: estas claves son publicas por diseno. La seguridad real esta en RLS + Auth.
// En Vercel/static hosting no existen variables de entorno en runtime del navegador,
// por eso se deja aca la URL y la publishable/anon key.
const SUPABASE_URL = 'https://ltrofwhdqncydzlriefr.supabase.co';
const SUPABASE_KEY = 'sb_publishable_CqnJHWoNK_WQeOyM0Snk7w_P67Ctzez';

export const hasSupabaseConfig = Boolean(
  window.supabase &&
  SUPABASE_URL &&
  SUPABASE_KEY &&
  !SUPABASE_URL.includes('/rest/v1')
);

export const supabase = hasSupabaseConfig
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : null;

export const STORAGE_BUCKET = 'propiedades';
