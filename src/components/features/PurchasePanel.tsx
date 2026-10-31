import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { CreditCard, ShieldCheck, Upload, CheckCircle2, Clock3, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAcademyRows } from '@/hooks/useAcademy';
import { saveRow, uploadFile, rpc } from '@/lib/api';
import { money } from '@/lib/utils';
import type { Course, Order } from '@/types/academy';
interface Props { course: Course; enrolled: boolean; isDemo: boolean; }
interface ReceiptFields { receipt: FileList; }
export default function PurchasePanel({ course, enrolled, isDemo }: Props) {
  const { user } = useAuth(); const [manual, setManual] = useState(false); const cache = useQueryClient(); const form = useForm<ReceiptFields>();
  const orders = useAcademyRows<Order>('academy_orders', { course_id: course.id, user_id: user?.id || '' }, !!user && !isDemo);
  const pending = orders.data?.some(order => order.status === 'pending');
  const free = useMutation({ mutationFn: () => rpc('academy_enroll_free_course', { cid: course.id }), onSuccess: () => { cache.invalidateQueries({ queryKey: ['academy'] }); toast.success('You’re enrolled. Your next chapter starts now.'); }, onError: (error: Error) => toast.error(error.message) });
  const purchase = useMutation({ mutationFn: async (values: ReceiptFields) => {
    if (!user || isDemo) throw new Error('Sign in and choose a published course to enroll.');
    const receipt = values.receipt?.[0]; if (!receipt) throw new Error('Select a transfer receipt first.');
    const path = await uploadFile('academy-receipts', user.id, receipt);
    return saveRow('academy_orders', { user_id: user.id, course_id: course.id, amount: Number(course.price), method: 'manual', receipt_path: path, status: 'pending' });
  }, onSuccess: () => { cache.invalidateQueries({ queryKey: ['academy'] }); toast.success('Receipt submitted. Your course opens after administrator approval.'); setManual(false); }, onError: (error: Error) => toast.error(error.message) });
  return <div className="panel p-6"><div className="flex items-center justify-between"><span className="eyebrow">Your investment</span><span className="badge">Lifetime access</span></div><p className="my-5 font-heading text-4xl font-extrabold text-primary">{Number(course.price) ? money(course.price) : 'Free'}</p><div className="space-y-3 border-y py-5 text-sm text-muted-foreground"><span className="flex items-center gap-2"><CheckCircle2 size={17} className="text-primary"/>Learn at your own pace</span><span className="flex items-center gap-2"><CheckCircle2 size={17} className="text-primary"/>Video lessons & learning materials</span><span className="flex items-center gap-2"><CheckCircle2 size={17} className="text-primary"/>Track every step of your progress</span></div>
    {enrolled ? <p className="mt-5 flex items-center gap-2 font-semibold text-primary"><CheckCircle2 size={18}/>You have access to this course.</p> : !user || isDemo ? <><Link to={`/auth?next=/courses/${isDemo ? '' : course.id}`} className="btn-primary mt-5 w-full">{isDemo ? 'Create your learning account' : 'Sign in to enroll'}</Link>{isDemo && <p className="mt-3 text-xs text-muted-foreground">This is a sample course. Real courses appear once published.</p>}</> : pending ? <p className="mt-5 flex items-center gap-2 text-sm font-semibold text-accent-foreground"><Clock3 size={18}/>Your transfer is awaiting review.</p> : Number(course.price) === 0 ? <button className="btn-primary mt-5 w-full" disabled={free.isPending} onClick={() => free.mutate()}>{free.isPending ? 'Enrolling…' : 'Enroll for free'}</button> : <div className="mt-5 space-y-3"><button disabled className="btn-secondary w-full"><CreditCard size={17}/>Online payment</button><p className="flex items-start gap-1.5 text-xs leading-relaxed text-muted-foreground"><AlertCircle size={14} className="shrink-0"/>Online checkout is not configured yet. Use a manual transfer instead.</p><button className="btn-primary w-full" onClick={() => setManual(!manual)}><Upload size={17}/>Submit transfer receipt</button>
    {manual && <form onSubmit={form.handleSubmit(values => purchase.mutate(values))} className="space-y-4 rounded-xl bg-muted p-4"><p className="text-xs leading-relaxed text-muted-foreground">Ask your academy administrator for transfer instructions. Upload the receipt after transferring {money(course.price)}.</p><div className="field"><label htmlFor="receipt">Transfer receipt</label><input id="receipt" type="file" accept="application/pdf,image/jpeg,image/png,image/webp" {...form.register('receipt', { required: 'A receipt is required.' })}/>{form.formState.errors.receipt && <p className="field-error">{form.formState.errors.receipt.message}</p>}</div><button className="btn-primary w-full" disabled={purchase.isPending}>{purchase.isPending ? 'Uploading…' : 'Submit for review'}</button></form>}</div>}<p className="mt-5 flex items-center justify-center gap-2 text-[11px] text-muted-foreground"><ShieldCheck size={14}/>Secure enrollment. Protected content.</p></div>;
}
