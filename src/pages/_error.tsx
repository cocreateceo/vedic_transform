function Error({ statusCode }: { statusCode?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#0f0a1e", color: "#e2e8f0", fontFamily: "system-ui" }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "3rem", fontWeight: "bold", color: "#7c3aed" }}>{statusCode || "Error"}</h1>
        <p style={{ color: "#94a3b8", marginTop: "1rem" }}>
          {statusCode === 404 ? "Page not found" : "An error occurred"}
        </p>
      </div>
    </div>
  );
}

Error.getInitialProps = ({ res, err }: { res?: { statusCode: number }; err?: { statusCode: number } }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
