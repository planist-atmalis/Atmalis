import { corsHeaders, json } from '../_shared/cors.ts';
Deno.serve((req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  // The anon key is a public browser credential; authorization is enforced by RLS.
  const url = Deno.env.get('SUPABASE_URL');
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
  if (!url || !anonKey) return json({ error: 'Academy connection is not configured.' }, 503);
  return json({ url, anonKey });
});
