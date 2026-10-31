import { useAuth } from '@/hooks/useAuth';
import { useWorkspace } from '@/hooks/useWorkspace';
import { lazy } from 'react';
import WorkspaceLoading from '@/components/features/WorkspaceLoading';
const StudentDashboard = lazy(() => import('@/pages/StudentDashboard'));
const InstructorDashboard = lazy(() => import('@/pages/InstructorDashboard'));
const AdminDashboard = lazy(() => import('@/pages/AdminDashboard'));
const WorkPage = lazy(() => import('@/pages/WorkPage'));
export default function OverviewPage() {
  const { user, roleLoading } = useAuth(); const { view } = useWorkspace();
  if (user && roleLoading) return <WorkspaceLoading/>;
  return view === 'super_admin' ? <AdminDashboard/> : view === 'instructor' ? <InstructorDashboard/> : view === 'employee' ? <WorkPage/> : <StudentDashboard/>;
}
