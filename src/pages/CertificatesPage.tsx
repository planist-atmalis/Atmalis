import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useLocale } from '@/hooks/useLocale';
import { rpc, rows } from '@/lib/api';
import type { Certificate } from '@/types/atmalis';
import PageHeading from '@/components/features/PageHeading';
import CertificateCard from '@/components/features/CertificateCard';
import EmptyState from '@/components/features/EmptyState';
export default function CertificatesPage() {
  const { user } = useAuth(); const { t } = useLocale();
  const certificates = useQuery({ queryKey: ['academy','certificates',user?.id], queryFn: async () => { await rpc('atmalis_sync_my_certificates'); return rows<Certificate>('atmalis_certificates', { user_id: user!.id }); }, enabled: !!user, refetchInterval: 30000 });
  useEffect(() => { if (certificates.error) toast.error(certificates.error.message); }, [certificates.error]);
  return <div className="page-wrap certificates-page"><PageHeading eyebrow="Certificates" title="Your achievements, verified." description="Certificates are issued automatically after real enrollment and completion of every lesson."><Link to="/verify" className="btn-secondary">{t('Verify certificate')}</Link></PageHeading>{certificates.isLoading ? <p className="panel p-8">{t('Loading certificates…')}</p> : certificates.error ? <EmptyState error title="Check your connection and retry." description={certificates.error.message}><button className="btn-secondary" onClick={() => certificates.refetch()}>{t('Retry')}</button></EmptyState> : certificates.data?.length ? <div className="grid gap-8 lg:grid-cols-2">{certificates.data.map(certificate => <CertificateCard key={certificate.id} certificate={certificate}/>)}</div> : <EmptyState title="No certificates yet" description="Complete a course to earn your first Atmalis certificate."><Link className="btn-primary" to={user ? '/my-learning' : '/auth?next=/certificates'}>{t(user ? 'My learning' : 'Sign in')}</Link></EmptyState>}<p className="text-sm leading-relaxed text-muted-foreground">{t('Your name and course title are visible to anyone with the verification link.')}</p></div>;
}
