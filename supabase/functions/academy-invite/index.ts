import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';
import { corsHeaders, json } from '../_shared/cors.ts';
Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);
  try {
    const token = req.headers.get('Authorization')?.replace(/^Bearer\s+/i, '');
    if (!token) return json({ error: 'Sign in to manage invitations.' }, 401);
    const auth = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!);
    const { data: { user }, error: authError } = await auth.auth.getUser(token);
    if (authError || !user) return json({ error: 'Your session has expired. Please sign in again.' }, 401);
    const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const { data: membership, error: memberError } = await admin.from('academy_members').select('role').eq('user_id', user.id).single();
    if (memberError || membership?.role !== 'super_admin') return json({ error: 'Administrator access required.' }, 403);
    const body = await req.json();
    if (typeof body.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email) || !['employee', 'student'].includes(body.role)) return json({ error: 'Enter a valid email and supported role.' }, 400);
    const origin = req.headers.get('origin');
    if (!origin || body.redirectTo !== `${origin}/auth`) return json({ error: 'Invalid invitation return URL.' }, 400);
    const { data, error } = await admin.auth.admin.inviteUserByEmail(body.email, { redirectTo: body.redirectTo });
    if (error) return json({ error: `Invitation: ${error.message}` }, 400);
    if (!data.user) return json({ error: 'The invitation could not be created.' }, 500);
    const { error: roleError } = await admin.from('academy_members').update({ role: body.role }).eq('user_id', data.user.id);
    if (roleError) return json({ error: 'The invitation was sent, but role assignment failed. Set the role in the Cloud dashboard.' }, 500);
    console.log('Administrator invitation completed');
    return json({ ok: true });
  } catch (error) { console.error('Academy invitation failed', error instanceof Error ? error.message : 'Unknown error'); return json({ error: 'Unable to send the invitation. Please retry or check Cloud auth settings.' }, 500); }
});
