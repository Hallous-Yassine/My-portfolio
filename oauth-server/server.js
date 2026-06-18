/**
 * Minimal OAuth proxy for Decap CMS + GitHub backend on GitHub Pages.
 * Deploy to Render, Railway, or Fly.io (free tier).
 */
import express from "express";

const {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  OAUTH_CALLBACK_URL,
  ORIGIN = "https://hallous-yassine.github.io",
  PORT = 3000,
} = process.env;

if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET || !OAUTH_CALLBACK_URL) {
  console.error(
    "Missing env: GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, OAUTH_CALLBACK_URL"
  );
  process.exit(1);
}

const app = express();

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

    const content = `<!DOCTYPE html>
<html><body><script>
(function() {
  function receiveMessage(e) {
    window.opener.postMessage(
      'authorization:github:success:' + ${JSON.stringify(msg)},
      ${JSON.stringify(ORIGIN)}
    );
    window.removeEventListener("message", receiveMessage, false);
  }
  window.addEventListener("message", receiveMessage, false);
  window.opener.postMessage("authorizing:github", ${JSON.stringify(ORIGIN)});
})();
</script></body></html>`;

    res.send(content);
  } catch (err) {
    console.error(err);
    res.status(500).send("OAuth token exchange failed.");
  }
});

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Decap OAuth server listening on port ${PORT}`);
});
