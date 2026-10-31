import { createClient, FunctionsHttpError, type SupabaseClient } from '@supabase/supabase-js';
const BACKEND_URL = 'https://pjzmzhtyhtcsqdhkpjzm.backend.onspace.ai';
let clientPromise: Promise<SupabaseClient> | undefined;
export function getClient(): Promise<SupabaseClient> {
  if (!clientPromise) clientPromise = (async () => {
    const env = (import.meta as unknown as { env: Record<string, string> }).env;
    let url = env.VITE_SUPABASE_URL;
    let key = env.VITE_SUPABASE_ANON_KEY;
    if (!url || !key) {
      const response = await fetch(`${BACKEND_URL}/functions/v1/academy-config`);
      if (!response.ok) throw new Error('Unable to connect to the academy. Please retry in a moment.');
      const config = await response.json(); url = config.url; key = config.anonKey;
    }
    return createClient(url, key, { auth: { persistSession: true, autoRefreshToken: true, flowType: 'pkce' } });
  })().catch(error => { clientPromise = undefined; throw error; });
  return clientPromise;
}
export async function rows<T>(table: string, filters: Record<string, string> = {}, order = 'created_at'): Promise<T[]> {
  const client = await getClient(); let query = client.from(table).select('*');
  Object.entries(filters).forEach(([key, value]) => { query = query.eq(key, value); });
  const { data, error } = await query.order(order, { ascending: order === 'position' });
  if (error) throw new Error(error.message); return (data || []) as T[];
}
export async function saveRow(table: string, values: Record<string, unknown>, id?: string) {
  const client = await getClient();
  const { data, error } = await (id ? client.from(table).update(values).eq('id', id) : client.from(table).insert(values)).select().single();
  if (error) throw new Error(error.message); return data;
}
export async function uploadFile(bucket: string, folder: string, file: File) {
  const limit = bucket === 'academy-receipts' ? 5 : 10;
  if (file.size > limit * 1024 * 1024) throw new Error(`Choose a file smaller than ${limit} MB.`);
  if (!['application/pdf', 'image/jpeg', 'image/png', 'image/webp'].includes(file.type)) throw new Error('Choose a PDF, JPEG, PNG, or WebP file.');
  const client = await getClient(); const path = `${folder}/${crypto.randomUUID()}.${file.name.split('.').pop()?.toLowerCase() || 'pdf'}`;
  const { error } = await client.storage.from(bucket).upload(path, file, { contentType: file.type });
  if (error) throw new Error(error.message); return path;
}
export async function signedFile(bucket: string, path: string) {
  const client = await getClient(); const { data, error } = await client.storage.from(bucket).createSignedUrl(path, 600);
  if (error) throw new Error(error.message); return data.signedUrl;
}
export async function rpc<T>(name: string, params = {}): Promise<T> {
  const client = await getClient(); const { data, error } = await client.rpc(name, params);
  if (error) throw new Error(error.message); return data as T;
}
export async function invoke<T>(name: string, body: Record<string, unknown>): Promise<T> {
  const client = await getClient(); const { data, error } = await client.functions.invoke(name, { body });
  if (error) {
    let detail = error.message;
    if (error instanceof FunctionsHttpError) {
      const text = await error.context.text();
      try { const parsed: { error?: string } = JSON.parse(text); detail = parsed.error || text; } catch { detail = text || error.message; }
    }
    throw new Error(detail || 'The request could not be completed.');
  }
  return data as T;
}
