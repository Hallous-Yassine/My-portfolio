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

export function loginWithGitHub(): Promise<string> {
  const baseUrl = getCmsApiBaseUrl();
  const authUrl = baseUrl ? `${baseUrl}/auth` : "/api/auth";

  return new Promise((resolve, reject) => {
    const popup = window.open(authUrl, "github-oauth", "width=600,height=700");

    if (!popup) {
      reject(new Error("Popup blocked. Allow popups for this site and try again."));
      return;
    }

    const timeout = window.setTimeout(() => {
      cleanup();
      reject(new Error("Login timed out. Please try again."));
    }, 120_000);

    const onMessage = (event: MessageEvent) => {
      if (typeof event.data !== "string") return;

      if (event.data === "authorizing:github") return;

      const prefix = "authorization:github:success:";
      if (!event.data.startsWith(prefix)) return;

      try {
        const payload = JSON.parse(event.data.slice(prefix.length)) as { token?: string };
        if (!payload.token) {
          cleanup();
          reject(new Error("OAuth succeeded but no token was returned."));
          return;
        }

        setStoredToken(payload.token);
        cleanup();
        resolve(payload.token);
      } catch {
        cleanup();
        reject(new Error("Failed to parse OAuth response."));
      }
    };

    const poll = window.setInterval(() => {
      if (popup.closed) {
        cleanup();
        if (!getStoredToken()) {
          reject(new Error("Login window closed before completing authorization."));
        }
      }
    }, 500);

    const cleanup = () => {
      window.removeEventListener("message", onMessage);
      window.clearTimeout(timeout);
      window.clearInterval(poll);
      if (!popup.closed) popup.close();
    };

    window.addEventListener("message", onMessage);
  });
}
