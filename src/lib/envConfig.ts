/**
 * Environment configuration helper for feature flags.
 * Allows toggling survey behavior via environment variables in .env / .env.local or Vercel:
 * - SKIP_TIMER / NEXT_PUBLIC_SKIP_TIMER: Skips the 21s / 30s focus timers.
 * - SKIP_REQUIRED / NEXT_PUBLIC_SKIP_REQUIRED: Skips mandatory field validation.
 */

export interface AppFeatures {
  skipTimer: boolean;
  skipRequired: boolean;
}

/**
 * Parses truthy environment variable values ('true', '1', 'yes', 'on', true, 1).
 */
export function parseBooleanFlag(val: unknown): boolean {
  if (typeof val === 'boolean') return val;
  if (typeof val === 'number') return val === 1;
  if (typeof val === 'string') {
    const clean = val.trim().toLowerCase();
    return clean === 'true' || clean === '1' || clean === 'yes' || clean === 'on';
  }
  return false;
}

/**
 * Checks feature flags from environment variables (works both in server and client).
 * Supports standard Vercel variable naming conventions:
 * - SKIP_TIMER or NEXT_PUBLIC_SKIP_TIMER (also aliases DISABLE_TIMER / NEXT_PUBLIC_DISABLE_TIMER)
 * - SKIP_REQUIRED or NEXT_PUBLIC_SKIP_REQUIRED (also aliases SKIP_REQUIRED_FIELDS / NEXT_PUBLIC_SKIP_REQUIRED_FIELDS)
 */
export function getEnvFeatures(): AppFeatures {
  const env: Record<string, string | undefined> =
    typeof process !== 'undefined' && process.env
      ? (process.env as Record<string, string | undefined>)
      : {};

  const skipTimer =
    parseBooleanFlag(env.NEXT_PUBLIC_SKIP_TIMER) ||
    parseBooleanFlag(env.SKIP_TIMER) ||
    parseBooleanFlag(env.NEXT_PUBLIC_DISABLE_TIMER) ||
    parseBooleanFlag(env.DISABLE_TIMER);

  const skipRequired =
    parseBooleanFlag(env.NEXT_PUBLIC_SKIP_REQUIRED) ||
    parseBooleanFlag(env.SKIP_REQUIRED) ||
    parseBooleanFlag(env.NEXT_PUBLIC_SKIP_REQUIRED_FIELDS) ||
    parseBooleanFlag(env.SKIP_REQUIRED_FIELDS) ||
    parseBooleanFlag(env.NEXT_PUBLIC_DISABLE_REQUIRED) ||
    parseBooleanFlag(env.DISABLE_REQUIRED);

  return {
    skipTimer,
    skipRequired,
  };
}

/**
 * Client-side feature resolver that merges initial SSR values,
 * environment variables, and optional URL query parameters (e.g. ?skipTimer=true&skipRequired=true)
 * for seamless live testing and preview deployments.
 */
export function getClientFeatures(initial?: Partial<AppFeatures>): AppFeatures {
  const env = getEnvFeatures();

  let skipTimer = initial?.skipTimer ?? env.skipTimer;
  let skipRequired = initial?.skipRequired ?? env.skipRequired;

  if (typeof window !== 'undefined') {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.has('skipTimer') || params.has('skip_timer')) {
        skipTimer = parseBooleanFlag(params.get('skipTimer') ?? params.get('skip_timer'));
      }
      if (params.has('skipRequired') || params.has('skip_required')) {
        skipRequired = parseBooleanFlag(params.get('skipRequired') ?? params.get('skip_required'));
      }
    } catch {
      // Ignore URL parsing errors
    }
  }

  return {
    skipTimer,
    skipRequired,
  };
}
