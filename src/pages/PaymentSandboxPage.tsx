import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FlaskConical } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useLocale } from '@/hooks/useLocale';
import { useAcademyRows } from '@/hooks/useAcademy';
import { invoke } from '@/lib/api';
import { money } from '@/lib/utils';
import type { MockPaymentResult, SandboxPayment } from '@/types/atmalis';
import PageHeading from '@/components/features/PageHeading';
import SandboxPaymentForm, { type SandboxFields } from '@/components/forms/SandboxPaymentForm';
import SandboxResult from '@/components/features/SandboxResult';
export default function PaymentSandboxPage() {
  const { user } = useAuth(); const { t } = useLocale(); const [params] = useSearchParams(); const cache = useQueryClient(); const [result, setResult] = useState<MockPaymentResult | null>(null);
  const rawAmount = Number(params.get('amount')); const amount = rawAmount > 0 && rawAmount <= 100000 ? rawAmount : 89;
  const history = useAcademyRows<SandboxPayment>('atmalis_sandbox_payments', { user_id: user?.id || '' }, !!user);
  const run = useMutation({ mutationFn: (values: SandboxFields) => invoke<MockPaymentResult>('atmalis-payment-mock', { ...values, persist: !!user, course_title: params.get('course') || 'Atmalis development test' }), onSuccess: data => { setResult(data); cache.invalidateQueries({ queryKey: ['academy','atmalis_sandbox_payments'] }); }, onError: (error: Error) => toast.error(error.message) });
  return <div className="page-wrap"><PageHeading eyebrow="Development mode" title="Test payments without moving money." description="NOWPayments is mocked, not connected to its real API or sandbox."/><div className="flex items-start gap-3 rounded-2xl border border-accent-foreground/20 bg-accent p-5"><FlaskConical size={24} className="shrink-0 text-accent-foreground"/><p className="text-base font-medium leading-relaxed text-accent-foreground">{t('Mock only — no funds move and no paid course access is granted.')}</p></div><div className="grid items-start gap-6 lg:grid-cols-2"><SandboxPaymentForm amount={amount} busy={run.isPending} submit={values => run.mutate(values)}/><SandboxResult result={result}/></div><section className="panel p-6"><h2 className="section-heading">{t('Sandbox history')}</h2>{!user ? <p className="mt-4 leading-relaxed text-muted-foreground">{t('Sign in to save test history. Guest tests are not stored.')} <Link className="font-semibold text-primary underline" to="/auth?next=/payments/sandbox">{t('Sign in')}</Link></p> : history.isLoading ? <p className="mt-4">{t('Please wait…')}</p> : history.data?.length ? <ul className="mt-5 divide-y">{history.data.slice(0,10).map(item => <li key={item.id} className="flex flex-wrap items-center justify-between gap-4 py-4"><div><p className="font-semibold">{item.course_title}</p><p className="mt-1 text-sm text-muted-foreground">{item.provider === 'nowpayments_mock' ? 'NOWPayments · Mock' : `${t('Sham Cash')} · Mock`}</p></div><div className="text-end"><p className="font-bold text-primary">{money(item.amount)}</p><p className="mt-1 text-sm">{t(item.status === 'succeeded' ? 'Test successful' : item.status === 'failed' ? 'Test failed' : 'Test pending')}</p></div></li>)}</ul> : <p className="mt-4 text-muted-foreground">{t('No tests recorded yet.')}</p>}</section></div>;
}
