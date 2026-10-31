import { Languages } from 'lucide-react';
import { useLocale, type Language } from '@/hooks/useLocale';
export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useLocale();
  return <div className="flex items-center gap-2"><Languages size={18} className="hidden shrink-0 text-primary sm:block" aria-hidden="true"/><label htmlFor="platform-language" className="sr-only">{t('Language')}</label><select id="platform-language" value={language} onChange={event => setLanguage(event.target.value as Language)} className="min-h-11 w-auto rounded-xl border-border bg-secondary px-3 py-2 text-sm font-semibold text-primary" aria-label={t('Language')}><option value="ar">العربية</option><option value="en">English</option><option value="tr">Türkçe</option></select></div>;
}
