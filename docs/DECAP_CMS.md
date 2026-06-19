# Portfolio CMS — Content Management Guide

Edit portfolio content from a modern React admin UI. Changes publish directly to GitHub as commits — no manual JSON editing.

**Admin URL:** [https://hallous-yassine.github.io/My-portfolio/admin/](https://hallous-yassine.github.io/My-portfolio/admin/)  
**Live site:** [https://hallous-yassine.github.io/My-portfolio](https://hallous-yassine.github.io/My-portfolio)

---

## What you can edit

| Section | File | Fields |
|---------|------|--------|
| **Projects** | `public/data/projects.json` | Title, description, date, category, technologies, highlights, GitHub URL, cover image |
| **Experience** | `public/data/experiences.json` | Job title, company, location, date, description, highlights, technologies, image |
| **Certifications** | `public/data/certifications.json` | Title, issuer, date, credential ID/URL, description, skills, badge image |
| **Journey / Gallery** | `public/data/gallery.json` | Title, cover, location, date, caption, hashtags, social stats, year, category, album images |

Images upload to `public/assets/uploads/`. After **Publish**, GitHub Actions rebuilds the site (~2 minutes).

**Not in CMS (edit in source code):** Hero, About/Skills, Contact info, Navigation, Footer, SEO metadata.

---

## Daily workflow

1. Open [https://hallous-yassine.github.io/My-portfolio/admin/](https://hallous-yassine.github.io/My-portfolio/admin/)
2. **Continue with GitHub** (popup OAuth)
3. Pick a section from the sidebar
4. Edit items, upload images, reorder with Move up/down
5. Click **Publish** when ready
6. Wait ~2 min → refresh the live site

---

## Local development

```bash
npm run dev
```

Open [http://localhost:8080/My-portfolio/admin/](http://localhost:8080/My-portfolio/admin/)

Local mode uses a built-in API (no Render OAuth needed). Login auto-completes with a dev token and writes directly to `public/data/` and `public/assets/uploads/`.

---

## Production setup (OAuth + API)

GitHub Pages is static. The admin talks to a small **CMS API** on Render (`oauth-server/`) for GitHub OAuth and content commits.

### Render environment variables

| Key | Value |
|-----|--------|
| `GITHUB_CLIENT_ID` | From GitHub OAuth App |
| `GITHUB_CLIENT_SECRET` | From GitHub OAuth App |
| `OAUTH_CALLBACK_URL` | `https://my-portfolio-uv04.onrender.com/callback` |
| `ORIGIN` | `https://hallous-yassine.github.io` |

After deploying the updated `oauth-server` (includes `cors` dependency), redeploy Render.

### GitHub OAuth App

| Field | Value |
|-------|--------|
| Homepage URL | `https://hallous-yassine.github.io/My-portfolio/admin/` |
| Authorization callback URL | `https://my-portfolio-uv04.onrender.com/callback` |

### Build-time env

The deploy workflow sets:

```
VITE_CMS_API_URL=https://my-portfolio-uv04.onrender.com
```

---

## Architecture

```
Browser (React admin at /admin)
    → OAuth (Render /auth) → GitHub token
    → CMS API (Render /api/content, /api/media) → GitHub API → commit to main
    → GitHub Actions → build → gh-pages
    → GitHub Pages → live portfolio
```

Content stays in **your repo** — versioned, free, no external database.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Login popup blocked | Allow popups for your site |
| Login fails on production | Check Render env vars and OAuth callback URL |
| Publish fails | Ensure you have write access to the repo |
| Images not showing | Paths should be `/assets/...`; CI normalizes on deploy |
| `/admin` 404 on direct URL | SPA fallback (`404.html`) is generated at build time |
| Render sleeps (free tier) | First request after idle may take ~30s — retry |
