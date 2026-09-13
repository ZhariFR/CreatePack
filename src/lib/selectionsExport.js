import { serializeSelections, deserializeSelections } from "./selectionsSerialize.js";

/**
 * Télécharge la sélection en cours sous forme de fichier .json.
 */
export async function exportSelectionsToFile(selections) {
  const serializable = await serializeSelections(selections);
  const blob = new Blob([JSON.stringify(serializable, null, 2)], { type: "application/json" });

  const date = new Date().toISOString().slice(0, 10);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `selection-pack-textures-${date}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Lit un fichier .json exporté précédemment et le reconvertit en sélection
 * utilisable (voir useSelections.js). Lève une erreur si le fichier n'est
 * pas un JSON valide — à l'appelant de l'attraper et d'avertir l'utilisateur.
 */
export async function importSelectionsFromFile(file) {
  const text = await file.text();
  const parsed = JSON.parse(text);
  return deserializeSelections(parsed);
}
