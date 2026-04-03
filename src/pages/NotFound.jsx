import { useLocation } from 'react-router-dom';

const NotFound = () => {
  const location = useLocation();

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-2xl border border-border ambient-surface p-8 text-center">
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Navigation error</p>
        <h1 className="mt-3 text-4xl font-bold text-foreground">Page not available</h1>
        <p className="mt-3 text-muted-foreground">
          The route <span className="font-medium text-foreground">{location.pathname}</span> does not exist in this dashboard workspace.
        </p>
        <a href="/" className="mt-5 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
          Back to dashboard
        </a>
      </div>
    </div>
  );
};

export default NotFound;
