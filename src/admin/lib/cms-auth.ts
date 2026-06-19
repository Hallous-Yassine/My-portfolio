const TOKEN_KEY = "portfolio_cms_token";

export function getStoredToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  sessionStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken(): void {
  sessionStorage.removeItem(TOKEN_KEY);
}

export function getCmsApiBaseUrl(): string {
  const configured = import.meta.env.VITE_CMS_API_URL?.replace(/\/$/, "");
  if (configured) return configured;
  return "";
}

export function getOAuthCallbackUrl(): string {
  const base = import.meta.env.BASE_URL || "/";
  const normalizedBase = base.endsWith("/") ? base : `${base}/`;
  return `${window.location.origin}${normalizedBase}admin/oauth-callback`;
}

/** Redirect the browser to GitHub OAuth (reliable on GitHub Pages; no popup needed). */
export function startGitHubLogin(): void {
  const baseUrl = getCmsApiBaseUrl();
  const returnUrl = encodeURIComponent(getOAuthCallbackUrl());
  const authUrl = baseUrl
    ? `${baseUrl}/auth?return_url=${returnUrl}`
    : `/api/auth?return_url=${returnUrl}`;

  window.location.assign(authUrl);
}

/** Read token from URL hash after OAuth redirect. Clears hash from address bar. */
export function consumeOAuthCallbackHash(): { token: string | null; error: string | null } {
  const hash = window.location.hash.startsWith("#") ? window.location.hash.slice(1) : window.location.hash;
  const params = new URLSearchParams(hash);

  const token = params.get("token");
  const error = params.get("error");

  if (token || error) {
    window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
  }

  return { token, error };
}

export function consumeOAuthCallbackQuery(): string | null {
  const params = new URLSearchParams(window.location.search);
  const error = params.get("error");
  return error;
}
