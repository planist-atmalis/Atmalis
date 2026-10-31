import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import { useLocale } from '@/hooks/useLocale';
import hero from '@/assets/academy-hero.webp';
export default function AuthBrandPanel() {
  const { t } = useLocale();
  return <aside className="relative hidden overflow-hidden bg-primary p-12 text-primary-foreground lg:flex lg:flex-col"><img src={hero} className="absolute inset-0 h-full w-full object-cover opacity-60" alt="Atmalis academy learning illustration"/><div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/10 to-primary/95"/><Link to="/" className="relative flex min-h-11 items-center gap-3 text-3xl font-bold"><GraduationCap size={34}/>Atmalis</Link><div className="relative mt-auto"><p className="mb-5 text-base font-semibold">{t('Your next chapter starts here.')}</p><h1 className="max-w-lg text-5xl font-bold leading-tight tracking-tight">{t('A place to learn.')}<br/>{t('A space to grow.')}</h1><p className="mt-6 max-w-md text-base leading-relaxed text-primary-foreground/90">{t('For curious minds, inspiring instructors, and teams with a shared ambition.')}</p></div><p className="relative mt-14 text-sm text-primary-foreground/90">{t('One connected academy. Endless possibilities.')}</p></aside>;
}
