import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
interface Props { children: ReactNode; }
interface State { error: boolean; }
export default class ErrorBoundary extends Component<Props, State> {
  state = { error: false };
  static getDerivedStateFromError() { return { error: true }; }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error('Academy render error', error.message, info.componentStack); }
  render() { return this.state.error ? <div className="m-8 panel p-8 text-center"><AlertTriangle className="mx-auto mb-4 text-destructive"/><h1 className="text-xl font-bold">Something interrupted your workspace</h1><p className="my-3 text-muted-foreground">Please refresh the page to reconnect.</p><button className="btn-secondary" onClick={() => location.reload()}>Refresh page</button></div> : this.props.children; }
}
