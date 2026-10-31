import { useSearchParams, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import type { Role } from '@/types/academy';
export function useWorkspace() {
  const { user, role } = useAuth(); const [params, setParams] = useSearchParams();
  const { pathname } = useLocation();
  const preview = params.get('view') || (pathname.startsWith('/admin') ? 'super_admin' : pathname === '/instructor' ? 'instructor' : 'student'); const previewRole: Role = preview === 'instructor' || preview === 'super_admin' ? preview : 'student';
  return { isDemo: !user, view: user ? role : previewRole, setView: (view: string) => setParams(view === 'student' ? {} : { view }) };
}
