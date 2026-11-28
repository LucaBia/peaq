import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Result = PromiseLike<{ data: unknown; error: { message: string } | null }>;
/** The name of a database function: a typo here doesn't compile. */
export type DbFunction = keyof Database["public"]["Functions"];

/**
 * Calls a database function by name. The names are checked against the generated types; arguments and rows are typed
 * by the callers (rows<T>), which keep the mapping to the app's own types in one place. Lazy on purpose: importing
 * must not create the client.
 */
export const rpc = (fn: DbFunction, args?: Record<string, unknown>): Result =>
  (supabase.rpc as unknown as (fn: string, args?: Record<string, unknown>) => Result).call(supabase, fn, args);

/** The rows of a function that returns a table; throws its error. */
export async function rows<T>(fn: DbFunction, args?: Record<string, unknown>): Promise<T[]> {
  const { data, error } = await rpc(fn, args);
  if (error) throw error;
  return (data ?? []) as T[];
}
