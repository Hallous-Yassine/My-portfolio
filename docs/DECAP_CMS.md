# Decap CMS — Content Management Guide

Edit portfolio content (projects, experience, certifications, journey photos) from a web UI. Changes are saved as Git commits — no manual JSON editing.

**Admin URL:** [https://hallous-yassine.github.io/My-portfolio/admin/](https://hallous-yassine.github.io/My-portfolio/admin/)  
**Live site:** [https://hallous-yassine.github.io/My-portfolio](https://hallous-yassine.github.io/My-portfolio)

---

## What you manage in the CMS

| Section | File | Actions |
|---------|------|---------|
| Projects | `public/data/projects.json` | Add, edit, delete, reorder |
| Experience | `public/data/experiences.json` | Add, edit, delete, reorder |
| Certifications | `public/data/certifications.json` | Add, edit, delete, reorder |
| Journey / Gallery | `public/data/gallery.json` | Add, edit, delete, reorder |

Images upload to `public/assets/`. After **Publish**, GitHub Actions rebuilds the site (~2 minutes).

---

## Secrets & config — what goes where

| Credential | Where it lives | Never put it in |
|------------|----------------|-----------------|
| GitHub OAuth Client ID | Render env + optional local notes | Public repo, `.env` committed |
| GitHub OAuth Client Secret | **Render only** | Git repo, client-side code |
| OAuth callback URL | Render env `OAUTH_CALLBACK_URL` | — |
| OAuth `base_url` | `public/admin/config.yml` (public URL only) | — |
| EmailJS keys | GitHub repo **Secrets** (Actions) + local `.env` | Committed `.env` |
| GitHub personal token | Not needed (OAuth handles CMS login) | — |

---

## One-time setup (production CMS login)

GitHub Pages cannot run OAuth itself. You need a tiny free **OAuth bridge** on Render (included in `oauth-server/`).

### Step 1 — Deploy OAuth server on Render

1. Push this repo to GitHub.
2. Go to [render.com](https://render.com) → **New → Web Service**.
3. Connect **Hallous-Yassine/My-portfolio**.
4. Settings:
   - **Root Directory:** `oauth-server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Add **Environment Variables** (Render dashboard → Environment):

   | Key | Value | Example |
   |-----|--------|---------|
   | `GITHUB_CLIENT_ID` | From Step 2 below | `Ov23li...` |
   | `GITHUB_CLIENT_SECRET` | From Step 2 below | `abc123...` (keep secret) |
   | `OAUTH_CALLBACK_URL` | Your Render URL + `/callback` | `https://my-portfolio-uv04.onrender.com/callback` |
   | `ORIGIN` | GitHub Pages origin (no path) | `https://hallous-yassine.github.io` |

6. Deploy. Your service URL: `https://my-portfolio-uv04.onrender.com` (no trailing slash).

7. Test: open [https://my-portfolio-uv04.onrender.com/health](https://my-portfolio-uv04.onrender.com/health) → should show `{"ok":true}` after env vars are set.

### Step 2 — Create GitHub OAuth App

1. Open [GitHub → Settings → Developer settings → OAuth Apps → New OAuth App](https://github.com/settings/applications/new).
2. Fill in:

   | Field | Value |
   |-------|--------|
   | Application name | `Portfolio Decap CMS` |
   | Homepage URL | `https://hallous-yassine.github.io/My-portfolio/admin/` |
   | Authorization callback URL | `https://my-portfolio-uv04.onrender.com/callback` *(exact match with Render)* |

3. Click **Register application**.
4. Copy **Client ID**.
5. Click **Generate a new client secret** → copy **Client Secret** once (you won't see it again).
6. Paste both into Render env vars from Step 1 (`GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`).
7. Redeploy Render service if it was deployed before secrets were set.

### Step 3 — Update Decap CMS config (in your repo)

Edit `public/admin/config.yml`:

```yaml
backend:
  name: github
  repo: Hallous-Yassine/My-portfolio
  branch: main
  base_url: https://my-portfolio-uv04.onrender.com    # Render URL, NO trailing slash
  auth_endpoint: auth

site_url: https://hallous-yassine.github.io/My-portfolio
display_url: https://hallous-yassine.github.io/My-portfolio
```

- Replace `https://YOUR-APP.onrender.com` with your real Render URL.
- **Do not** put Client Secret in this file — only the public `base_url`.

Commit and push to `main` → wait for deploy.

### Step 4 — EmailJS secrets (contact form on live site)

These are **not** for the CMS. They power the contact form at build time.

1. Get keys from [EmailJS Dashboard](https://dashboard.emailjs.com/).
2. In your repo: **Settings → Secrets and variables → Actions → New repository secret**:

   | Secret name | Value |
   |-------------|--------|
   | `VITE_EMAILJS_SERVICE_ID` | e.g. `service_4nphbyk` |
   | `VITE_EMAILJS_TEMPLATE_ID` | e.g. `template_822ombj` |
   | `VITE_EMAILJS_PUBLIC_KEY` | your public key |

3. Local dev: copy `.env.example` → `.env` and fill the same three values (`.env` is gitignored).

4. In EmailJS dashboard → **Account → Security** → restrict **Allowed origins** to:
   - `https://hallous-yassine.github.io`
   - `http://localhost:8080` (for local dev — origin is the host, not the `/My-portfolio/` path)

5. Re-run **Deploy to GitHub Pages** workflow (or push any commit) so the build picks up secrets.

### Step 5 — GitHub Pages source

Repo **Settings → Pages**:

- **Source:** Deploy from a branch
- **Branch:** `gh-pages` / **`/ (root)`**

The `Deploy to GitHub Pages` workflow on `main` updates `gh-pages` automatically.

---

## Verify everything works

1. **CMS config loads:** [admin](https://hallous-yassine.github.io/My-portfolio/admin/#/) — no red config errors.
2. **Go back to site** → opens [https://hallous-yassine.github.io/My-portfolio](https://hallous-yassine.github.io/My-portfolio).
3. **Login with GitHub** → popup → authorize → you see collections.
4. **Publish a small edit** → Actions green → live site updates.
5. **Contact form** → send test message (needs EmailJS secrets).

---

## Local editing (no Render OAuth needed)

**Terminal 1:**
```bash
npm run dev
```

**Terminal 2:**
```bash
npm run cms
```

Open: [http://localhost:8080/My-portfolio/admin/](http://localhost:8080/My-portfolio/admin/)

`local_backend: true` in config uses the local proxy — no Render required for local edits.

---

## Daily workflow

1. Open [https://hallous-yassine.github.io/My-portfolio/admin/](https://hallous-yassine.github.io/My-portfolio/admin/)
2. **Login with GitHub**
3. Edit Projects / Experience / Certifications / Journey
4. **Publish**
5. Wait ~2 min → refresh live site

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Config errors on admin load | Fix `config.yml` YAML; push and redeploy |
| "Go back to site" wrong URL | `display_url` must be `https://hallous-yassine.github.io/My-portfolio` |
| Login popup blank / fails | Callback URL in GitHub OAuth App must exactly match `OAUTH_CALLBACK_URL` on Render |
| `Invalid origin` on login | `ORIGIN` on Render must be `https://hallous-yassine.github.io` (no `/My-portfolio`) |
| CMS login works but publish fails | Ensure OAuth app has `repo` scope (default with our server) and you have write access to the repo |
| Contact form fails on live site | Add all three `VITE_EMAILJS_*` secrets in GitHub Actions; redeploy. Deploy workflow now **fails** if secrets are missing. |
| Contact form works locally but not on live site | Secrets exist in `.env` only — they are not used by CI until added as GitHub Actions secrets |
| Contact form fails locally after editing `.env` | Restart `npm run dev` (Vite reads env only at startup) |
| EmailJS 403 / origin error | Add `https://hallous-yassine.github.io` and `http://localhost:8080` under EmailJS → Account → Security → Allowed origins |
| Render sleeps (free tier) | First login after idle may take ~30s — retry |

---

## Architecture

```
Browser (admin UI)
    → OAuth (Render) → GitHub token
    → Decap CMS → GitHub API → commit to main (JSON + images)
    → GitHub Actions → build → gh-pages
    → GitHub Pages → live portfolio
```

Content stays in **your repo** — versioned, free, no external database.
