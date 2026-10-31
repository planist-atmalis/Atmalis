import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { GraduationCap, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLocale } from '@/hooks/useLocale';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';
import RecoveryRequestForm from '@/components/forms/RecoveryRequestForm';
import RecoveryCodeForm from '@/components/forms/RecoveryCodeForm';
import RecoveryPasswordForm from '@/components/forms/RecoveryPasswordForm';
export default function RecoveryPage() {
  const { t } = useLocale(); const { user, loading, recovery } = useAuth(); const { pathname } = useLocation(); const navigate = useNavigate(); const [params] = useSearchParams(); const [email, setEmail] = useState('');
  const callback = pathname === '/auth/recovery'; const invalid = params.has('error') || params.has('error_code');
  useEffect(() => { if (callback && recovery && user && !invalid) navigate('/auth/recovery', { replace: true }); }, [callback, recovery, user, invalid, navigate]);
  return <main className="min-h-screen bg-background p-5 sm:p-8"><div className="mx-auto flex max-w-6xl items-center justify-between gap-4"><Link to="/" className="flex min-h-11 items-center gap-3 text-2xl font-bold text-primary"><GraduationCap size={30}/>Atmalis</Link><LanguageSwitcher/></div><div className="mx-auto mt-12 grid max-w-5xl items-start gap-8 lg:grid-cols-[1fr_1.1fr]"><section className="rounded-2xl bg-primary p-8 text-primary-foreground"><ShieldCheck size={32}/><p className="mt-8 text-base font-semibold">Atmalis</p><h1 className="mt-3 text-3xl font-bold leading-snug">{t('Recover your Atmalis account')}</h1><p className="mt-5 text-base leading-relaxed text-primary-foreground/90">{t('We will email a secure recovery link. No password is sent by email.')}</p></section><section className="panel space-y-6 p-6 sm:p-8"><h2 className="section-heading">{t('Password recovery')}</h2>{loading ? <p>{t('Please wait…')}</p> : callback && user && recovery && !invalid ? <RecoveryPasswordForm/> : callback ? <><p role="alert" className="field-error"><ShieldCheck size={18} className="shrink-0"/>{t('Recovery link expired or invalid. Request a new email.')}</p><RecoveryCodeForm email=""/><Link className="btn-secondary w-full" to="/auth/forgot-password">{t('Request another link')}</Link></> : email ? <><h3 className="font-semibold text-primary">{t('Check your email')}</h3><p className="leading-relaxed text-muted-foreground">{t('Use the recovery link or enter the 4-digit code from the email.')}</p><RecoveryCodeForm email={email}/></> : <RecoveryRequestForm sent={setEmail}/>}<Link to="/auth" className="btn-ghost w-full">{t('Back to sign in')}</Link></section></div></main>;
}
