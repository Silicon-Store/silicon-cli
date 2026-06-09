import { API_BASE, getToken } from './config.js';

/**
 * Product API client. Uses the stored CLI token as a Bearer — the same Product
 * API the dashboard, MCP, and Skills all call. No extraction logic here.
 */
async function call<T>(path: string, body?: unknown): Promise<T> {
  const token = getToken();
  if (!token) throw new Error('Not signed in. Run `silicon auth login`.');

  const res = await fetch(`${API_BASE}${path}`, {
    method: body === undefined ? 'GET' : 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const text = await res.text();
  const json = text ? JSON.parse(text) : {};
  if (!res.ok) {
    throw new Error(json?.error?.message || `Request failed (${res.status}).`);
  }
  return json as T;
}

export const me = () =>
  call<{ account_id: string; email: string; name: string; tier: string }>('/v1/me');

export const product = (url: string) => call('/v1/product', { url });

export const search = (query: string, region = 'UK') => call('/v1/search', { query, region });

export const compare = (query: string, region = 'UK') => call('/v1/compare', { query, region });

export const retailers = (region?: string) =>
  call(`/v1/retailers${region ? `?region=${encodeURIComponent(region)}` : ''}`);
