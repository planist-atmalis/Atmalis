import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { GraduationCap, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useLocale } from '@/hooks/useLocale';
import { authSchema } from '@/lib/validations';
import { signIn, sendOtp, finishRegistration } from '@/lib/auth';
import AuthBrandPanel from '@/components/features/AuthBrandPanel';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';
export default function AuthPage() {
  const { user, loading, setUser, recovery } = useAuth(); const { t } = useLocale(); const navigate = useNavigate(); const [params] = useSearchParams();
  const [registerMode, setRegisterMode] = useState(params.get('mode') === 'register'); const [sent, setSent] = useState(false); const [busy, setBusy] = useState(false); const [error, setError] = useState('');
  const form = useForm<z.infer<typeof authSchema>>({ resolver: zodResolver(authSchema), defaultValues: { email: '', password: '', username: '', token: '' } });
  const next = params.get('next') || ''; const destination = /^\/(?![\/\\])/.test(next) && !next.startsWith('/auth') ? next : '/';
  useEffect(() => { if (!loading && user && !busy && !(registerMode && sent)) navigate(recovery ? '/auth/recovery' : destination, { replace: true }); }, [user, loading, busy, registerMode, sent, recovery, destination, navigate]);
  const submit = form.handleSubmit(async values => {
    setBusy(true); setError('');
    const action = registerMode ? sent ? finishRegistration(values.email, values.token || '', values.password, values.username || values.email.split('@')[0]) : sendOtp(values.email) : signIn(values.email, values.password);
    await action.then(result => {
      if (registerMode && !sent) { setSent(true); setBusy(false); toast.success(t('A 4-digit verification code has been sent to your email.')); return; }
      if (result) setUser(result); toast.success(t(registerMode ? 'Your account is ready. Welcome to Atmalis.' : 'Welcome back.')); navigate(destination, { replace: true });
    }).catch((err: Error) => { setError(err.message); toast.error(err.message); setBusy(false); });
  });
  return <div className="grid min-h-screen lg:grid-cols-2"><AuthBrandPanel/><main className="flex items-center justify-center p-5 sm:p-10"><div className="w-full max-w-md"><div className="mb-8 flex items-center justify-between gap-4"><Link to="/" className="inline-flex min-h-11 items-center gap-2 text-2xl font-bold text-primary"><GraduationCap size={28}/>Atmalis</Link><LanguageSwitcher/></div><p className="eyebrow mb-3">{t(registerMode ? 'Start your journey' : 'Your workspace awaits')}</p><h1 className="text-3xl font-bold tracking-tight">{t(registerMode ? 'Make room for growth.' : 'Welcome back.')}</h1><p className="mt-3 text-base leading-relaxed text-muted-foreground">{t(registerMode ? 'Create your student account. Your next chapter starts here.' : 'Sign in to continue learning, creating, and growing.')}</p>
    <div className="my-7 flex rounded-xl bg-muted p-1">{[false, true].map(mode => <button key={String(mode)} disabled={busy} className={`btn flex-1 ${registerMode === mode ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground'}`} onClick={() => { setRegisterMode(mode); setSent(false); setError(''); }}>{t(mode ? 'Create account' : 'Sign in')}</button>)}</div>
    <form onSubmit={submit} className="space-y-5">{registerMode && <div className="field"><label htmlFor="username">{t('Full name')}</label><input id="username" autoComplete="name" placeholder={t('Your name')} {...form.register('username')}/></div>}<div className="field"><label htmlFor="email">{t('Email address')}</label><input id="email" type="email" dir="ltr" autoComplete="email" placeholder="you@example.com" readOnly={sent} {...form.register('email')}/>{form.formState.errors.email && <p className="field-error"><AlertCircle size={16}/>{t(form.formState.errors.email.message || '')}</p>}</div><div className="field"><label htmlFor="password">{t(registerMode ? 'Create a password' : 'Password')}</label><input id="password" type="password" autoComplete={registerMode ? 'new-password' : 'current-password'} placeholder={t('At least 6 characters')} {...form.register('password')}/>{form.formState.errors.password && <p className="field-error"><AlertCircle size={16}/>{t(form.formState.errors.password.message || '')}</p>}{!registerMode && <Link className="flex min-h-11 items-center text-sm font-semibold text-primary" to="/auth/forgot-password">{t('Forgot password?')}</Link>}</div>
    {sent && <div className="field"><label htmlFor="token">{t('4-digit email verification code')}</label><input id="token" dir="ltr" inputMode="numeric" maxLength={4} required pattern="[0-9]{4}" autoComplete="one-time-code" placeholder="0000" {...form.register('token')}/><p className="text-sm leading-relaxed text-muted-foreground">{t('Check your inbox and spam folder. The code expires in one hour.')}</p></div>}{error && <p role="alert" className="field-error"><AlertCircle size={16}/>{error}</p>}<button className="btn-primary w-full" disabled={busy}>{t(busy ? 'Please wait…' : registerMode ? sent ? 'Verify & create account' : 'Send verification code' : 'Sign in')}{!busy && <ArrowRight size={17} className="directional-icon"/>}</button></form>
    <div className="mt-7 flex items-start gap-2 text-sm leading-relaxed text-muted-foreground"><ShieldCheck size={18} className="mt-1 shrink-0 text-primary"/>{t('Student accounts are created automatically. Instructor access requires administrator approval.')}</div><Link to="/" className="mt-5 flex min-h-11 items-center justify-center text-sm font-semibold text-primary">{t('Explore the workspace first')}</Link></div></main></div>;
}
