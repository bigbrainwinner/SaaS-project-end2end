/**
 * Supabase configuration + fail-fast environment validation.
 *
 * In production we REQUIRE `NEXT_PUBLIC_SUPABASE_URL` and
 * `NEXT_PUBLIC_SUPABASE_ANON_KEY`. If either is missing, importing this
 * module throws at startup so the deploy fails visibly rather than
 * silently falling back to the mock-auth branch (which would be an
 * auth-bypass vector — see security audit Finding #2).
 *
 * Outside production the mock branch is still allowed for local
 * development without a Supabase project.
 */

const RAW_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const RAW_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Values that look present but are actually placeholders left in by
// scaffolding tools. Treat these as "not configured".
const PLACEHOLDER_MARKERS = [
  'placeholder',
  'YOUR_SUPABASE_URL',
  'YOUR_SUPABASE_ANON_KEY',
  'your-project',
];

function looksLikePlaceholder(value: string | undefined): boolean {
  if (!value) return true;
  return PLACEHOLDER_MARKERS.some((marker) => value.includes(marker));
}

const URL_OK = !looksLikePlaceholder(RAW_URL);
const KEY_OK = !looksLikePlaceholder(RAW_KEY);

// Fail fast in production. This runs at module load time, which means
// any server component / server action / proxy import will trip it and
// the deployment surfaces the misconfiguration immediately instead of
// silently degrading to the mock code path.
if (process.env.NODE_ENV === 'production' && (!URL_OK || !KEY_OK)) {
  throw new Error(
    'Missing required Supabase env vars: NEXT_PUBLIC_SUPABASE_URL and/or NEXT_PUBLIC_SUPABASE_ANON_KEY. ' +
      'Refusing to boot in production — this would silently enable the mock-auth fallback.',
  );
}

export function isSupabaseConfigured(): boolean {
  return URL_OK && KEY_OK;
}

/**
 * Whether the app is allowed to fall back to the local mock-auth path.
 * Only true in non-production environments where Supabase is unconfigured.
 * In production the module-level check above already throws, so this
 * always returns false there.
 */
export function isMockAuthAllowed(): boolean {
  return process.env.NODE_ENV !== 'production' && !isSupabaseConfigured();
}

export const SUPABASE_URL = RAW_URL ?? '';
export const SUPABASE_ANON_KEY = RAW_KEY ?? '';
