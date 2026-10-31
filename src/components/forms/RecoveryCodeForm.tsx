import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useLocale } from '@/hooks/useLocale';
const schema = z.object({ email: z.string().email('Enter a valid email address.'), token: z.string().regex(/^\d{4}$/, '4-digit email verification code') });
interface Props { email: string; }
export default function RecoveryCodeForm({ email }: Props) {
  const { t } = useLocale(); const { verifyRecovery } = useAuth(); const navigate = useNavigate();
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), defaultValues: { email, token: '' } });
  const verify = useMutation({ mutationFn: (values: z.infer<typeof schema>) => verifyRecovery(values.email, values.token), onSuccess: () => navigate('/auth/recovery', { replace: true }), onError: (error: Error) => toast.error(error.message) });
  return <form onSubmit={form.handleSubmit(values => verify.mutate(values))} className="space-y-4"><div className="field"><label htmlFor="code-email">{t('Email address')}</label><input id="code-email" type="email" dir="ltr" autoComplete="email" {...form.register('email')}/>{form.formState.errors.email && <p className="field-error"><AlertCircle size={16}/>{t(form.formState.errors.email.message || '')}</p>}</div><div className="field"><label htmlFor="recovery-code">{t('Recovery code')}</label><input id="recovery-code" inputMode="numeric" dir="ltr" maxLength={4} autoComplete="one-time-code" {...form.register('token')}/>{form.formState.errors.token && <p className="field-error"><AlertCircle size={16}/>{t(form.formState.errors.token.message || '')}</p>}</div><button className="btn-secondary w-full" disabled={verify.isPending}>{t(verify.isPending ? 'Please wait…' : 'Verify recovery code')}</button></form>;
}
