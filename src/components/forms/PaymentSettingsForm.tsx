import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertCircle, Save } from 'lucide-react';
import { useAcademyRows, useSave } from '@/hooks/useAcademy';
import { useLocale } from '@/hooks/useLocale';
import type { PaymentSettings } from '@/types/atmalis';
const schema = z.object({ sham_account: z.string().max(200), sham_instructions: z.string().max(4000) });
export default function PaymentSettingsForm() {
  const { t } = useLocale(); const settings = useAcademyRows<PaymentSettings>('atmalis_payment_settings'); const current = settings.data?.[0];
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), defaultValues: { sham_account: '', sham_instructions: '' } });
  const save = useSave(t('Payment instructions saved.'));
  useEffect(() => { if (current) form.reset({ sham_account: current.sham_account, sham_instructions: current.sham_instructions }); }, [current, form]);
  return <form className="panel space-y-5 p-6" onSubmit={form.handleSubmit(values => save.mutate({ table: 'atmalis_payment_settings', id: current?.id, values: { ...values, singleton: true } }))}><h2 className="section-heading">{t('Payment settings')}</h2><p className="leading-relaxed text-muted-foreground">{t('Only enter your real recipient account. No account is prefilled.')}</p><div className="field"><label htmlFor="sham-account">{t('Recipient account')}</label><input id="sham-account" dir="ltr" {...form.register('sham_account')}/>{form.formState.errors.sham_account && <p className="field-error"><AlertCircle size={16}/>{form.formState.errors.sham_account.message}</p>}</div><div className="field"><label htmlFor="sham-instructions">{t('Transfer instructions and currency')}</label><textarea id="sham-instructions" rows={5} {...form.register('sham_instructions')}/><p className="text-sm leading-relaxed text-muted-foreground">{t('Include the currency and exchange-rate policy for USD course prices.')}</p></div><button className="btn-secondary" disabled={save.isPending || settings.isLoading}><Save size={16}/>{t(save.isPending ? 'Saving…' : 'Save payment settings')}</button></form>;
}
