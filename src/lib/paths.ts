/**
 * Get the base path for the application
 * This handles both local development and GitHub Pages deployment
 */
export const getBasePath = (): string => {
  // In development, base path is "/"
  // In production (GitHub Pages), base path is "/My-portfolio/"
  return import.meta.env.BASE_URL || "/";
};

/**
 * Get the absolute path for a resource
 * Prepends the base path to ensure assets load correctly in all environments
 */
export const getAssetPath = (path: string): string => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  const basePath = getBasePath();
  if (path.startsWith(basePath)) return path;

  const cleanPath = path.startsWith("/") ? path.substring(1) : path;
  return `${basePath}${cleanPath}`;
};
