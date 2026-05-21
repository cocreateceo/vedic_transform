const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export class ApiError extends Error {
  constructor(public status: number, public body: unknown, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

// Returns parsed JSON. Typed as `any` because callers know the shape of
// each endpoint and the codebase doesn't carry response types yet.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function apiFetch(path: string, options?: RequestInit & { token?: string }): Promise<any> {
  const { token, ...fetchOptions } = options || {};
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options?.headers as Record<string, string> || {}),
  };

  const savedToken = token || (typeof window !== "undefined" ? localStorage.getItem("vedic-token") : null);
  if (savedToken) headers["Authorization"] = `Bearer ${savedToken}`;

  const res = await fetch(`${API_URL}${path}`, { ...fetchOptions, headers });

  // Try to parse JSON even on error — most error responses are JSON.
  let body: unknown = null;
  const text = await res.text();
  if (text) {
    try { body = JSON.parse(text); } catch { body = text; }
  }

  if (!res.ok) {
    // 401 → token is gone or expired. Surface a stable error so the auth
    // context can reset its state without each caller hand-checking status.
    if (res.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("vedic-token");
      localStorage.removeItem("vedic-user");
    }
    const errMsg =
      body && typeof body === "object" && "error" in body && typeof (body as { error: unknown }).error === "string"
        ? (body as { error: string }).error
        : `Request failed with status ${res.status}`;
    throw new ApiError(res.status, body, errMsg);
  }

  return body;
}
