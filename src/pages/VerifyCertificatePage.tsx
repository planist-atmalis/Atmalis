import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ShieldCheck, ShieldX, GraduationCap } from 'lucide-react';
import { useLocale } from '@/hooks/useLocale';
import { rpc } from '@/lib/api';
import type { VerifiedCertificate } from '@/types/atmalis';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';
import PageHeading from '@/components/features/PageHeading';
import EmptyState from '@/components/features/EmptyState';
import CertificateVerificationForm from '@/components/forms/CertificateVerificationForm';
export default function VerifyCertificatePage() {
  const { serial = '' } = useParams(); const { t, language } = useLocale();
  const query = useQuery({ queryKey: ['certificate-verification',serial], queryFn: () => rpc<VerifiedCertificate[]>('atmalis_verify_certificate', { certificate_serial: serial.toUpperCase() }), enabled: !!serial, retry: 1 });
  const certificate = query.data?.[0]; const valid = certificate?.status === 'valid'; const Icon = valid ? ShieldCheck : ShieldX;
  return <main className="min-h-screen bg-background p-5 sm:p-8"><div className="mx-auto flex max-w-5xl items-center justify-between gap-4"><Link to="/" className="flex min-h-11 items-center gap-3 text-2xl font-bold text-primary"><GraduationCap size={30}/>Atmalis</Link><LanguageSwitcher/></div><div className="mx-auto mt-10 max-w-5xl space-y-8"><PageHeading eyebrow="Atmalis" title="Verify an Atmalis certificate" description="Scan the QR code or enter the exact serial number."/><div className="grid items-start gap-6 lg:grid-cols-2"><CertificateVerificationForm/>{query.isLoading ? <p className="panel p-8">{t('Please wait…')}</p> : query.error ? <EmptyState error title="Check your connection and retry." description={query.error.message}><button className="btn-secondary" onClick={() => query.refetch()}>{t('Retry')}</button></EmptyState> : certificate ? <section className="panel p-8"><Icon size={44} className={valid ? 'text-primary' : 'text-destructive'}/><h2 className="mt-5 text-2xl font-bold">{t(valid ? 'Valid certificate' : 'Revoked certificate')}</h2><p className="mt-6 text-sm text-muted-foreground">{t('This certifies that')}</p><p className="mt-2 text-2xl font-bold text-primary">{certificate.learner_name}</p><p className="mt-5 text-muted-foreground">{t('has completed the course')}</p><p className="mt-2 text-lg font-semibold">{certificate.course_title}</p><p className="mt-6 text-sm text-muted-foreground">{t('Issued on')}: {new Date(certificate.issued_at).toLocaleDateString(language)}</p><p dir="ltr" className="mt-2 break-all text-sm">{certificate.serial}</p></section> : serial ? <EmptyState error title="Certificate not found" description="Check the serial number and try again."/> : null}</div></div></main>;
}
