import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';
export function adminClient() { return createClient(Deno.env.get('SUPABASE_URL') || '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '', { auth: { persistSession: false } }); }
export async function authenticatedUser(req: Request) {
  const token = req.headers.get('Authorization')?.replace(/^Bearer\s+/i, '');
  if (!token) throw new Error('Sign in required.');
  const client = createClient(Deno.env.get('SUPABASE_URL') || '', Deno.env.get('SUPABASE_ANON_KEY') || '', { auth: { persistSession: false } });
  const { data, error } = await client.auth.getUser(token);
  if (error || !data.user) throw new Error('Your session expired. Sign in again.');
  return data.user;
}
