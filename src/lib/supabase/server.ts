import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mockprojectshe.supabase.co';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-service-role-key';

let serverClient: SupabaseClient | null = null;
let supabaseOfflineUntil = 0;

export function markSupabaseOffline(durationMs = 60000) {
  supabaseOfflineUntil = Date.now() + durationMs;
}

export function isSupabaseOffline(): boolean {
  return Date.now() < supabaseOfflineUntil;
}

const timeoutFetch = async (url: any, options: any = {}) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 2000);
  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return res;
  } catch (err: any) {
    const msg = String(err?.message || err) + ' ' + String(err?.cause?.message || '');
    if (
      msg.includes('ENOTFOUND') ||
      msg.includes('fetch failed') ||
      err?.name === 'AbortError' ||
      err?.cause?.code === 'ENOTFOUND'
    ) {
      markSupabaseOffline(120000);
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
};

export function getSupabaseServer(): SupabaseClient {
  if (!serverClient) {
    serverClient = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      global: {
        fetch: timeoutFetch,
      },
    });
  }
  return serverClient;
}

export const isSupabaseConfigured = (): boolean => {
  if (isSupabaseOffline()) {
    return false;
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(url && key && !url.includes('mock'));
};
