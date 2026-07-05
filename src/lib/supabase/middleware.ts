import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { env } from "~/env";
import type { Locale } from "~/lib/i18n";

const ES_COUNTRIES = new Set(["AR","MX","CO","CL","PE","VE","EC","GT","CU","BO","DO","HN","PY","SV","NI","CR","PA","UY","ES","GQ"]);
const PT_COUNTRIES = new Set(["BR","PT","MZ","AO","CV","GW","ST","TL"]);

function detectLocale(request: NextRequest): Locale | null {
  // Country headers: Vercel injects x-vercel-ip-country; Cloudflare (if it
  // proxies the VPS) injects cf-ipcountry. Self-hosted without a proxy has
  // neither and falls back to Accept-Language below (browser language).
  const country = request.headers.get("x-vercel-ip-country") ?? request.headers.get("cf-ipcountry") ?? undefined;
  if (country) {
    if (ES_COUNTRIES.has(country)) return "es";
    if (PT_COUNTRIES.has(country)) return "pt";
    return "en";
  }
  // Fallback: Accept-Language header (works in all environments).
  const al = (request.headers.get("accept-language") ?? "").toLowerCase();
  if (al.startsWith("es") || al.includes(",es") || al.includes("es-")) return "es";
  if (al.startsWith("pt") || al.includes(",pt") || al.includes("pt-")) return "pt";
  return null; // unknown — let the client decide
}

/**
 * Refreshes the Supabase session on every request (keeps the auth cookie
 * fresh) and guards the dashboard. Unauthenticated hits to /dashboard/* are
 * redirected to /login?next=<path>.
 *
 * IMPORTANT: do not run any logic between createServerClient and getUser —
 * the Supabase SSR docs warn this can cause hard-to-debug session bugs.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL!,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Guard the dashboard + website builder — send anonymous visitors to login,
  // remembering where they were headed so we can bounce them back after sign-in.
  const guarded = request.nextUrl.pathname.startsWith("/dashboard") || request.nextUrl.pathname.startsWith("/editor") || request.nextUrl.pathname.startsWith("/onboarding");
  if (!user && guarded) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // Keep signed-in users out of the auth screens.
  if (user && (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/register")) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  // Set lang-geo cookie if the user has not overridden it manually.
  // This is read by LangProvider on the client to auto-detect locale by country.
  if (!request.cookies.get("lang-user")) {
    const locale = detectLocale(request);
    if (locale) {
      supabaseResponse.cookies.set("lang-geo", locale, {
        path: "/",
        maxAge: 60 * 60 * 24, // 1 day — refresh every visit
        sameSite: "lax",
      });
    }
  }

  return supabaseResponse;
}
