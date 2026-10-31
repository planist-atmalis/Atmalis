import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Check, X, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';
import { rpc } from '@/lib/api';
import { dateLabel } from '@/lib/utils';
import type { Application, Member } from '@/types/academy';
import StatusBadge from '@/components/features/StatusBadge';
interface Props { applications: Application[]; members: Member[]; isDemo: boolean; }
export default function AdminApplications({ applications, members, isDemo }: Props) {
  const cache = useQueryClient(); const review = useMutation({ mutationFn: ({ id, approve }: { id: string; approve: boolean }) => rpc('academy_review_instructor', { application_id: id, approve }), onSuccess: () => { cache.invalidateQueries({ queryKey: ['academy'] }); toast.success('Application reviewed. Approved applicants now have instructor access.'); }, onError: (error: Error) => toast.error(error.message) });
  return <div className="space-y-4 p-6">{applications.length ? applications.map(application => <article key={application.id} className="rounded-xl border p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary"><GraduationCap size={20}/></span><div><h3 className="text-sm font-bold">{members.find(member => member.user_id === application.user_id)?.username || 'Instructor applicant'}</h3><p className="mt-1 text-xs text-muted-foreground">Applied {dateLabel(application.created_at)}</p></div></div><StatusBadge status={application.status}/></div><p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{application.bio}</p>{application.status === 'pending' && <div className="mt-4 flex gap-2 border-t pt-4"><button className="btn-secondary text-primary" disabled={isDemo || review.isPending} onClick={() => review.mutate({ id: application.id, approve: true })}><Check size={16}/>Approve instructor</button><button className="btn-ghost text-destructive" disabled={isDemo || review.isPending} onClick={() => review.mutate({ id: application.id, approve: false })}><X size={16}/>Decline</button></div>}</article>) : <p className="py-3 text-sm text-muted-foreground">No instructor applications yet. Student applications will appear here for review.</p>}</div>;
}
