import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
export default function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => { if (!hash) { window.scrollTo(0, 0); return; } const timeout = setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'start' }), 200); return () => clearTimeout(timeout); }, [pathname, hash]);
  return null;
}
