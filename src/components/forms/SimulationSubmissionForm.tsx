import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertCircle, Send } from 'lucide-react';
import { useLocale } from '@/hooks/useLocale';
const schema = z.object({ submission: z.string().trim().min(40).max(12000) });
interface Props { taskId: string; previous: string | null; busy: boolean; passed: boolean; submit: (submission: string) => void; }
export default function SimulationSubmissionForm({ taskId, previous, busy, passed, submit }: Props) {
  const { t } = useLocale(); const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), defaultValues: { submission: previous || '' } });
  useEffect(() => { form.reset({ submission: previous || '' }); }, [taskId, previous, form]);
  return <form className="space-y-4 border-t pt-6" onSubmit={form.handleSubmit(values => submit(values.submission))}><div className="field"><label htmlFor="practice-deliverable">{t('Your deliverable')}</label><textarea id="practice-deliverable" rows={8} placeholder={t('Describe your decisions, plan, and reasoning.')} disabled={passed || busy} {...form.register('submission')}/>{form.formState.errors.submission && <p className="field-error"><AlertCircle size={16}/>{t('Submit 40–12,000 characters.')}</p>}</div>{!passed && <button className="btn-primary" disabled={busy}><Send size={17}/>{t(busy ? 'Reviewing your work…' : 'Submit for AI feedback')}</button>}</form>;
}
