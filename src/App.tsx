import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/hooks/useAuth';
import SiteShell from '@/components/layout/SiteShell';
import ScrollManager from '@/components/layout/ScrollManager';
import ErrorBoundary from '@/components/features/ErrorBoundary';
import ProtectedRoute from '@/components/features/ProtectedRoute';
const OverviewPage = lazy(() => import('@/pages/OverviewPage'));
const CatalogPage = lazy(() => import('@/pages/CatalogPage'));
const MyLearningPage = lazy(() => import('@/pages/MyLearningPage'));
const CourseDetailPage = lazy(() => import('@/pages/CourseDetailPage'));
const InstructorDashboard = lazy(() => import('@/pages/InstructorDashboard'));
const AdminDashboard = lazy(() => import('@/pages/AdminDashboard'));
const CourseEditorPage = lazy(() => import('@/pages/CourseEditorPage'));
const InstructorApplicationPage = lazy(() => import('@/pages/InstructorApplicationPage'));
const WorkPage = lazy(() => import('@/pages/WorkPage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));
const AuthPage = lazy(() => import('@/pages/AuthPage'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: true }, mutations: { retry: false } } });
export default function App() {
  return <ErrorBoundary><QueryClientProvider client={queryClient}><AuthProvider><BrowserRouter><a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-primary focus:px-5 focus:py-3 focus:text-primary-foreground">Skip to main content</a><ScrollManager/><SiteShell><Suspense fallback={<div className="page-wrap"><div className="panel p-10"><p className="eyebrow mb-3">Elevate Academy</p><p className="text-lg font-semibold text-primary">Preparing your next chapter…</p></div></div>}><Routes>
    <Route path="/" element={<OverviewPage/>}/>
    <Route path="/courses" element={<CatalogPage/>}/>
    <Route path="/courses/:id" element={<CourseDetailPage/>}/>
    <Route path="/my-learning" element={<MyLearningPage/>}/>
    <Route path="/instructor" element={<InstructorDashboard/>}/>
    <Route path="/instructor/apply" element={<InstructorApplicationPage/>}/>
    <Route path="/admin" element={<AdminDashboard/>}/>
    <Route element={<ProtectedRoute roles={['instructor', 'super_admin']}/>}>
      <Route path="/instructor/courses/new" element={<CourseEditorPage/>}/>
      <Route path="/instructor/courses/:id/edit" element={<CourseEditorPage/>}/>
    </Route>
    <Route path="/work" element={<WorkPage/>}/>
    <Route path="/settings" element={<SettingsPage/>}/>
    <Route path="/auth" element={<AuthPage/>}/>
    <Route path="*" element={<NotFound/>}/>
  </Routes></Suspense></SiteShell></BrowserRouter><Toaster position="top-right" richColors closeButton toastOptions={{ style: { background: 'hsl(var(--card))', color: 'hsl(var(--foreground))', border: '1px solid hsl(var(--border))' } }}/></AuthProvider></QueryClientProvider></ErrorBoundary>;
}
