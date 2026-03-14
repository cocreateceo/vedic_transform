"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", fontFamily: "system-ui, sans-serif", background: "#0f0a1e", color: "#e2e8f0" }}>
          <div style={{ textAlign: "center", maxWidth: "400px", padding: "2rem" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>Something went wrong</h2>
            <p style={{ color: "#94a3b8", marginBottom: "1.5rem" }}>{error.message || "An unexpected error occurred."}</p>
            <button
              onClick={reset}
              style={{ padding: "0.75rem 2rem", background: "#7c3aed", color: "white", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: "600" }}
            >
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
