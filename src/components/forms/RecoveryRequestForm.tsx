import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Mail, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { requestPasswordRecovery } from '@/lib/auth';
import { useLocale } from '@/hooks/useLocale';
const schema = z.object({ email: z.string().email('Enter a valid email address.') });
interface Props { sent: (email: string) => void; }
export default function RecoveryRequestForm({ sent }: Props) {
  const { t } = useLocale(); const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), defaultValues: { email: '' } });
  const send = useMutation({ mutationFn: (values: z.infer<typeof schema>) => requestPasswordRecovery(values.email), onSuccess: (_, values) => { toast.success(t('If an account exists, recovery instructions have been sent.')); sent(values.email); }, onError: (error: Error) => toast.error(error.message) });
  return <form onSubmit={form.handleSubmit(values => send.mutate(values))} className="space-y-5"><div className="field"><label htmlFor="recovery-email">{t('Email address')}</label><input id="recovery-email" type="email" autoComplete="email" dir="ltr" {...form.register('email')}/>{form.formState.errors.email && <p className="field-error"><AlertCircle size={16}/>{t(form.formState.errors.email.message || '')}</p>}</div><button className="btn-primary w-full" disabled={send.isPending}><Mail size={18}/>{t(send.isPending ? 'Please wait…' : 'Send recovery email')}</button></form>;
}
