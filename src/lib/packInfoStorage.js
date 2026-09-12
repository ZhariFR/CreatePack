// Sauvegarde du nom/description du pack pour ne pas les retaper à chaque visite.
const PACK_INFO_KEY = "texturePackBuilder:packInfo:v1";

export function loadPackInfo() {
  try {
    const raw = localStorage.getItem(PACK_INFO_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.warn("Impossible de charger les infos du pack sauvegardées :", err);
    return null;
  }
}

export function savePackInfo(info) {
  try {
    localStorage.setItem(PACK_INFO_KEY, JSON.stringify(info));
  } catch (err) {
    console.warn("Impossible de sauvegarder les infos du pack :", err);
  }
}
