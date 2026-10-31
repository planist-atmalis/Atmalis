import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BrainCircuit, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useLocale } from '@/hooks/useLocale';
import { useAcademyRows } from '@/hooks/useAcademy';
import { invoke } from '@/lib/api';
import { cn } from '@/lib/utils';
import type { Simulation, SimulationTask } from '@/types/atmalis';
import PageHeading from '@/components/features/PageHeading';
import EmptyState from '@/components/features/EmptyState';
import SimulationStartForm from '@/components/forms/SimulationStartForm';
import SimulationTaskPanel from '@/components/features/SimulationTaskPanel';
const TRACKS = { project: 'Project coordinator', business: 'Business analyst', digital: 'Digital strategist' };
export default function SimulatorPage() {
  const { user } = useAuth(); const { t, language } = useLocale(); const cache = useQueryClient(); const [selected, setSelected] = useState('');
  const runs = useAcademyRows<Simulation>('atmalis_simulations', { user_id: user?.id || '' }, !!user); const run = runs.data?.find(item => item.id === selected) || runs.data?.[0];
  const tasks = useAcademyRows<SimulationTask>('atmalis_simulation_tasks', { simulation_id: run?.id || '', user_id: user?.id || '' }, !!run && !!user);
  const task = tasks.data?.find(item => item.week === run?.current_week);
  const action = useMutation({ mutationFn: (body: Record<string, unknown>) => invoke<{ simulation_id: string }>('atmalis-simulator', body), onSuccess: data => { setSelected(data.simulation_id); cache.invalidateQueries({ queryKey: ['academy','atmalis_simulations'] }); cache.invalidateQueries({ queryKey: ['academy','atmalis_simulation_tasks'] }); }, onError: (error: Error) => toast.error(error.message) });
  return <div className="page-wrap"><PageHeading eyebrow="AI simulator" title="Practice the work before the workplace." description="A 3–6 month learning program with weekly workplace scenarios and AI feedback."/><div className="flex items-start gap-3 rounded-2xl bg-secondary p-5"><BrainCircuit size={26} className="shrink-0 text-primary"/><div><p className="font-semibold text-primary">{t('Learning simulation only — not employment or verified professional experience.')}</p><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t('Self-paced; the week labels are a suggested schedule, not elapsed work experience.')}</p></div></div>{!user ? <EmptyState title="Start simulation" description="Sign in to start your practice program."><Link className="btn-primary" to="/auth?next=/simulator">{t('Sign in')}</Link></EmptyState> : <div className="grid items-start gap-6 lg:grid-cols-[minmax(260px,1fr)_minmax(0,2.3fr)]"><aside className="space-y-6"><SimulationStartForm busy={action.isPending} submit={values => action.mutate({ action: 'start', ...values, language })}/><section className="panel p-5"><h2 className="section-heading">{t('Your simulations')}</h2><div className="mt-4 space-y-3">{runs.data?.map(item => <button key={item.id} className={cn('min-h-14 w-full rounded-xl border p-4 text-start hover:bg-secondary', item.id === run?.id && 'border-primary/30 bg-secondary')} onClick={() => setSelected(item.id)}><p className="font-semibold">{t(TRACKS[item.track])}</p><p className="mt-2 text-sm text-muted-foreground">{t('Week')} {item.current_week}/{item.weeks} · {t(item.status === 'completed' ? 'Completed' : 'In progress')}</p></button>)}</div></section></aside><div>{tasks.isLoading || runs.isLoading ? <p className="panel p-8">{t('Please wait…')}</p> : run?.status === 'completed' ? <section className="panel p-8"><CheckCircle2 size={40} className="text-primary"/><h2 className="mt-5 text-2xl font-bold">{t('Program completed')}</h2><p className="mt-4 leading-relaxed text-muted-foreground">{t('Your progress is saved. Keep practicing in a new program.')}</p></section> : run && task ? <SimulationTaskPanel run={run} task={task} busy={action.isPending} submit={submission => action.mutate({ action: 'submit', simulation_id: run.id, submission })} advance={() => action.mutate({ action: 'advance', simulation_id: run.id })}/> : <EmptyState title="Start simulation" description="No active simulation yet. Choose a track to begin."/>}</div></div>}</div>;
}
