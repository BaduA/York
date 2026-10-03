export const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1";
export const ADMIN_KEY = process.env.NEXT_PUBLIC_ADMIN_KEY ?? "";

export async function api(method: string, path: string, body?: unknown): Promise<unknown> {
  const r = await fetch(`${BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json", "x-admin-key": ADMIN_KEY },
    body: body != null ? JSON.stringify(body) : undefined,
  });
  if (!r.ok) throw new Error(`${r.status}: ${await r.text()}`);
  if (r.status === 204) return null;
  return r.json();
}
