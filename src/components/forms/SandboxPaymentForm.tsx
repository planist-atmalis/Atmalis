import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FlaskConical, AlertCircle } from 'lucide-react';
import { useLocale } from '@/hooks/useLocale';
const schema = z.object({ amount: z.coerce.number().positive().max(100000), provider: z.enum(['nowpayments_mock','sham_cash_mock']), status: z.enum(['succeeded','failed','pending']) });
export type SandboxFields = z.infer<typeof schema>;
interface Props { amount: number; busy: boolean; submit: (values: SandboxFields) => void; }
export default function SandboxPaymentForm({ amount, busy, submit }: Props) {
  const { t } = useLocale(); const form = useForm<SandboxFields>({ resolver: zodResolver(schema), defaultValues: { amount, provider: 'nowpayments_mock', status: 'succeeded' } });
  return <form className="panel space-y-6 p-6 sm:p-8" onSubmit={form.handleSubmit(submit)}><h2 className="section-heading">{t('Try mock checkout')}</h2><div className="field"><label htmlFor="mock-provider">{t('Mock provider')}</label><select id="mock-provider" {...form.register('provider')}><option value="nowpayments_mock">NOWPayments · USDT TRC-20 · Mock</option><option value="sham_cash_mock">{t('Sham Cash')} · Mock</option></select></div><div className="field"><label htmlFor="mock-amount">{t('Test amount (USD)')}</label><input id="mock-amount" type="number" min="0.01" max="100000" step="0.01" dir="ltr" {...form.register('amount')}/>{form.formState.errors.amount && <p className="field-error"><AlertCircle size={16}/>{form.formState.errors.amount.message}</p>}</div><div className="field"><label htmlFor="mock-outcome">{t('Test outcome')}</label><select id="mock-outcome" {...form.register('status')}><option value="succeeded">{t('Successful payment')}</option><option value="failed">{t('Failed payment')}</option><option value="pending">{t('Awaiting confirmation')}</option></select></div><button className="btn-primary w-full" disabled={busy}><FlaskConical size={18}/>{t(busy ? 'Simulating…' : 'Run payment test')}</button></form>;
}
