import { useAuth } from '@/hooks/useAuth';
import { useWorkspace } from '@/hooks/useWorkspace';
import { lazy } from 'react';
const StudentDashboard = lazy(() => import('@/pages/StudentDashboard'));
const InstructorDashboard = lazy(() => import('@/pages/InstructorDashboard'));
const AdminDashboard = lazy(() => import('@/pages/AdminDashboard'));
const WorkPage = lazy(() => import('@/pages/WorkPage'));
export default function OverviewPage() {
  const { user, roleLoading } = useAuth(); const { view } = useWorkspace();
  if (user && roleLoading) return <div className="page-wrap"><p className="panel p-8 text-muted-foreground">Preparing your workspace…</p></div>;
  return view === 'super_admin' ? <AdminDashboard/> : view === 'instructor' ? <InstructorDashboard/> : view === 'employee' ? <WorkPage/> : <StudentDashboard/>;
}
