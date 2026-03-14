export default function MainLoading() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-48 bg-[var(--color-card-bg)] rounded-lg animate-pulse" />
        <div className="h-4 w-64 bg-[var(--color-card-bg)] rounded-lg animate-pulse" />
      </div>
      {/* Cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 bg-[var(--color-card-bg)] rounded-2xl animate-pulse border border-[var(--color-border)]" />
        ))}
      </div>
      {/* Content skeleton */}
      <div className="h-64 bg-[var(--color-card-bg)] rounded-2xl animate-pulse border border-[var(--color-border)]" />
    </div>
  );
}
