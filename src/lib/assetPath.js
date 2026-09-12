// Construit l'URL d'un fichier /public en tenant compte du "base" de Vite
// (nécessaire pour GitHub Pages, le site vivant dans /nom-du-repo/).
export function assetUrl(path) {
  const base = import.meta.env.BASE_URL;
  const cleanBase = base.endsWith("/") ? base : base + "/";
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return cleanBase + cleanPath;
}
