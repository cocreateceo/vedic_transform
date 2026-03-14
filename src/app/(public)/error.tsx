"use client";

export default function PublicError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] flex items-center justify-center px-4">
      <div className="text-center space-y-4 max-w-md">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto">
          <span className="text-2xl">⚠️</span>
        </div>
        <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Something went wrong</h2>
        <p className="text-[var(--color-text-secondary)] text-sm">{error.message || "An unexpected error occurred. Please try again."}</p>
        <button
          onClick={reset}
          className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary-hover)] transition-colors text-sm font-medium"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
