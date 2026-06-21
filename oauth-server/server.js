/**
 * OAuth bridge + CMS content API for portfolio admin on GitHub Pages.
 */
import express from "express";
import cors from "cors";

const {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  OAUTH_CALLBACK_URL,
  ORIGIN = "https://hallous-yassine.github.io",
  GITHUB_REPO = "Hallous-Yassine/My-portfolio",
  GITHUB_BRANCH = "main",
  PORT = 3000,
} = process.env;

if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET || !OAUTH_CALLBACK_URL) {
  console.error("Missing env: GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, OAUTH_CALLBACK_URL");
  process.exit(1);
}

const DEFAULT_RETURN_URL = `${ORIGIN}/My-portfolio/admin/oauth-callback`;

const SITE_FILE = "public/data/site.json";

const CONTENT_FILES = {
  projects: "public/data/projects.json",
  experiences: "public/data/experiences.json",
  certifications: "public/data/certifications.json",
  gallery: "public/data/gallery.json",
};

const app = express();
app.use(
  cors({
    origin: [ORIGIN, "http://localhost:8080"],
    credentials: true,
  }),
);

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function isAllowedReturnUrl(url) {
  if (!url || typeof url !== "string") return false;
  try {
    const parsed = new URL(url);
    const allowed = new URL(ORIGIN);
    return parsed.origin === allowed.origin && parsed.pathname.startsWith("/My-portfolio/admin");
  } catch {
    return false;
  }
}

function encodeState(returnUrl) {
  return Buffer.from(JSON.stringify({ returnUrl }), "utf8").toString("base64url");
}

function decodeState(state) {
  if (!state || typeof state !== "string") return DEFAULT_RETURN_URL;
  try {
    const parsed = JSON.parse(Buffer.from(state, "base64url").toString("utf8"));
    if (isAllowedReturnUrl(parsed.returnUrl)) return parsed.returnUrl;
  } catch {
    // fall through
  }
  return DEFAULT_RETURN_URL;
}

function renderPage(title, message, linkHref, linkLabel) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #0a0e14; color: #a8e6f0; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 1rem; }
    .card { text-align: center; padding: 2rem; border: 1px solid #1e293b; border-radius: 12px; background: #111827; max-width: 460px; width: 100%; }
    a { color: #22d3ee; text-decoration: none; }
    a:hover { text-decoration: underline; }
    p { line-height: 1.6; margin: 0.75rem 0; }
    h1 { font-size: 1.25rem; margin: 0 0 0.5rem; color: #ecfeff; }
  </style>
</head>
<body>
  <div class="card">
    <h1>${escapeHtml(title)}</h1>
    <p>${escapeHtml(message)}</p>
    ${linkHref ? `<p><a href="${escapeHtml(linkHref)}">${escapeHtml(linkLabel ?? "Continue")}</a></p>` : ""}
  </div>
</body>
</html>`;
}

function getToken(req) {
  const header = req.headers.authorization ?? "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match?.[1] ?? null;
}

async function githubRequest(path, token, options = {}) {
  const response = await fetch(`https://api.github.com${path}`, {
    ...options,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...(options.headers ?? {}),
    },
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message = data?.message ?? `GitHub API error (${response.status})`;
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return data;
}

async function getFileSha(token, path) {
  try {
    const data = await githubRequest(
      `/repos/${GITHUB_REPO}/contents/${encodeURIComponent(path).replace(/%2F/g, "/")}?ref=${GITHUB_BRANCH}`,
      token,
    );
    return data.sha;
  } catch (err) {
    if (err.status === 404) return null;
    throw err;
  }
}

async function upsertFile(token, path, content, message) {
  const sha = await getFileSha(token, path);
  const body = {
    message,
    content: Buffer.from(content).toString("base64"),
    branch: GITHUB_BRANCH,
  };
  if (sha) body.sha = sha;

  return githubRequest(`/repos/${GITHUB_REPO}/contents/${path}`, token, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

async function exchangeCodeForToken(code) {
  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: OAUTH_CALLBACK_URL,
    }),
  });

  const tokenData = await tokenRes.json();
  if (tokenData.error || !tokenData.access_token) {
    const message = tokenData.error_description || tokenData.error || "OAuth failed.";
    const error = new Error(message);
    error.status = 401;
    throw error;
  }

  return tokenData.access_token;
}

app.get("/auth", (req, res) => {
  const requestedReturn =
    typeof req.query.return_url === "string" ? req.query.return_url : DEFAULT_RETURN_URL;
  const returnUrl = isAllowedReturnUrl(requestedReturn) ? requestedReturn : DEFAULT_RETURN_URL;

  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: OAUTH_CALLBACK_URL,
    scope: "repo,user",
    state: encodeState(returnUrl),
  });

  res.redirect(`https://github.com/login/oauth/authorize?${params.toString()}`);
});

app.get("/callback", async (req, res) => {
  const { code, state, error, error_description: errorDescription } = req.query;
  const returnUrl = decodeState(typeof state === "string" ? state : undefined);
  const adminLoginUrl = `${ORIGIN}/My-portfolio/admin/login`;

  if (error) {
    const message = typeof errorDescription === "string" ? errorDescription : String(error);
    res
      .status(400)
      .send(
        renderPage(
          "GitHub sign-in cancelled",
          message,
          `${adminLoginUrl}?error=${encodeURIComponent(message)}`,
          "Back to Portfolio CMS",
        ),
      );
    return;
  }

  if (!code || typeof code !== "string") {
    res
      .status(400)
      .send(
        renderPage(
          "Sign-in failed",
          "Missing authorization code from GitHub.",
          adminLoginUrl,
          "Try again",
        ),
      );
    return;
  }

  try {
    const accessToken = await exchangeCodeForToken(code);
    const hash = new URLSearchParams({
      token: accessToken,
      provider: "github",
    }).toString();

    res.redirect(`${returnUrl}#${hash}`);
  } catch (err) {
    console.error("OAuth callback error:", err);
    const message = err instanceof Error ? err.message : "OAuth token exchange failed.";
    res
      .status(err.status ?? 500)
      .send(
        renderPage(
          "Sign-in failed",
          message,
          `${adminLoginUrl}?error=${encodeURIComponent(message)}`,
          "Try again",
        ),
      );
  }
});

app.get("/api/user", async (req, res) => {
  const token = getToken(req);
  if (!token) {
    res.status(401).json({ error: "Missing authorization token." });
    return;
  }

  try {
    const user = await githubRequest("/user", token);
    res.json({
      login: user.login,
      avatar_url: user.avatar_url,
      name: user.name,
    });
  } catch (err) {
    res.status(err.status ?? 500).json({ error: err.message });
  }
});

async function readSiteJson(token) {
  const data = await githubRequest(
    `/repos/${GITHUB_REPO}/contents/${SITE_FILE}?ref=${GITHUB_BRANCH}`,
    token,
  );
  return JSON.parse(Buffer.from(data.content, "base64").toString("utf8"));
}

async function writeSiteJson(token, siteData, message) {
  const content = `${JSON.stringify(siteData, null, 2)}\n`;
  await upsertFile(token, SITE_FILE, content, message);
}

app.get("/api/content/:key", async (req, res) => {
  const token = getToken(req);
  if (!token) {
    res.status(401).json({ error: "Missing authorization token." });
    return;
  }

  const { key } = req.params;

  try {
    if (key === "hero") {
      const site = await readSiteJson(token);
      res.json(site.sections?.hero ?? {});
      return;
    }

    if (key === "about") {
      const site = await readSiteJson(token);
      res.json({
        about: site.sections?.about ?? {},
        experience: site.sections?.experience ?? { subtitle: "" },
        projects: site.sections?.projects ?? { subtitle: "" },
        certifications: site.sections?.certifications ?? { subtitle: "" },
      });
      return;
    }

    const filePath = CONTENT_FILES[key];
    if (!filePath) {
      res.status(404).json({ error: "Unknown content collection." });
      return;
    }

    const data = await githubRequest(
      `/repos/${GITHUB_REPO}/contents/${filePath}?ref=${GITHUB_BRANCH}`,
      token,
    );
    const content = Buffer.from(data.content, "base64").toString("utf8");
    res.type("json").send(content);
  } catch (err) {
    res.status(err.status ?? 500).json({ error: err.message });
  }
});

app.put("/api/content/:key", express.json({ limit: "2mb" }), async (req, res) => {
  const token = getToken(req);
  if (!token) {
    res.status(401).json({ error: "Missing authorization token." });
    return;
  }

  const { key } = req.params;

  try {
    if (key === "hero") {
      const site = await readSiteJson(token);
      site.sections = site.sections ?? {};
      site.sections.hero = req.body;
      await writeSiteJson(token, site, "Update hero section via Portfolio CMS");
      res.json({ ok: true });
      return;
    }

    if (key === "about") {
      const site = await readSiteJson(token);
      site.sections = site.sections ?? {};
      if (req.body.about) site.sections.about = req.body.about;
      if (req.body.experience) site.sections.experience = req.body.experience;
      if (req.body.projects) site.sections.projects = req.body.projects;
      if (req.body.certifications) site.sections.certifications = req.body.certifications;
      await writeSiteJson(token, site, "Update about section via Portfolio CMS");
      res.json({ ok: true });
      return;
    }

    const filePath = CONTENT_FILES[key];
    if (!filePath) {
      res.status(404).json({ error: "Unknown content collection." });
      return;
    }

    const content = `${JSON.stringify(req.body, null, 2)}\n`;
    await upsertFile(token, filePath, content, `Update ${key} via Portfolio CMS`);
    res.json({ ok: true });
  } catch (err) {
    res.status(err.status ?? 500).json({ error: err.message });
  }
});

app.post("/api/cv", express.raw({ type: "*/*", limit: "12mb" }), async (req, res) => {
  const token = getToken(req);
  if (!token) {
    res.status(401).json({ error: "Missing authorization token." });
    return;
  }

  try {
    const contentType = req.headers["content-type"] ?? "";
    const boundaryMatch = contentType.match(/boundary=(.+)$/);
    if (!boundaryMatch) {
      res.status(400).json({ error: "Expected multipart upload." });
      return;
    }

    const buffer = req.body;
    const parts = buffer.toString("binary").split(`--${boundaryMatch[1]}`);
    let filename = `CV-${Date.now()}.pdf`;
    let fileBuffer = null;

    for (const part of parts) {
      if (!part.includes('name="file"')) continue;
      const headerEnd = part.indexOf("\r\n\r\n");
      if (headerEnd === -1) continue;
      const headers = part.slice(0, headerEnd);
      const filenameMatch = headers.match(/filename="([^"]+)"/);
      if (filenameMatch) filename = filenameMatch[1].replace(/[^a-zA-Z0-9._-]/g, "-");
      const data = part.slice(headerEnd + 4).replace(/\r\n$/, "").replace(/\r\n--$/, "");
      fileBuffer = Buffer.from(data, "binary");
      break;
    }

    if (!fileBuffer) {
      res.status(400).json({ error: "No file uploaded." });
      return;
    }

    if (!filename.toLowerCase().endsWith(".pdf")) {
      res.status(400).json({ error: "Only PDF files are allowed for CV upload." });
      return;
    }

    const assetPath = `public/assets/cv/${Date.now()}-${filename}`;
    await upsertFile(token, assetPath, fileBuffer, "Upload CV via Portfolio CMS");
    res.json({ path: `/assets/cv/${assetPath.split("/").pop()}` });
  } catch (err) {
    res.status(err.status ?? 500).json({ error: err.message });
  }
});

app.post("/api/media", express.raw({ type: "*/*", limit: "8mb" }), async (req, res) => {
  const token = getToken(req);
  if (!token) {
    res.status(401).json({ error: "Missing authorization token." });
    return;
  }

  try {
    const contentType = req.headers["content-type"] ?? "";
    const boundaryMatch = contentType.match(/boundary=(.+)$/);
    if (!boundaryMatch) {
      res.status(400).json({ error: "Expected multipart upload." });
      return;
    }

    const buffer = req.body;
    const parts = buffer.toString("binary").split(`--${boundaryMatch[1]}`);
    let filename = `upload-${Date.now()}.png`;
    let fileBuffer = null;

    for (const part of parts) {
      if (!part.includes('name="file"')) continue;
      const headerEnd = part.indexOf("\r\n\r\n");
      if (headerEnd === -1) continue;
      const headers = part.slice(0, headerEnd);
      const filenameMatch = headers.match(/filename="([^"]+)"/);
      if (filenameMatch) filename = filenameMatch[1].replace(/[^a-zA-Z0-9._-]/g, "-");
      const data = part.slice(headerEnd + 4).replace(/\r\n$/, "").replace(/\r\n--$/, "");
      fileBuffer = Buffer.from(data, "binary");
      break;
    }

    if (!fileBuffer) {
      res.status(400).json({ error: "No file uploaded." });
      return;
    }

    const assetPath = `public/assets/uploads/${Date.now()}-${filename}`;
    await upsertFile(token, assetPath, fileBuffer, `Upload media via Portfolio CMS`);
    res.json({ path: `/assets/uploads/${assetPath.split("/").pop()}` });
  } catch (err) {
    res.status(err.status ?? 500).json({ error: err.message });
  }
});

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Portfolio CMS API listening on port ${PORT}`);
});
