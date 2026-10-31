import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { TRANSLATIONS } from '@/constants/translations';
interface Props { children: ReactNode; }
interface State { error: boolean; }
export default class ErrorBoundary extends Component<Props, State> {
  state = { error: false };
  static getDerivedStateFromError() { return { error: true }; }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error('Academy render error', error.message, info.componentStack); }
  render() { const language = document.documentElement.lang; const t = (text: string) => language === 'en' ? text : TRANSLATIONS[text]?.[language === 'ar' ? 0 : 1] || text; return this.state.error ? <div className="m-8 panel p-8 text-center"><AlertTriangle className="mx-auto mb-4 text-destructive"/><h1 className="text-xl font-bold">Atmalis · {t('Something interrupted your workspace')}</h1><p className="my-3 text-muted-foreground">{t('Please refresh the page to reconnect.')}</p><button className="btn-secondary" onClick={() => location.reload()}>{t('Refresh page')}</button></div> : this.props.children; }
}
