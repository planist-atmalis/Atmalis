import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { TRANSLATIONS } from '@/constants/translations';
export type Language = 'en' | 'ar' | 'tr';
interface LocaleContextValue { language: Language; rtl: boolean; setLanguage: (language: Language) => void; t: (text: string, values?: Record<string, string | number>) => string; }
const LocaleContext = createContext<LocaleContextValue | null>(null);
export function LocaleProvider({ children }: { children: ReactNode }) {
  const [language, updateLanguage] = useState<Language>(() => { const saved = localStorage.getItem('atmalis-language'); return saved === 'ar' || saved === 'tr' || saved === 'en' ? saved : 'ar'; });
  useEffect(() => { document.documentElement.lang = language; document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'; localStorage.setItem('atmalis-language', language); }, [language]);
  const setLanguage = (next: Language) => { document.documentElement.lang = next; document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr'; localStorage.setItem('atmalis-language', next); updateLanguage(next); };
  const t = (text: string, values: Record<string, string | number> = {}) => {
    const translated = language === 'en' ? text : TRANSLATIONS[text]?.[language === 'ar' ? 0 : 1] || text;
    return translated.replace(/\{(\w+)\}/g, (match, key: string) => values[key] === undefined ? match : String(values[key]));
  };
  return <LocaleContext.Provider value={{ language, rtl: language === 'ar', setLanguage, t }}>{children}</LocaleContext.Provider>;
}
export function useLocale() { const context = useContext(LocaleContext); if (!context) throw new Error('LocaleProvider is required.'); return context; }
