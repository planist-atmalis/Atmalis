import { useLocale } from '@/hooks/useLocale';
export default function WorkspaceLoading() { const { t } = useLocale(); return <div className="page-wrap"><div className="panel p-10" role="status"><p className="eyebrow mb-3">Atmalis</p><p className="text-lg font-semibold text-primary">{t('Preparing your workspace…')}</p></div></div>; }
