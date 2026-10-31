import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Search, AlertCircle } from 'lucide-react';
import { useLocale } from '@/hooks/useLocale';
const schema = z.object({ serial: z.string().trim().min(5).max(80) });
export default function CertificateVerificationForm() {
  const { t } = useLocale(); const navigate = useNavigate(); const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), defaultValues: { serial: '' } });
  return <form className="panel space-y-5 p-6" onSubmit={form.handleSubmit(values => navigate(`/verify/${encodeURIComponent(values.serial.toUpperCase())}`))}><div className="field"><label htmlFor="certificate-serial">{t('Serial number')}</label><input id="certificate-serial" dir="ltr" placeholder="ATM-2026-…" {...form.register('serial')}/>{form.formState.errors.serial && <p className="field-error"><AlertCircle size={16}/>{t('Check the serial number and try again.')}</p>}</div><button className="btn-primary" type="submit"><Search size={18}/>{t('Verify')}</button></form>;
}
