import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { KeyRound, AlertCircle } from 'lucide-react';
import { updatePassword } from '@/lib/auth';
const schema = z.object({ password: z.string().min(6, 'Use at least 6 characters.'), confirm: z.string() }).refine(values => values.password === values.confirm, { path: ['confirm'], message: 'Passwords do not match.' });
export default function PasswordForm() {
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });
  const mutation = useMutation({ mutationFn: (values: z.infer<typeof schema>) => updatePassword(values.password), onSuccess: () => { form.reset(); toast.success('Your password has been updated.'); }, onError: (error: Error) => toast.error(error.message) });
  return <form className="panel space-y-5 p-6" onSubmit={form.handleSubmit(values => mutation.mutate(values))}><h2 className="section-heading">Password & security</h2><p className="text-xs leading-relaxed text-muted-foreground">Invited team members can set their password here after verifying their email.</p>{(['password', 'confirm'] as const).map(name => <div className="field" key={name}><label htmlFor={`new-${name}`}>{name === 'password' ? 'New password' : 'Confirm new password'}</label><input id={`new-${name}`} type="password" autoComplete="new-password" {...form.register(name)}/>{form.formState.errors[name] && <p className="field-error"><AlertCircle size={14}/>{form.formState.errors[name]?.message}</p>}</div>)}<button className="btn-secondary" disabled={mutation.isPending}><KeyRound size={16}/>{mutation.isPending ? 'Updating…' : 'Update password'}</button></form>;
}
