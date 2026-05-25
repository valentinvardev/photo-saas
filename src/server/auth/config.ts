import { type NextAuthConfig } from "next-auth";

/**
 * Auth is handled by Supabase (see src/lib/supabase/client.ts and server.ts).
 * NextAuth is kept as a stub so the /api/auth route doesn't 404, but it is
 * not the primary auth mechanism — do not add providers here.
 */
export const authConfig = {
  providers: [],
} satisfies NextAuthConfig;
