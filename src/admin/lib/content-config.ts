import type { CollectionKey } from "./types";

export type FieldType = "text" | "textarea" | "number" | "select" | "url" | "image" | "string-list" | "image-list";

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  hint?: string;
  options?: string[];
  required?: boolean;
}

export interface CollectionConfig {
  key: CollectionKey;
  label: string;
  description: string;
  icon: string;
  dataKey: string;
  filePath: string;
  itemLabel: string;
  summaryFields: string[];
  fields: FieldConfig[];
}

export const PROJECT_CATEGORIES = [
  "Web Development",
  "AI & Machine Learning",
  "Backend & IoT",
  "Mobile Development",
  "Systems Programming",
  "Cybersecurity",
];

export const JOURNEY_CATEGORIES = [
  "IEEE Events",
  "Hackathons",
  "Awards",
  "Workshops",
  "Competitions",
  "Industry",
  "Other",
];

export const COLLECTIONS: CollectionConfig[] = [
  {
    key: "projects",
    label: "Projects",
    description: "Portfolio projects with tech stack, highlights, and GitHub links.",
    icon: "FolderKanban",
    dataKey: "projects",
    filePath: "public/data/projects.json",
    itemLabel: "Project",
    summaryFields: ["title", "category", "date"],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea", required: true },
      { name: "date", label: "Date", type: "text", placeholder: "December 2025", required: true },
      { name: "category", label: "Category", type: "select", options: PROJECT_CATEGORIES, required: true },
      { name: "technologies", label: "Technologies", type: "string-list", placeholder: "Add technology" },
      { name: "highlights", label: "Highlights", type: "string-list", placeholder: "Add highlight" },
      { name: "github", label: "GitHub URL", type: "url", placeholder: "https://github.com/..." },
      { name: "image", label: "Cover Image", type: "image", hint: "Upload or paste an image path" },
    ],
  },
  {
    key: "experiences",
    label: "Experience",
    description: "Professional roles, internships, and work history.",
    icon: "Briefcase",
    dataKey: "experience",
    filePath: "public/data/experiences.json",
    itemLabel: "Experience",
    summaryFields: ["title", "company", "date"],
    fields: [
      { name: "title", label: "Job Title", type: "text", required: true },
      { name: "company", label: "Company", type: "text", required: true },
      { name: "location", label: "Location", type: "text", placeholder: "Tunis, Tunisia" },
      { name: "date", label: "Date", type: "text", placeholder: "July 2025 – August 2025", required: true },
      { name: "description", label: "Description", type: "textarea", required: true },
      { name: "highlights", label: "Highlights", type: "string-list", placeholder: "Add highlight" },
      { name: "technologies", label: "Technologies", type: "string-list", placeholder: "Add technology" },
      { name: "image", label: "Image", type: "image" },
    ],
  },
  {
    key: "certifications",
    label: "Certifications",
    description: "Credentials, badges, and professional certifications.",
    icon: "Award",
    dataKey: "certifications",
    filePath: "public/data/certifications.json",
    itemLabel: "Certification",
    summaryFields: ["title", "issuer", "date"],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "issuer", label: "Issuer", type: "text", required: true },
      { name: "date", label: "Date", type: "text", required: true },
      { name: "credentialId", label: "Credential ID", type: "text" },
      {
        name: "credentialUrl",
        label: "Credential URL",
        type: "url",
        hint: "Opens in a new tab when visitors click the credential button. Leave empty to fall back to email request.",
      },
      { name: "description", label: "Description", type: "textarea", required: true },
      { name: "skills", label: "Skills", type: "string-list", placeholder: "Add skill" },
      { name: "image", label: "Badge Image", type: "image" },
    ],
  },
  {
    key: "gallery",
    label: "Journey",
    description: "Event photos, hackathons, awards, and gallery posts.",
    icon: "Camera",
    dataKey: "posts",
    filePath: "public/data/gallery.json",
    itemLabel: "Post",
    summaryFields: ["title", "category", "year"],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "image", label: "Cover Image", type: "image", required: true },
      { name: "location", label: "Location", type: "text" },
      { name: "date", label: "Date", type: "text" },
      { name: "caption", label: "Caption", type: "textarea", required: true },
      { name: "hashtags", label: "Hashtags", type: "string-list", placeholder: "Add hashtag" },
      { name: "likes", label: "Likes", type: "number" },
      { name: "comments", label: "Comments", type: "number" },
      { name: "shares", label: "Shares", type: "number" },
      { name: "year", label: "Year", type: "number", required: true },
      { name: "category", label: "Category", type: "select", options: JOURNEY_CATEGORIES, required: true },
      { name: "album", label: "Album Name", type: "text" },
      { name: "albumImages", label: "Album Images", type: "image-list", hint: "Images shown in the modal carousel" },
    ],
  },
];

export function getCollection(key: CollectionKey): CollectionConfig {
  const config = COLLECTIONS.find((c) => c.key === key);
  if (!config) throw new Error(`Unknown collection: ${key}`);
  return config;
}
