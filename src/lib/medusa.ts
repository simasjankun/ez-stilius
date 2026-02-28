const MEDUSA_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'https://api.ezstilius.lt';
const API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '';

export async function medusaFetch<T>(endpoint: string, locale = 'lt'): Promise<T> {
  const res = await fetch(`${MEDUSA_URL}${endpoint}`, {
    headers: {
      'x-publishable-api-key': API_KEY,
      'Content-Type': 'application/json',
      'x-medusa-locale': locale,
    },
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error(`Medusa API error: ${res.status}`);
  return res.json();
}
