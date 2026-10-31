import { Link } from 'react-router-dom';
import EmptyState from '@/components/features/EmptyState';
export default function NotFound() { return <div className="page-wrap"><EmptyState title="This chapter hasn’t been written" description="The page you’re looking for isn’t here. Let’s get you back to your workspace."><Link className="btn-primary" to="/">Back to overview</Link></EmptyState></div>; }
