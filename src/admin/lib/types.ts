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

export interface HeroContent {
  name?: string;
  roles?: string[];
  tagline?: string;
  primaryCtaLabel?: string;
  secondaryCtaLabel?: string;
  cvPath?: string;
}

export interface AboutBlock {
  subtitle?: string;
  fieldsOfInterestTitle?: string;
  fieldsOfInterest?: { title: string; description: string }[];
  technicalArsenalTitle?: string;
  technicalArsenal?: { category: string; technologies: string[] }[];
  stats?: { value: string; label: string }[];
}

export interface AboutContentData {
  about?: AboutBlock;
  experience?: { subtitle?: string };
  projects?: { subtitle?: string };
  certifications?: { subtitle?: string };
}

export interface SiteData {
  sections: {
    hero?: HeroContent;
    about?: AboutBlock;
    experience?: { subtitle?: string };
    projects?: { subtitle?: string };
    certifications?: { subtitle?: string };
  };
}

export type CollectionKey = "projects" | "experiences" | "certifications" | "gallery" | "hero" | "about";

export type CollectionData =
  | ProjectsData
  | ExperiencesData
  | CertificationsData
  | GalleryData
  | HeroContent
  | AboutContentData;

export interface GitHubUser {
  login: string;
  avatar_url: string;
  name: string | null;
}
