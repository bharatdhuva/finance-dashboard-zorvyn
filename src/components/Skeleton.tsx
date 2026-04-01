export function SkeletonBox({ className = '' }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-xl bg-muted ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/5 to-transparent animate-shimmer" />
    </div>
  );
}
