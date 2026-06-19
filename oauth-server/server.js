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

app.get("/auth", (_req, res) => {
  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: OAUTH_CALLBACK_URL,
    scope: "repo,user",
  });
  res.redirect(`https://github.com/login/oauth/authorize?${params}`);
});

app.get("/callback", async (req, res) => {
  const { code } = req.query;
  if (!code || typeof code !== "string") {
    res.status(400).send("Missing authorization code.");
    return;
  }

  try {
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
      }),
    });

    const tokenData = await tokenRes.json();
    if (tokenData.error || !tokenData.access_token) {
      res.status(401).send(tokenData.error_description || "OAuth failed.");
      return;
    }

    const msg = JSON.stringify({
      token: tokenData.access_token,
      provider: "github",
    });

    const adminUrl = `${ORIGIN}/My-portfolio/admin/`;
    const content = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>GitHub Login</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #0a0e14; color: #a8e6f0; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
    .card { text-align: center; padding: 2rem; border: 1px solid #1e293b; border-radius: 12px; background: #111827; max-width: 420px; }
    a { color: #22d3ee; }
    p { line-height: 1.6; }
  </style>
</head>
<body>
  <div class="card">
    <p id="status">Completing sign in…</p>
    <p id="fallback" style="display:none">You can close this tab and return to the admin.</p>
    <p id="manual" style="display:none"><a href="${adminUrl}">Return to Portfolio CMS</a></p>
  </div>
  <script>
(function() {
  var payload = 'authorization:github:success:' + ${JSON.stringify(msg)};
  var targetOrigin = ${JSON.stringify(ORIGIN)};

  function showManual() {
    document.getElementById('status').textContent = 'Sign in successful.';
    document.getElementById('fallback').style.display = 'block';
    document.getElementById('manual').style.display = 'block';
  }

  if (window.opener && !window.opener.closed) {
    try {
      window.opener.postMessage(payload, targetOrigin);
      document.getElementById('status').textContent = 'Success! Closing window…';
      window.setTimeout(function() { window.close(); }, 400);
    } catch (err) {
      showManual();
    }
  } else {
    showManual();
  }
})();
  </script>
</body>
</html>`;

    res.send(content);
  } catch (err) {
    console.error(err);
    res.status(500).send("OAuth token exchange failed.");
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

app.get("/api/content/:key", async (req, res) => {
  const token = getToken(req);
  if (!token) {
    res.status(401).json({ error: "Missing authorization token." });
    return;
  }

  const filePath = CONTENT_FILES[req.params.key];
  if (!filePath) {
    res.status(404).json({ error: "Unknown content collection." });
    return;
  }

  try {
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

  const filePath = CONTENT_FILES[req.params.key];
  if (!filePath) {
    res.status(404).json({ error: "Unknown content collection." });
    return;
  }

  try {
    const content = `${JSON.stringify(req.body, null, 2)}\n`;
    await upsertFile(token, filePath, content, `Update ${req.params.key} via Portfolio CMS`);
    res.json({ ok: true });
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
