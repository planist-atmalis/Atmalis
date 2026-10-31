import { Link } from 'react-router-dom';
import EmptyState from '@/components/features/EmptyState';
import { useLocale } from '@/hooks/useLocale';
export default function NotFound() { const { t } = useLocale(); return <div className="page-wrap"><EmptyState title="This chapter hasn’t been written" description="The page you’re looking for isn’t here. Let’s get you back to your workspace."><Link className="btn-primary" to="/">{t('Overview')}</Link></EmptyState></div>; }
