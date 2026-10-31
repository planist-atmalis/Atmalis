import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { corsHeaders, json } from '../_shared/cors.ts';
import { adminClient, authenticatedUser } from '../_shared/clients.ts';
import { generateTask, evaluateTask } from '../_shared/simulationAi.ts';
serve(async req => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);
  try {
    const user = await authenticatedUser(req); const body = await req.json(); const admin = adminClient();
    console.log('Atmalis simulator action:', body.action);
    if (body.action === 'start') {
      if (!['project','business','digital'].includes(body.track) || ![12,24].includes(body.weeks) || !['en','ar','tr'].includes(body.language)) return json({ error: 'Invalid program settings.' }, 400);
      const { count, error: countError } = await admin.from('atmalis_simulations').select('id', { count: 'exact', head: true }).eq('user_id', user.id).gte('created_at', new Date(Date.now() - 86400000).toISOString());
      if (countError) throw countError;
      if ((count || 0) >= 3) return json({ error: 'You can start up to three programs per day.' }, 429);
      const task = await generateTask(body.track, 1, body.weeks, body.language);
      const { data: runId, error } = await admin.rpc('atmalis_create_simulation', { uid: user.id, selected_track: body.track, total_weeks: body.weeks, selected_language: body.language, task_payload: task });
      if (error) throw error;
      return json({ simulation_id: runId });
    }
    if (!['submit','advance'].includes(body.action) || typeof body.simulation_id !== 'string') return json({ error: 'Invalid simulator action.' }, 400);
    const { data: run, error: runError } = await admin.from('atmalis_simulations').select('*').eq('id', body.simulation_id).eq('user_id', user.id).single();
    if (runError || !run) return json({ error: 'Program not found.' }, 404);
    if (run.status !== 'active') return json({ error: 'This program is complete.' }, 400);
    const { data: task, error: taskError } = await admin.from('atmalis_simulation_tasks').select('*').eq('simulation_id', run.id).eq('week', run.current_week).single();
    if (taskError || !task) throw new Error('Current scenario could not be loaded.');
    if (body.action === 'submit') {
      const submission = String(body.submission || '').trim();
      if (submission.length < 40 || submission.length > 12000) return json({ error: 'Submit 40–12,000 characters.' }, 400);
      if (task.score !== null && task.score >= 70) return json({ error: 'This task has passed. Continue to the next week.' }, 400);
      if (task.attempts >= 5) return json({ error: 'Maximum five assessment attempts per task.' }, 429);
      if (task.submitted_at && Date.now() - Date.parse(task.submitted_at) < 30000) return json({ error: 'Wait 30 seconds before resubmitting.' }, 429);
      const feedback = await evaluateTask(task, submission, run.language);
      const { data: saved, error } = await admin.from('atmalis_simulation_tasks').update({ ...feedback, submission, attempts: task.attempts + 1, submitted_at: new Date().toISOString() }).eq('id', task.id).eq('attempts', task.attempts).select('id');
      if (error) throw error;
      if (!saved?.length) return json({ error: 'Another assessment was saved. Refresh this program.' }, 409);
      return json({ simulation_id: run.id });
    }
    if (task.score === null || task.score < 70) return json({ error: 'A score of 70 is required to progress.' }, 400);
    const completed = run.current_week >= run.weeks;
    if (!completed) {
      const { data: existing, error: existingError } = await admin.from('atmalis_simulation_tasks').select('id').eq('simulation_id', run.id).eq('week', run.current_week + 1).maybeSingle();
      if (existingError) throw existingError;
      if (!existing) {
        const next = await generateTask(run.track, run.current_week + 1, run.weeks, run.language);
        const { error } = await admin.from('atmalis_simulation_tasks').upsert({ ...next, simulation_id: run.id, user_id: user.id, week: run.current_week + 1 }, { onConflict: 'simulation_id,week', ignoreDuplicates: true });
        if (error) throw error;
      }
    }
    const { error } = await admin.from('atmalis_simulations').update(completed ? { status: 'completed' } : { current_week: run.current_week + 1 }).eq('id', run.id).eq('current_week', run.current_week);
    if (error) throw error;
    return json({ simulation_id: run.id });
  } catch (error) { console.error('Atmalis simulator error:', error); return json({ error: error instanceof Error ? error.message : 'Unable to generate your practice workspace.' }, 400); }
});
