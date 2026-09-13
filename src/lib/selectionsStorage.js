// Sauvegarde automatique de la sélection en cours dans le navigateur, pour
// ne pas tout perdre en cas de rafraîchissement de page accidentel. Voir
// selectionsSerialize.js pour la conversion des fichiers uploadés.
//
// Si le stockage du navigateur est plein (quota dépassé), la sauvegarde
// échoue silencieusement (avertissement en console) plutôt que de faire
// planter le site.

import { serializeSelections, deserializeSelections } from "./selectionsSerialize.js";

const STORAGE_KEY = "texturePackBuilder:selections:v1";

export async function saveSelections(selections) {
  try {
    const serializable = await serializeSelections(selections);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
  } catch (err) {
    console.warn("Impossible de sauvegarder la sélection localement :", err);
  }
}

export async function loadSelections() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return await deserializeSelections(JSON.parse(raw));
  } catch (err) {
    console.warn("Impossible de charger la sélection sauvegardée :", err);
    return {};
  }
}
