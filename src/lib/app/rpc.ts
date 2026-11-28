import { supabase } from "@/integrations/supabase/client";

type Result = PromiseLike<{ data: unknown; error: { message: string } | null }>;

/**
 * Calls a database function that isn't in the generated types.ts yet (the ones in docs/sql/). Once types.ts is
 * regenerated, call supabase.rpc directly and delete this. Lazy on purpose: importing must not create the client.
 */
export const rpc = (fn: string, args?: Record<string, unknown>): Result =>
  (supabase.rpc as unknown as (fn: string, args?: Record<string, unknown>) => Result).call(supabase, fn, args);

/** The rows of a function that returns a table; throws its error. */
export async function rows<T>(fn: string, args?: Record<string, unknown>): Promise<T[]> {
  const { data, error } = await rpc(fn, args);
  if (error) throw error;
  return (data ?? []) as T[];
}
