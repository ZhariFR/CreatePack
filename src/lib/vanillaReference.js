import { assetUrl } from "./assetPath.js";

// Dossier optionnel où déposer ses propres textures vanilla en local, pour
// affichage de référence (jamais commit, voir .gitignore + son README).
export function vanillaReferenceUrl(targetPath) {
  if (!targetPath) return null;
  return assetUrl(`vanilla-reference/${targetPath}`);
}
