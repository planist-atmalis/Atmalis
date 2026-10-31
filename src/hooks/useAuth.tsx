import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getClient, rows } from '@/lib/api';
import { mapUser, signOut } from '@/lib/auth';
import type { AuthUser, Member, Role } from '@/types/academy';
interface AuthContextValue { user: AuthUser | null; loading: boolean; role: Role; roleLoading: boolean; setUser: (user: AuthUser) => void; logout: () => Promise<void>; }
const AuthContext = createContext<AuthContextValue | null>(null);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null); const [loading, setLoading] = useState(true); const cache = useQueryClient();
  useEffect(() => {
    let mounted = true; let unsubscribe: (() => void) | undefined;
    getClient().then(client => {
      if (!mounted) return;
      client.auth.getSession().then(({ data, error }) => { if (!mounted) return; if (error) toast.error(error.message); setUser(data.session?.user ? mapUser(data.session.user) : null); setLoading(false); });
      const { data } = client.auth.onAuthStateChange((event, session) => {
        if (!mounted) return;
        if (event === 'SIGNED_OUT') { setUser(null); setLoading(false); cache.clear(); }
        else if (session?.user) { setUser(mapUser(session.user)); setLoading(false); }
        else if (event === 'INITIAL_SESSION') setLoading(false);
      }); unsubscribe = () => data.subscription.unsubscribe();
    }).catch(error => { if (mounted) { setLoading(false); toast.error(error.message); } });
    return () => { mounted = false; unsubscribe?.(); };
  }, [cache]);
  const membership = useQuery({ queryKey: ['academy', 'membership', user?.id], queryFn: () => rows<Member>('academy_members', { user_id: user!.id }), enabled: !!user, refetchInterval: 30000 });
  useEffect(() => { if (membership.error) toast.error(membership.error.message); }, [membership.error]);
  const logout = async () => { await signOut(); setUser(null); cache.clear(); toast.success('You have been signed out.'); };
  return <AuthContext.Provider value={{ user, loading, role: membership.data?.[0]?.role || 'student', roleLoading: !!user && membership.isPending, setUser, logout }}>{children}</AuthContext.Provider>;
}
export function useAuth() { const context = useContext(AuthContext); if (!context) throw new Error('AuthProvider is required.'); return context; }
