# Yassine Hallous – Personal Portfolio

## 1. Description

**My Portfolio** is a professional, interactive website showcasing my journey, projects, skills, and certifications in **software development**.
It serves as a hub to explore my work, experience, and technical expertise, designed with modern web technologies and a clean, responsive interface.

---

## 2. Demo

### 🌐 Live Portfolio

Check it out here: [https://hallous-yassine.github.io/My-portfolio/](https://hallous-yassine.github.io/My-portfolio/)

### 🔹 Key Sections

* **About Me** → Overview of my professional journey and skills.
* **Experience Timeline** → Detailed work experience and internships.
* **Project Showcase** → Highlight of completed projects with descriptions.
* **Certifications** → Display of professional certifications.
* **Contact Form** → Direct email integration for inquiries.

---

## 3. Installation

Clone the repository:

```bash
git clone https://github.com/Hallous-Yassine/My-portfolio.git
cd My-portfolio
```

Install dependencies:

```bash
npm install
```

Copy environment variables for the contact form:

```bash
cp .env.example .env
```

For GitHub Pages deployment, set `VITE_EMAILJS_*` secrets in your repository or CI before running `npm run build`.

Run the development server:

```bash
npm run dev
```

Access locally at: `http://localhost:8080/My-portfolio/`

> Restart `npm run dev` after editing `.env`. EmailJS keys are baked in at **build time** — the live site needs the same three values as **GitHub Actions secrets**, then a redeploy.

Build for production:

```bash
npm run build
```

The optimized build will be in the `dist` directory.

---

## 4. Features

* **Professional Design** → Clean, modern dark-themed cyber UI.
* **Responsive Layout** → Works on any device or screen size.
* **Interactive Components** → Smooth animations and transitions.
* **Contact Form** → EmailJS integration for direct messages.
* **Experience Timeline** → Chronological display of internships and jobs.
* **Project Showcase** → Portfolio of completed work with links.
* **Certifications** → Displayed in a structured and visually appealing way.

---

## 5. Architecture

```bash
My-portfolio/
│── public/
│    ├── assets/         # Images uploaded via CMS
│    └── data/           # Portfolio JSON (edited via CMS)
│── src/admin/           # Modern React CMS admin UI
│── docs/                # Setup guides (CMS, etc.)
│── oauth-server/        # OAuth bridge for CMS login (deploy to Render)
│── scripts/             # Data normalization for CMS
│── .github/workflows/   # Auto-deploy on content changes
│── src/                 # Source code
│    ├── components/     # React components
│    ├── pages/          # Page components
│    ├── hooks/          # Custom React hooks
│    ├── lib/            # Utility functions
│    ├── App.tsx         # Main app component
│    └── main.tsx        # Entry point
```

---

## 6. Tech Stack / Built With

* **Frontend** → React + TypeScript
* **Styling** → Tailwind CSS + shadcn-ui components
* **Validation** → Zod
* **Icons** → Lucide React
* **Email** → EmailJS
* **Content CMS** → Custom React admin (Git-based publishing)
* **CI/CD** → GitHub Actions → GitHub Pages

---

## 7. Content management (Portfolio CMS)

**Admin panel:** [https://hallous-yassine.github.io/My-portfolio/admin/](https://hallous-yassine.github.io/My-portfolio/admin/)

**Full setup (OAuth + API):** [docs/DECAP_CMS.md](docs/DECAP_CMS.md)

Quick checklist:

1. **Render** — redeploy `oauth-server/` (adds CMS API + `cors`) with `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `OAUTH_CALLBACK_URL`, `ORIGIN`
2. **GitHub OAuth App** — callback URL = `https://YOUR-APP.onrender.com/callback`
3. **Deploy workflow** — sets `VITE_CMS_API_URL` to your Render URL at build time
4. **GitHub Actions secrets** — `VITE_EMAILJS_*` for the contact form

**Local CMS:**
```bash
npm run dev
# open http://localhost:8080/My-portfolio/admin/
```

---

## 8. Customization

* **Content** → Portfolio CMS admin at `/admin` or `public/data/` JSON files
* **Styles** → `src/index.css`
* **Components** → `src/components/`

---

## 9. Contact

* **Email** → [yassine_hallous@ieee.org](mailto:yassine_hallous@ieee.org)
* **GitHub** → [Hallous-Yassine](https://github.com/Hallous-Yassine)
* **LinkedIn** → [yassine-hallous](https://www.linkedin.com/in/yassine-hallous/)

---

## 10. License

**Private License – Personal Portfolio**

---

## 11. Author

**Yassine Hallous** – Built with passion, creativity, and modern web technologies.
