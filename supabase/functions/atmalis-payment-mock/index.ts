import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { corsHeaders, json } from '../_shared/cors.ts';
import { adminClient, authenticatedUser } from '../_shared/clients.ts';
// Deliberately a local mock, NOT a NOWPayments API credential or official sandbox key.
const MOCK_KEY = 'mock_atmalis_development_no_real_payments';
serve(async req => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);
  try {
    const body = await req.json();
    const amount = Number(body.amount);
    if (!Number.isFinite(amount) || amount <= 0 || amount > 100000 || !['succeeded','failed','pending'].includes(body.status) || !['nowpayments_mock','sham_cash_mock'].includes(body.provider)) return json({ error: 'Invalid test payment.' }, 400);
    const total = Math.round(amount * 100) / 100;
    const share = body.status === 'succeeded' ? Math.round(total * 20) / 100 : 0;
    const result = { id: crypto.randomUUID(), provider: body.provider, amount: total, status: body.status, course_title: String(body.course_title || 'Atmalis development test').slice(0, 150), platform_share: share, instructor_share: body.status === 'succeeded' ? Math.round((total - share) * 100) / 100 : 0, created_at: new Date().toISOString() };
    if (body.persist === true) {
      const user = await authenticatedUser(req);
      const admin = adminClient();
      const { count, error: countError } = await admin.from('atmalis_sandbox_payments').select('id', { count: 'exact', head: true }).eq('user_id', user.id).gte('created_at', new Date(Date.now() - 60000).toISOString());
      if (countError) throw countError;
      if ((count || 0) >= 10) return json({ error: 'Please wait before running more tests.' }, 429);
      const { error } = await admin.from('atmalis_sandbox_payments').insert({ ...result, user_id: user.id });
      if (error) throw error;
    }
    console.log('Atmalis mock payment:', result.id, result.status);
    // Never call provider APIs, academy_orders, enrollment or commission writes.
    return json({ ...result, mode: 'mock', grants_access: false, qr_value: `ATML-MOCK-NO-FUNDS:${result.id}`, mock_key_type: MOCK_KEY.split('_')[0] });
  } catch (error) { console.error('Atmalis mock payment failed:', error); return json({ error: error instanceof Error ? error.message : 'Unable to run test.' }, 400); }
});
