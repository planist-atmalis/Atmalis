import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ShieldCheck, CheckCircle2, Clock3, FlaskConical } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLocale } from '@/hooks/useLocale';
import { useAcademyRows } from '@/hooks/useAcademy';
import { rpc } from '@/lib/api';
import { money } from '@/lib/utils';
import type { Course, Order } from '@/types/academy';
import ShamCashPayment from '@/components/features/ShamCashPayment';
interface Props { course: Course; enrolled: boolean; isDemo: boolean; }
export default function PurchasePanel({ course, enrolled, isDemo }: Props) {
  const { user } = useAuth(); const { t } = useLocale(); const [manual, setManual] = useState(false); const cache = useQueryClient();
  const orders = useAcademyRows<Order>('academy_orders', { course_id: course.id, user_id: user?.id || '' }, !!user && !isDemo); const pending = orders.data?.some(order => order.status === 'pending');
  const free = useMutation({ mutationFn: () => rpc('academy_enroll_free_course', { cid: course.id }), onSuccess: () => { cache.invalidateQueries({ queryKey: ['academy'] }); toast.success(t('You’re enrolled. Your next chapter starts now.')); }, onError: (error: Error) => toast.error(error.message) });
  return <div className="panel p-6"><div className="flex flex-wrap items-center justify-between gap-2"><span className="eyebrow">{t('Your investment')}</span><span className="badge">{t('Lifetime access')}</span></div><p className="my-5 font-heading text-4xl font-bold text-primary">{Number(course.price) ? money(course.price) : t('Free')}</p><div className="space-y-3 border-y py-5 text-base text-muted-foreground">{['Learn at your own pace','Video lessons & learning materials','Track every step of your progress'].map(item => <span key={item} className="flex items-start gap-2"><CheckCircle2 size={18} className="mt-1 shrink-0 text-primary"/>{t(item)}</span>)}</div>
    {enrolled ? <p className="mt-5 flex items-center gap-2 font-semibold text-primary"><CheckCircle2 size={18}/>{t('You have access to this course.')}</p> : !user || isDemo ? <><Link to={`/auth?next=/courses/${isDemo ? '' : course.id}`} className="btn-primary mt-5 w-full">{t(isDemo ? 'Create your learning account' : 'Sign in to enroll')}</Link>{isDemo && <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t('This is a sample course. Real courses appear once published.')}</p>}</> : pending ? <p className="mt-5 flex items-start gap-2 font-semibold text-accent-foreground"><Clock3 size={20} className="shrink-0"/>{t('Your transfer is awaiting review.')}</p> : Number(course.price) === 0 ? <button className="btn-primary mt-5 w-full" disabled={free.isPending} onClick={() => free.mutate()}>{t(free.isPending ? 'Enrolling…' : 'Enroll for free')}</button> : <div className="mt-5 space-y-4"><button className={`${manual ? 'btn-secondary' : 'btn-primary'} w-full`} onClick={() => setManual(!manual)} aria-expanded={manual}>{t('Sham Cash')} · {t('Manual receipt review')}</button>{manual && <ShamCashPayment course={course}/>}<Link className="btn-secondary w-full" to={`/payments/sandbox?amount=${course.price}&course=${encodeURIComponent(course.title)}`}><FlaskConical size={17}/>{t('USDT · TRC-20')} · Mock</Link><p className="text-sm leading-relaxed text-muted-foreground">{t('Mock only — no funds move and no paid course access is granted.')}</p><button disabled className="btn-secondary w-full">{t('Payeer unavailable')}</button><p className="text-sm leading-relaxed text-muted-foreground">{t('Payeer is unavailable following the service shutdown.')}</p></div>}
    {isDemo && <Link className="btn-secondary mt-4 w-full" to={`/payments/sandbox?amount=${course.price}&course=${encodeURIComponent(course.title)}`}><FlaskConical size={17}/>{t('Try mock checkout')}</Link>}<p className="mt-5 flex items-center justify-center gap-2 text-sm text-muted-foreground"><ShieldCheck size={16}/>{t('Secure enrollment. Protected content.')}</p></div>;
}
