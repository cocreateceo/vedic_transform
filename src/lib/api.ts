const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export async function apiFetch(path: string, options?: RequestInit & { token?: string }) {
  const { token, ...fetchOptions } = options || {};
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options?.headers as Record<string, string> || {}),
  };

  const savedToken = token || (typeof window !== "undefined" ? localStorage.getItem("vedic-token") : null);
  if (savedToken) headers["Authorization"] = `Bearer ${savedToken}`;

  const res = await fetch(`${API_URL}${path}`, { ...fetchOptions, headers });
  return res.json();
}
