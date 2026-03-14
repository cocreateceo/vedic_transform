import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#0f0a1e", color: "#e2e8f0", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <h1 style={{ fontSize: "4rem", fontWeight: "bold", color: "#7c3aed", marginBottom: "1rem" }}>404</h1>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Page Not Found</h2>
        <p style={{ color: "#94a3b8", marginBottom: "2rem" }}>The page you are looking for does not exist.</p>
        <Link href="/" style={{ padding: "0.75rem 2rem", background: "#7c3aed", color: "white", borderRadius: "12px", textDecoration: "none", fontWeight: "600" }}>
          Go Home
        </Link>
      </div>
    </div>
  );
}
