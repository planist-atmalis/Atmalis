import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { KeyRound, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLocale } from '@/hooks/useLocale';
const schema = z.object({ password: z.string().min(6, 'Use at least 6 characters.'), confirm: z.string() }).refine(values => values.password === values.confirm, { path: ['confirm'], message: 'Passwords do not match.' });
export default function RecoveryPasswordForm() {
  const { t } = useLocale(); const { completeRecovery } = useAuth(); const navigate = useNavigate();
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), defaultValues: { password: '', confirm: '' } });
  const update = useMutation({ mutationFn: (values: z.infer<typeof schema>) => completeRecovery(values.password), onSuccess: () => { toast.success(t('Your password has been updated.')); navigate('/auth', { replace: true }); }, onError: (error: Error) => toast.error(error.message) });
  return <form onSubmit={form.handleSubmit(values => update.mutate(values))} className="space-y-5"><h2 className="section-heading">{t('Choose a new password')}</h2>{(['password','confirm'] as const).map(field => <div className="field" key={field}><label htmlFor={`recovery-${field}`}>{t(field === 'password' ? 'New password' : 'Confirm new password')}</label><input id={`recovery-${field}`} type="password" autoComplete="new-password" {...form.register(field)}/>{form.formState.errors[field] && <p className="field-error"><AlertCircle size={16}/>{t(form.formState.errors[field]?.message || '')}</p>}</div>)}<button className="btn-primary w-full" disabled={update.isPending}><KeyRound size={18}/>{t(update.isPending ? 'Updating…' : 'Update password')}</button></form>;
}
