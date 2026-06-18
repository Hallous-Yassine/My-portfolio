/**
 * Normalizes portfolio JSON after Decap CMS edits:
 * - Sequential IDs starting at 1
 * - Image paths as /assets/... (no duplicate base path)
 * - Empty credentialUrl → null
 */
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function normalizeImagePath(value) {
  if (!value || typeof value !== "string") return value;
  let path = value.trim();
  path = path.replace(/^https?:\/\/[^/]+\/My-portfolio\//, "/");
  path = path.replace(/^\/My-portfolio\//, "/");
  if (!path.startsWith("/")) path = `/${path}`;
  return path;
}

function normalizeListIds(items, transformItem) {
  if (!Array.isArray(items)) return items;
  return items.map((item, index) => {
    const next = transformItem ? transformItem({ ...item }) : { ...item };
    next.id = index + 1;
    return next;
  });
}

function normalizeProjects(data) {
  data.projects = normalizeListIds(data.projects, (p) => ({
    ...p,
    image: normalizeImagePath(p.image),
    technologies: Array.isArray(p.technologies)
      ? p.technologies.map((t) => (typeof t === "string" ? t : t.technology ?? t))
      : [],
    highlights: Array.isArray(p.highlights)
      ? p.highlights.map((h) => (typeof h === "string" ? h : h.highlight ?? h))
      : [],
  }));
  return data;
}

function normalizeExperiences(data) {
  data.experience = normalizeListIds(data.experience, (e) => ({
    ...e,
    image: normalizeImagePath(e.image),
    technologies: Array.isArray(e.technologies)
      ? e.technologies.map((t) => (typeof t === "string" ? t : t.technology ?? t))
      : [],
    highlights: Array.isArray(e.highlights)
      ? e.highlights.map((h) => (typeof h === "string" ? h : h.highlight ?? h))
      : [],
  }));
  return data;
}

function normalizeCertifications(data) {
  data.certifications = normalizeListIds(data.certifications, (c) => ({
    ...c,
    image: normalizeImagePath(c.image),
    credentialUrl: c.credentialUrl?.trim() ? c.credentialUrl.trim() : null,
    skills: Array.isArray(c.skills)
      ? c.skills.map((s) => (typeof s === "string" ? s : s.skill ?? s))
      : [],
  }));
  return data;
}

function normalizeGallery(data) {
  data.posts = normalizeListIds(data.posts, (p) => ({
    ...p,
    image: normalizeImagePath(p.image),
    albumImages: Array.isArray(p.albumImages)
      ? p.albumImages.map((img) =>
          normalizeImagePath(typeof img === "string" ? img : img.image ?? img)
        )
      : [],
    hashtags: Array.isArray(p.hashtags)
      ? p.hashtags.map((t) => (typeof t === "string" ? t : t.tag ?? t))
      : [],
    likes: Number(p.likes) || 0,
    comments: Number(p.comments) || 0,
    shares: Number(p.shares) || 0,
    year: Number(p.year) || new Date().getFullYear(),
  }));
  return data;
}

const files = [
  { path: "public/data/projects.json", normalize: normalizeProjects },
  { path: "public/data/experiences.json", normalize: normalizeExperiences },
  { path: "public/data/certifications.json", normalize: normalizeCertifications },
  { path: "public/data/gallery.json", normalize: normalizeGallery },
];

let changed = false;

for (const { path: relPath, normalize } of files) {
  const absPath = join(root, relPath);
  const raw = readFileSync(absPath, "utf8");
  const data = JSON.parse(raw);
  const normalized = normalize(data);
  const output = `${JSON.stringify(normalized, null, 2)}\n`;
  if (output !== raw) {
    writeFileSync(absPath, output);
    changed = true;
    console.log(`Normalized ${relPath}`);
  }
}

if (!changed) {
  console.log("Portfolio data already normalized.");
}
