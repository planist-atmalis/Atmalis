import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { GraduationCap, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { authSchema } from '@/lib/validations';
import { signIn, sendOtp, finishRegistration } from '@/lib/auth';
import hero from '@/assets/academy-hero.webp';
export default function AuthPage() {
  const { user, loading, setUser } = useAuth(); const navigate = useNavigate(); const [params] = useSearchParams();
  const [registerMode, setRegisterMode] = useState(params.get('mode') === 'register'); const [sent, setSent] = useState(false); const [busy, setBusy] = useState(false); const [error, setError] = useState('');
  const form = useForm<z.infer<typeof authSchema>>({ resolver: zodResolver(authSchema), defaultValues: { email: '', password: '', username: '', token: '' } });
  const destination = params.get('next')?.startsWith('/') && !params.get('next')?.startsWith('//') && !params.get('next')?.startsWith('/auth') ? params.get('next')! : '/';
  useEffect(() => { if (!loading && user && !busy && !(registerMode && sent)) navigate(destination, { replace: true }); }, [user, loading, busy, registerMode, sent, destination, navigate]);
  const submit = form.handleSubmit(async values => {
    setBusy(true); setError('');
    const action = registerMode ? sent ? finishRegistration(values.email, values.token || '', values.password, values.username || values.email.split('@')[0]) : sendOtp(values.email) : signIn(values.email, values.password);
    await action.then(result => {
      if (registerMode && !sent) { setSent(true); setBusy(false); toast.success('A 4-digit verification code has been sent to your email.'); return; }
      if (result) setUser(result); toast.success(registerMode ? 'Your account is ready. Welcome to Elevate.' : 'Welcome back.'); navigate(destination, { replace: true });
    }).catch((err: Error) => { setError(err.message); toast.error(err.message); setBusy(false); });
  });
  return <div className="grid min-h-screen lg:grid-cols-2"><aside className="relative hidden overflow-hidden bg-primary p-12 text-primary-foreground lg:flex lg:flex-col"><img src={hero} className="absolute inset-0 h-full w-full object-cover opacity-60" alt="Sculptural book and emerald steps"/><div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/10 to-primary/95"/><Link to="/" className="relative flex items-center gap-3 text-2xl font-bold"><GraduationCap size={32}/>elevate.</Link><div className="relative mt-auto"><p className="mb-5 text-xs uppercase tracking-[.2em]">Your next chapter</p><h1 className="max-w-lg text-5xl font-bold leading-tight tracking-tight">A place to learn.<br/>A space to grow.</h1><p className="mt-6 max-w-md leading-relaxed text-primary-foreground/85">For curious minds, inspiring instructors, and teams with a shared ambition.</p></div><p className="relative mt-14 text-xs text-primary-foreground/80">One connected academy. Endless possibilities.</p></aside>
    <main className="flex items-center justify-center p-6 sm:p-12"><div className="w-full max-w-md"><Link to="/" className="mb-10 inline-flex items-center gap-2 font-bold text-primary"><GraduationCap/>elevate.</Link><p className="eyebrow mb-3">{registerMode ? 'Start your journey' : 'Your workspace awaits'}</p><h1 className="text-3xl font-extrabold tracking-tight">{registerMode ? 'Make room for growth.' : 'Welcome back.'}</h1><p className="mt-3 text-muted-foreground">{registerMode ? 'Create your student account. Your next chapter starts here.' : 'Sign in to continue learning, creating, and growing.'}</p>
    <div className="my-7 flex rounded-xl bg-muted p-1">{[false, true].map(mode => <button key={String(mode)} className={`btn flex-1 ${registerMode === mode ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground'}`} onClick={() => { setRegisterMode(mode); setSent(false); setError(''); }}> {mode ? 'Create account' : 'Sign in'}</button>)}</div>
    <form onSubmit={submit} className="space-y-5">{registerMode && <div className="field"><label htmlFor="username">Full name</label><input id="username" autoComplete="name" placeholder="Your name" {...form.register('username')}/></div>}<div className="field"><label htmlFor="email">Email address</label><input id="email" type="email" autoComplete="email" placeholder="you@example.com" readOnly={sent} {...form.register('email')}/>{form.formState.errors.email && <p className="field-error"><AlertCircle size={14}/>{form.formState.errors.email.message}</p>}</div><div className="field"><label htmlFor="password">{registerMode ? 'Create a password' : 'Password'}</label><input id="password" type="password" autoComplete={registerMode ? 'new-password' : 'current-password'} placeholder="At least 6 characters" {...form.register('password')}/>{form.formState.errors.password && <p className="field-error"><AlertCircle size={14}/>{form.formState.errors.password.message}</p>}</div>
    {sent && <div className="field"><label htmlFor="token">4-digit email verification code</label><input id="token" inputMode="numeric" maxLength={4} required pattern="[0-9]{4}" autoComplete="one-time-code" placeholder="0000" {...form.register('token')}/><p className="text-xs text-muted-foreground">Check your inbox and spam folder. The code expires in one hour.</p></div>}{error && <p role="alert" className="field-error"><AlertCircle size={16}/>{error}</p>}<button className="btn-primary w-full" disabled={busy}>{busy ? 'Please wait…' : registerMode ? sent ? 'Verify & create account' : 'Send verification code' : 'Sign in'}{!busy && <ArrowRight size={17}/>}</button></form>
    <div className="mt-7 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground"><ShieldCheck size={16} className="shrink-0 text-primary"/>Student accounts are created automatically. Instructor access requires administrator approval.</div><Link to="/" className="mt-6 block min-h-11 text-center text-sm font-semibold text-primary">Explore the workspace first →</Link></div></main></div>;
}
