import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import type { Role } from '@/types/academy';
import EmptyState from '@/components/features/EmptyState';
import WorkspaceLoading from '@/components/features/WorkspaceLoading';
interface Props { roles?: Role[]; }
export default function ProtectedRoute({ roles }: Props) {
  const { user, loading, roleLoading, role } = useAuth(); const location = useLocation();
  if (loading || roleLoading) return <WorkspaceLoading/>;
  if (!user) return <Navigate to={`/auth?next=${encodeURIComponent(location.pathname)}`} replace/>;
  if (roles && !roles.includes(role)) return <div className="page-wrap"><EmptyState error title="This workspace requires a different role" description="Your current account does not have permission to access this area. Contact your academy administrator if you need access."/></div>;
  return <Outlet/>;
}
