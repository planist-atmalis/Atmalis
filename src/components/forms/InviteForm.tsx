import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { z } from 'zod';
import { toast } from 'sonner';
import { Send, AlertCircle } from 'lucide-react';
import { inviteSchema } from '@/lib/validations';
import { invoke } from '@/lib/api';
interface Props { close: () => void; }
export default function InviteForm({ close }: Props) {
  const cache = useQueryClient(); const form = useForm<z.infer<typeof inviteSchema>>({ resolver: zodResolver(inviteSchema), defaultValues: { email: '', role: 'employee' } });
  const invite = useMutation({ mutationFn: (values: z.infer<typeof inviteSchema>) => invoke('academy-invite', { ...values, redirectTo: `${window.location.origin}/auth` }), onSuccess: () => { cache.invalidateQueries({ queryKey: ['academy'] }); toast.success('Invitation sent. The account has the selected role.'); close(); }, onError: (error: Error) => toast.error(error.message) });
  return <form onSubmit={form.handleSubmit(values => invite.mutate(values))} className="space-y-4 rounded-xl border bg-secondary/40 p-5"><h3 className="font-bold">Invite a workspace member</h3><p className="text-xs leading-relaxed text-muted-foreground">Employees cannot sign up for workspace access themselves. Their invitation and role are managed here.</p><div className="grid gap-4 sm:grid-cols-[1fr_180px]"><div className="field"><label htmlFor="invite-email">Email address</label><input id="invite-email" type="email" placeholder="colleague@example.com" {...form.register('email')}/>{form.formState.errors.email && <p className="field-error"><AlertCircle size={14}/>{form.formState.errors.email.message}</p>}</div><div className="field"><label htmlFor="invite-role">Account role</label><select id="invite-role" {...form.register('role')}><option value="employee">Employee</option><option value="student">Student</option></select></div></div><div className="flex gap-3"><button className="btn-primary" disabled={invite.isPending}><Send size={16}/>{invite.isPending ? 'Sending…' : 'Send invitation'}</button><button type="button" className="btn-ghost" onClick={close}>Cancel</button></div></form>;
}
