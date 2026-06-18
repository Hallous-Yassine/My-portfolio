# Decap CMS — Content Management Guide

Edit portfolio content (projects, experience, certifications, journey photos) from a web UI. Changes are saved as Git commits — no manual JSON editing.

**Admin URL (production):** [https://hallous-yassine.github.io/My-portfolio/admin/](https://hallous-yassine.github.io/My-portfolio/admin/)

---

## What you can manage

| Section | File | Actions |
|---------|------|---------|
| Projects | `public/data/projects.json` | Add, edit, delete, reorder |
| Experience | `public/data/experiences.json` | Add, edit, delete, reorder |
| Certifications | `public/data/certifications.json` | Add, edit, delete, reorder |
| Journey / Gallery | `public/data/gallery.json` | Add, edit, delete, reorder |

Images upload to `public/assets/` via the media library.

After you **Publish** in the CMS, GitHub Actions rebuilds and deploys the site automatically (~2 minutes).

---

## One-time setup (required for production login)

Decap CMS on GitHub Pages needs a small **OAuth bridge** (GitHub does not allow browser login directly). This is a one-time ~10 minute setup.

### Step 1 — Create a GitHub OAuth App

1. Go to [GitHub → Settings → Developer settings → OAuth Apps → New](https://github.com/settings/applications/new)
2. Fill in:
   - **Application name:** `Portfolio Decap CMS`
   - **Homepage URL:** `https://hallous-yassine.github.io/My-portfolio/admin/`
   - **Authorization callback URL:** `https://YOUR_OAUTH_SERVER.onrender.com/callback` *(update after Step 2)*
3. Create the app and copy **Client ID** and generate a **Client Secret**

### Step 2 — Deploy the OAuth server (free on Render)

1. Push this repo to GitHub (includes `oauth-server/`)
2. Go to [render.com](https://render.com) → **New → Blueprint** or **New Web Service**
3. Connect repo, set **Root Directory** to `oauth-server`
4. Add environment variables:

   | Variable | Value |
   |----------|--------|
   | `GITHUB_CLIENT_ID` | From Step 1 |
   | `GITHUB_CLIENT_SECRET` | From Step 1 |
   | `OAUTH_CALLBACK_URL` | `https://YOUR-APP.onrender.com/callback` |
   | `ORIGIN` | `https://hallous-yassine.github.io` |

5. Deploy and note your URL, e.g. `https://portfolio-decap-oauth.onrender.com`

6. Update the OAuth App **callback URL** in GitHub to match

### Step 3 — Update Decap config

Edit `public/admin/config.yml` and replace the placeholder:

```yaml
backend:
  base_url: https://YOUR-APP.onrender.com   # your Render URL, no trailing slash
```

Commit and push to the `admin` branch.

### Step 4 — GitHub Actions secrets (contact form)

In repo **Settings → Secrets and variables → Actions**, add:

- `VITE_EMAILJS_SERVICE_ID`
- `VITE_EMAILJS_TEMPLATE_ID`
- `VITE_EMAILJS_PUBLIC_KEY`

### Step 5 — Enable GitHub Pages from Actions

1. Repo **Settings → Pages**
2. **Source:** Deploy from a branch → select **`gh-pages`** / **`/ (root)`**
   - Or use **GitHub Actions** as source if available
3. Ensure the `Deploy to GitHub Pages` workflow has run successfully

---

## Local editing (no OAuth needed)

Use the local backend while developing:

**Terminal 1 — site:**
```bash
npm run dev
```

**Terminal 2 — CMS proxy:**
```bash
npm run cms
```

Open: [http://localhost:8080/My-portfolio/admin/](http://localhost:8080/My-portfolio/admin/)

Click **Login with GitHub** — the local proxy handles auth. Edits commit to your local repo when you publish (requires git credentials).

---

## Daily workflow

1. Open **[/My-portfolio/admin/](https://hallous-yassine.github.io/My-portfolio/admin/)**
2. Log in with GitHub
3. Pick a collection (Projects, Experience, etc.)
4. Add / edit / delete entries
5. Click **Publish**
6. Wait ~2 min for GitHub Actions to deploy
7. Hard-refresh the live site

---

## Tips

- **IDs:** You can use any number in the CMS; CI runs `normalize-portfolio-data.mjs` to re-order IDs sequentially on deploy.
- **Images:** Use the image widget — paths are stored as `/assets/...` automatically.
- **Credential URL:** Leave empty on certifications to show the “Request Credential” email button.
- **Delete an item:** Open the list entry → scroll down → **Remove**
- **Reorder:** Drag items in the list widget.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Login popup fails | Check OAuth callback URL matches Render URL exactly |
| 404 on `/admin` | Redeploy site; ensure `public/admin/` exists in `dist/` |
| Changes not on site | Check Actions tab; ensure workflow succeeded |
| Images broken | Run `npm run normalize-data` locally; paths should start with `/assets/` |
| CMS config error | Validate YAML at [decapcms.org](https://decapcms.org/docs/configuration-options/) |

---

## Architecture

```
You → Decap Admin UI → GitHub API (commit JSON + images)
                              ↓
                    GitHub Actions (normalize + build + deploy)
                              ↓
                    GitHub Pages (live portfolio)
```

Content stays in **your repo** — versioned, free, no external database.
