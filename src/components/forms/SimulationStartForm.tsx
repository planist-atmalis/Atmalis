import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Play } from 'lucide-react';
import { useLocale } from '@/hooks/useLocale';
const schema = z.object({ track: z.enum(['project','business','digital']), weeks: z.coerce.number().refine(value => value === 12 || value === 24) });
export type SimulationFields = z.infer<typeof schema>;
interface Props { busy: boolean; submit: (values: SimulationFields) => void; }
export default function SimulationStartForm({ busy, submit }: Props) {
  const { t } = useLocale(); const form = useForm<SimulationFields>({ resolver: zodResolver(schema), defaultValues: { track: 'project', weeks: 12 } });
  return <form className="panel space-y-5 p-6" onSubmit={form.handleSubmit(submit)}><h2 className="section-heading">{t('Start simulation')}</h2><div className="field"><label htmlFor="practice-track">{t('Practice track')}</label><select id="practice-track" {...form.register('track')}><option value="project">{t('Project coordinator')}</option><option value="business">{t('Business analyst')}</option><option value="digital">{t('Digital strategist')}</option></select></div><div className="field"><label htmlFor="practice-length">{t('Program length')}</label><select id="practice-length" {...form.register('weeks')}><option value="12">{t('3 months · 12 weeks')}</option><option value="24">{t('6 months · 24 weeks')}</option></select></div><button className="btn-secondary w-full" disabled={busy}><Play size={17}/>{t(busy ? 'Generating your workspace…' : 'Start simulation')}</button></form>;
}
