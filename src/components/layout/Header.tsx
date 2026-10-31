import { Link, useLocation } from 'react-router-dom';
import { Menu, Search, Bell, ChevronDown, Check, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useWorkspace } from '@/hooks/useWorkspace';
import { initials } from '@/lib/utils';
interface Props { openSidebar: () => void; }
export default function Header({ openSidebar }: Props) {
  const { user } = useAuth(); const { isDemo, view, setView } = useWorkspace(); const [notifications, setNotifications] = useState(false); const { pathname } = useLocation();
  const section = pathname === '/' ? 'Overview' : pathname.startsWith('/admin') ? 'Management' : pathname.startsWith('/instructor') ? 'Instructor studio' : pathname === '/my-learning' ? 'My learning' : pathname === '/settings' ? 'Settings' : pathname === '/work' ? 'Work management' : 'Courses';
  return <header className="sticky top-0 z-30 flex h-[80px] items-center justify-between gap-4 border-b bg-card/95 px-5 backdrop-blur-md sm:px-8 xl:px-10">
    <div className="flex items-center gap-3"><button className="icon-btn lg:hidden" onClick={openSidebar} aria-label="Open navigation"><Menu size={22}/></button><span className="hidden text-sm text-muted-foreground sm:block">Academy</span><span className="hidden text-border sm:block">/</span><span className="text-sm font-semibold">{section}</span></div>
    <div className="flex items-center gap-3 sm:gap-5"><Link to="/courses" className="hidden min-h-11 items-center gap-2 text-sm text-muted-foreground xl:flex"><Search size={17}/><span>Search for a new skill...</span><span className="ml-5 rounded border px-1.5 text-[10px]">Explore</span></Link><span className="hidden h-6 border-l xl:block"/>
    {isDemo && <div className="relative"><label htmlFor="preview-role" className="sr-only">Preview workspace role</label><select id="preview-role" value={view} onChange={event => setView(event.target.value)} className="min-h-11 w-auto appearance-none border-0 bg-transparent py-2 pl-2 pr-7 text-xs font-semibold sm:text-sm"><option value="student">Student preview</option><option value="instructor">Instructor preview</option><option value="super_admin">Admin preview</option></select><ChevronDown size={13} className="pointer-events-none absolute right-2 top-4 text-muted-foreground"/></div>}
    <div className="relative"><button className="icon-btn" aria-label="View notifications" aria-expanded={notifications} onClick={() => setNotifications(!notifications)}><Bell size={19}/></button>{notifications && <div className="panel absolute right-0 top-14 w-72 p-5"><div className="flex items-center justify-between"><h3 className="font-bold">Notifications</h3><button className="icon-btn" onClick={() => setNotifications(false)} aria-label="Close notifications"><X size={16}/></button></div><div className="mt-4 flex items-start gap-3 text-sm"><Check size={20} className="shrink-0 text-primary"/><p className="text-muted-foreground">You’re all caught up.{view === 'super_admin' && <Link to="/admin?tab=notifications" className="mt-2 block font-semibold text-primary" onClick={() => setNotifications(false)}>Review course changes →</Link>}</p></div></div>}</div>
    <Link to={user ? '/settings' : '/auth'} className="avatar" aria-label={user ? 'Your account' : 'Sign in'}>{initials(user?.username || 'Alex Morgan')}</Link></div>
  </header>;
}
