export interface Project {
  id: number;
  title: string;
  description: string;
  date: string;
  category: string;
  technologies: string[];
  highlights: string[];
  github: string;
  image: string;
}

export interface Experience {
  id: number;
  title: string;
  company: string;
  location: string;
  date: string;
  description: string;
  highlights: string[];
  technologies: string[];
  image: string;
}

export interface Certification {
  id: number;
  title: string;
  issuer: string;
  date: string;
  credentialId: string;
  credentialUrl: string | null;
  description: string;
  skills: string[];
  image: string;
}

export interface JourneyPost {
  id: number;
  title: string;
  image: string;
  location: string;
  date: string;
  caption: string;
  hashtags: string[];
  likes: number;
  comments: number;
  shares: number;
  year: number;
  category: string;
  album: string;
  albumImages: string[];
}

export interface ProjectsData {
  projects: Project[];
}

export interface ExperiencesData {
  experience: Experience[];
}

export interface CertificationsData {
  certifications: Certification[];
}

export interface GalleryData {
  posts: JourneyPost[];
}

export interface SiteData {
  sections: Record<string, unknown>;
}

export type CollectionKey = "projects" | "experiences" | "certifications" | "gallery" | "site";

export type CollectionData = ProjectsData | ExperiencesData | CertificationsData | GalleryData | SiteData;

export interface GitHubUser {
  login: string;
  avatar_url: string;
  name: string | null;
}
