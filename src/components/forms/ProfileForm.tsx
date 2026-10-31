import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Save, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { updateProfile } from '@/lib/auth';
import { useLocale } from '@/hooks/useLocale';
const schema = z.object({ username: z.string().min(2, 'Enter at least 2 characters.').max(60) });
export default function ProfileForm() {
  const { t } = useLocale(); const { user, setUser } = useAuth(); const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), defaultValues: { username: user?.username || '' } });
  useEffect(() => { form.reset({ username: user?.username || '' }); }, [user?.username, form]);
  const mutation = useMutation({ mutationFn: (values: z.infer<typeof schema>) => updateProfile(values.username), onSuccess: result => { setUser(result); toast.success(t('Your profile has been updated.')); }, onError: (error: Error) => toast.error(error.message) });
  return <form className="panel space-y-5 p-6" onSubmit={form.handleSubmit(values => mutation.mutate(values))}><h2 className="section-heading">{t('Your profile')}</h2><div className="field"><label htmlFor="profile-name">{t('Full name')}</label><input id="profile-name" autoComplete="name" {...form.register('username')}/>{form.formState.errors.username && <p className="field-error"><AlertCircle size={14}/>{t(form.formState.errors.username.message || '')}</p>}</div><div className="field"><label htmlFor="profile-email">{t('Email address')}</label><input id="profile-email" value={user?.email || ''} disabled/><p className="text-xs text-muted-foreground">{t('Your verified email keeps your academy account secure.')}</p></div><div className="flex justify-end border-t pt-5"><button className="btn-primary" disabled={mutation.isPending}><Save size={16}/>{t(mutation.isPending ? 'Saving…' : 'Save profile')}</button></div></form>;
}
