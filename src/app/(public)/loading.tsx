export default function PublicLoading() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-3 border-[var(--color-border)] border-t-[var(--color-primary)] rounded-full animate-spin mx-auto" />
        <p className="text-[var(--color-text-muted)] text-sm">Loading...</p>
      </div>
    </div>
  );
}
