/**
 * Lightweight in-memory cache with TTL support.
 *
 * Prevents duplicate Supabase round-trips when the user navigates
 * between pages within the same session.
 *
 * Usage:
 *   const data = await cacheGet('education', () => supabase.from('education').select('*'));
 */

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const store = new Map<string, CacheEntry<unknown>>();

/** Default TTL: 2 minutes (ms) */
const DEFAULT_TTL = 2 * 60 * 1000;

export function cacheGet<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = DEFAULT_TTL
): Promise<T> {
  const entry = store.get(key) as CacheEntry<T> | undefined;
  if (entry && Date.now() < entry.expiresAt) {
    return Promise.resolve(entry.data);
  }

  return fetcher().then((data) => {
    store.set(key, { data, expiresAt: Date.now() + ttl });
    return data;
  });
}

/** Manually bust a cache key (call after a write/update/delete). */
export function cacheBust(key: string): void {
  store.delete(key);
}

/** Bust all cache keys that start with a prefix. */
export function cacheBustPrefix(prefix: string): void {
  for (const key of store.keys()) {
    if (key.startsWith(prefix)) store.delete(key);
  }
}
