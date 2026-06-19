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

function getAllowedMessageOrigins(): string[] {
  const origins = new Set<string>([window.location.origin]);

  const apiBase = getCmsApiBaseUrl();
  if (apiBase) {
    try {
      origins.add(new URL(apiBase).origin);
    } catch {
      // ignore invalid URL
    }
  }

  return [...origins];
}

function isAllowedOrigin(origin: string): boolean {
  return getAllowedMessageOrigins().includes(origin);
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

    let settled = false;

    const timeout = window.setTimeout(() => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(new Error("Login timed out. Please try again."));
    }, 120_000);

    const finishSuccess = (token: string) => {
      if (settled) return;
      settled = true;
      setStoredToken(token);
      cleanup();
      resolve(token);
    };

    const finishError = (message: string) => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(new Error(message));
    };

    const onMessage = (event: MessageEvent) => {
      if (!isAllowedOrigin(event.origin)) return;
      if (typeof event.data !== "string") return;

      if (event.data === "authorizing:github") {
        // Legacy Decap handshake — acknowledge so older deployed callbacks still work.
        if (popup && !popup.closed) {
          popup.postMessage("authorizing:github", event.origin);
        }
        return;
      }

      const prefix = "authorization:github:success:";
      if (!event.data.startsWith(prefix)) return;

      try {
        const payload = JSON.parse(event.data.slice(prefix.length)) as { token?: string };
        if (!payload.token) {
          finishError("OAuth succeeded but no token was returned.");
          return;
        }
        finishSuccess(payload.token);
      } catch {
        finishError("Failed to parse OAuth response.");
      }
    };

    const poll = window.setInterval(() => {
      if (popup.closed && !settled) {
        if (getStoredToken()) {
          finishSuccess(getStoredToken()!);
        } else {
          finishError("Login window closed before completing authorization.");
        }
      }
    }, 500);

    const cleanup = () => {
      window.removeEventListener("message", onMessage);
      window.clearTimeout(timeout);
      window.clearInterval(poll);
      if (popup && !popup.closed) popup.close();
    };

    window.addEventListener("message", onMessage);
  });
}
