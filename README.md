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

Access locally at: `http://localhost:8080`

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
│── public/              # Static assets (images, JSON data)
│    └── data/           # Portfolio data files
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
* **Build Tool** → Vite

---

## 7. Customization

* Update portfolio data in `public/data/` JSON files.
* Modify styles in `src/index.css`.
* Customize components in `src/components/`.

---

## 8. Contact

* **Email** → [yassine_hallous@ieee.org](mailto:yassine_hallous@ieee.org)
* **GitHub** → [Hallous-Yassine](https://github.com/Hallous-Yassine)
* **LinkedIn** → [yassine-hallous](https://www.linkedin.com/in/yassine-hallous/)

---

## 9. License

**Private License – Personal Portfolio**

---

## 10. Author

**Yassine Hallous** – Built with passion, creativity, and modern web technologies.
