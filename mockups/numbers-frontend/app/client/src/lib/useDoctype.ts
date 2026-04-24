/*
 * useDoctype — tiny React hook for fetching a DocType list.
 *
 * In mockup mode it returns the seed data immediately (synchronous-looking,
 * one-tick deferred). In live mode it talks to /api/resource/<DocType> via
 * `lib/api.ts`. Either way the call site looks the same.
 *
 *   const { data, loading, error, refresh } = useDoctype<SalesOrder>("sales-order");
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { list, type ListOpts } from "./api";

export interface UseDoctypeResult<T> {
  data: T[];
  loading: boolean;
  error: Error | null;
  refresh: () => void;
}

export function useDoctype<T = any>(slug: string, opts?: ListOpts): UseDoctypeResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const tick = useRef(0);

  // Stabilise opts so callers can pass an object literal without thrashing.
  const optsRef = useRef(opts);
  optsRef.current = opts;

  const refresh = useCallback(() => {
    tick.current += 1;
    setLoading(true);
    setError(null);
    list<T>(slug, optsRef.current)
      .then((rows) => { setData(rows); setLoading(false); })
      .catch((e) => { setError(e as Error); setLoading(false); });
  }, [slug]);

  useEffect(() => { refresh(); }, [refresh]);

  return { data, loading, error, refresh };
}

export default useDoctype;
