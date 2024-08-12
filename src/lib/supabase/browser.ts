import { createBrowserClient as makeBrowserClient } from "@supabase/ssr";

export function createBrowserClient() {

  return makeBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
