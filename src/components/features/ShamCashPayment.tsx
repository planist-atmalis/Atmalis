import { QRCodeSVG } from 'qrcode.react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Upload, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLocale } from '@/hooks/useLocale';
import { useAcademyRows } from '@/hooks/useAcademy';
import { uploadFile, saveRow } from '@/lib/api';
import type { Course } from '@/types/academy';
import type { PaymentSettings } from '@/types/atmalis';
const schema = z.object({ receipt: z.custom<FileList>().refine(files => !!files?.[0], 'A receipt is required.') });
interface Props { course: Course; }
export default function ShamCashPayment({ course }: Props) {
  const { user } = useAuth(); const { t } = useLocale(); const cache = useQueryClient(); const settings = useAcademyRows<PaymentSettings>('atmalis_payment_settings'); const account = settings.data?.[0];
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });
  const submit = useMutation({ mutationFn: async (values: z.infer<typeof schema>) => { if (!user || !account?.sham_account || !account.sham_instructions) throw new Error(t('Sham Cash is not configured. Contact the administrator for verified transfer instructions.')); const path = await uploadFile('academy-receipts', user.id, values.receipt[0]); return saveRow('academy_orders', { user_id: user.id, course_id: course.id, amount: Number(course.price), method: 'manual', payment_provider: 'sham_cash', receipt_path: path, status: 'pending' }); }, onSuccess: () => { cache.invalidateQueries({ queryKey: ['academy'] }); form.reset(); toast.success(t('Receipt submitted. Your course opens after administrator approval.')); }, onError: (error: Error) => toast.error(error.message) });
  if (settings.isLoading) return <p>{t('Please wait…')}</p>;
  if (!account?.sham_account || !account.sham_instructions) return <p className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground"><AlertCircle size={18} className="shrink-0"/>{t('Sham Cash is not configured. Contact the administrator for verified transfer instructions.')}</p>;
  return <form onSubmit={form.handleSubmit(values => submit.mutate(values))} className="space-y-4 rounded-xl border bg-muted/40 p-4"><div className="flex flex-wrap items-center gap-4"><QRCodeSVG value={account.sham_account} size={104} marginSize={3} title={t('Recipient account')}/><div className="min-w-0 flex-1"><p className="text-sm font-semibold">{t('Recipient account')}</p><p dir="ltr" className="mt-2 break-all text-base font-bold text-primary">{account.sham_account}</p></div></div><p className="whitespace-pre-wrap text-base leading-relaxed text-muted-foreground">{account.sham_instructions}</p><div className="field"><label htmlFor="sham-receipt">{t('Transfer receipt')}</label><input id="sham-receipt" type="file" accept="application/pdf,image/jpeg,image/png,image/webp" {...form.register('receipt')}/>{form.formState.errors.receipt && <p className="field-error"><AlertCircle size={16}/>{t('A receipt is required.')}</p>}</div><button className="btn-primary w-full" disabled={submit.isPending}><Upload size={16}/>{t(submit.isPending ? 'Uploading…' : 'Submit for review')}</button></form>;
}
