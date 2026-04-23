/** sessionStorage key for post-login redirect (SPA; not httpOnly — set via Set-Cookie on server if required). */
export const AUTH_RETURN_TO_KEY = "authReturnTo";

const DEFAULT_AFTER_LOGIN = "/";

/**
 * Same-origin path+query only: rejects protocol-relative and absolute URLs.
 */
export function isSafeReturnPath(path: string): boolean {
  const p = path.trim();
  if (!p) return false;
  if (p.includes("://")) return false;
  if (p.startsWith("//")) return false;
  if (!p.startsWith("/")) return false;
  return true;
}

export function saveReturnTo(pathnameAndSearch: string): void {
  if (!isSafeReturnPath(pathnameAndSearch)) return;
  try {
    sessionStorage.setItem(AUTH_RETURN_TO_KEY, pathnameAndSearch);
  } catch {
    /* private mode / quota */
  }
}

export function clearReturnTo(): void {
  try {
    sessionStorage.removeItem(AUTH_RETURN_TO_KEY);
  } catch {
    /* ignore */
  }
}

/** Path to navigate to after auth, or default. Does not consume. */
export function peekValidatedReturnTo(): string {
  try {
    const v = sessionStorage.getItem(AUTH_RETURN_TO_KEY);
    if (v && isSafeReturnPath(v)) return v;
  } catch {
    /* ignore */
  }
  return DEFAULT_AFTER_LOGIN;
}

/** Read, validate, remove. Use once after successful login / OTP. */
export function consumeValidatedReturnTo(): string {
  let raw: string | null = null;
  try {
    raw = sessionStorage.getItem(AUTH_RETURN_TO_KEY);
    sessionStorage.removeItem(AUTH_RETURN_TO_KEY);
  } catch {
    return DEFAULT_AFTER_LOGIN;
  }
  if (raw && isSafeReturnPath(raw)) return raw;
  return DEFAULT_AFTER_LOGIN;
}
