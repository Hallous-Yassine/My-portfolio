import { getCmsApiBaseUrl, getStoredToken } from "./cms-auth";
import type { CollectionKey, GitHubUser } from "./types";

function apiUrl(path: string): string {
  const base = getCmsApiBaseUrl();
  return base ? `${base}/api${path}` : `/api${path}`;
}

function authHeaders(): HeadersInit {
  const token = getStoredToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const body = (await response.json()) as { error?: string };
      if (body.error) message = body.error;
    } catch {
      // ignore parse errors
    }
    throw new Error(message);
  }
  return response.json() as Promise<T>;
}

export async function fetchCurrentUser(): Promise<GitHubUser> {
  const response = await fetch(apiUrl("/user"), { headers: authHeaders() });
  return handleResponse<GitHubUser>(response);
}

export async function fetchCollection<T>(key: CollectionKey): Promise<T> {
  const response = await fetch(apiUrl(`/content/${key}`), { headers: authHeaders() });
  return handleResponse<T>(response);
}

export async function saveCollection<T>(key: CollectionKey, data: T): Promise<{ ok: boolean }> {
  const response = await fetch(apiUrl(`/content/${key}`), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(data),
  });
  return handleResponse<{ ok: boolean }>(response);
}

export async function uploadMedia(file: File): Promise<{ path: string }> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(apiUrl("/media"), {
    method: "POST",
    headers: authHeaders(),
    body: formData,
  });
  return handleResponse<{ path: string }>(response);
}

export async function uploadCv(file: File): Promise<{ path: string }> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(apiUrl("/cv"), {
    method: "POST",
    headers: authHeaders(),
    body: formData,
  });
  return handleResponse<{ path: string }>(response);
}
