/** Mirrors ims-frontend localStorage keys for endpoint switching. */
export const LS_BASE_URLS = "baseUrls";
export const LS_CURRENT_URL = "currentUrl";
export const LS_SOCKET_URLS = "socketUrls";
export const LS_CURRENT_SOCKET_URL = "currentSocketUrl";

const ENDPOINT_KEYS = [
  LS_BASE_URLS,
  LS_CURRENT_URL,
  LS_SOCKET_URLS,
  LS_CURRENT_SOCKET_URL,
] as const;

function stripTrailingSlashes(s: string): string {
  return s.replace(/\/+$/, "");
}

export function getResolvedApiBaseUrl(): string {
  const fromStorage = localStorage.getItem(LS_CURRENT_URL)?.trim();
  const env = (import.meta.env.VITE_REACT_APP_API_BASE_URL as string) || "";
  return stripTrailingSlashes(fromStorage || env);
}

export function getSocketLink(): string {
  const fromStorage = localStorage.getItem(LS_CURRENT_SOCKET_URL)?.trim();
  const env =
    (import.meta.env.VITE_REACT_APP_SOCKET_BASE_URL as string) || "";
  return stripTrailingSlashes(fromStorage || env);
}

export function joinWithApiBaseUrl(relativePath: string): string {
  const base = getResolvedApiBaseUrl();
  const path = relativePath.replace(/^\//, "");
  return `${base}/${path}`;
}

/** Clear app storage but keep saved endpoint lists and current selections (ims-frontend behavior). */
export function clearLocalStorageExceptEndpointConfig(): void {
  const snapshot: Record<string, string | null> = {};
  for (const k of ENDPOINT_KEYS) {
    snapshot[k] = localStorage.getItem(k);
  }
  localStorage.clear();
  for (const k of ENDPOINT_KEYS) {
    const v = snapshot[k];
    if (v) localStorage.setItem(k, v);
  }
}
