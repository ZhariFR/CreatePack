import JSZip from "jszip";
import { buildManifest } from "./manifestBuilder.js";
import { assetUrl } from "./assetPath.js";
import { SITE_NAME, AUTHOR_NAME, DEFAULT_ICON_PATH } from "../config.js";

/**
 * Une "sélection" représente la texture choisie par l'utilisateur pour un
 * emplacement donné (ex: la texture de l'épée en diamant).
 *
 * Deux formes possibles :
 *  - { source: "library", url: "..." } -> texture de la bibliothèque intégrée
 *    (url déjà résolue avec le bon base path, voir assetUrl())
 *  - { source: "upload", file: File } -> texture envoyée par l'utilisateur
 *
 * @typedef {Object} Selection
 * @property {"library"|"upload"} source
 * @property {string} [url]
 * @property {File} [file]
 */

/**
 * @param {Record<string, Selection>} selections - clé = targetPath Bedrock
 * @param {{ name: string, description: string, iconFile?: File }} packInfo
 * @returns {Promise<Blob>} le contenu du .mcpack, prêt à être téléchargé
 */
export async function buildPack(selections, packInfo) {
  const zip = new JSZip();

  const manifest = buildManifest(packInfo);
  zip.file("manifest.json", JSON.stringify(manifest, null, 2));

  const iconBytes = await resolveIconBytes(packInfo);
  if (iconBytes) {
    zip.file("pack_icon.png", iconBytes);
  }

  zip.file("CREDITS.txt", buildCreditsText(packInfo));

  const entries = Object.entries(selections);
  const missing = [];

  for (const [targetPath, selection] of entries) {
    const bytes = await resolveTextureBytes(selection);
    if (bytes) {
      zip.file(targetPath, bytes);
    } else {
      missing.push(targetPath);
    }
  }

  if (missing.length > 0) {
    console.warn("Textures manquantes, non incluses dans le pack :", missing);
  }

  const blob = await zip.generateAsync({ type: "blob" });
  return { blob, missing };
}

/**
 * Récupère les octets d'une texture, qu'elle vienne de la bibliothèque
 * (fetch d'un fichier statique du site) ou d'un upload utilisateur (File).
 * @param {Selection} selection
 */
async function resolveTextureBytes(selection) {
  if (!selection) return null;

  if (selection.source === "upload" && selection.file) {
    return selection.file.arrayBuffer();
  }

  if (selection.source === "library" && selection.url) {
    const response = await fetch(selection.url);
    if (!response.ok) {
      console.error(`Texture introuvable (${response.status}) : ${selection.url}`);
      return null;
    }
    return response.arrayBuffer();
  }

  return null;
}

/**
 * Récupère l'icône du pack : celle fournie par l'utilisateur si présente,
 * sinon l'icône par défaut du site.
 */
async function resolveIconBytes(packInfo) {
  if (packInfo?.iconFile) {
    return packInfo.iconFile.arrayBuffer();
  }
  const response = await fetch(assetUrl(DEFAULT_ICON_PATH));
  if (!response.ok) {
    console.error("Icône par défaut introuvable :", DEFAULT_ICON_PATH);
    return null;
  }
  return response.arrayBuffer();
}

function buildCreditsText(packInfo) {
  const date = new Date().toLocaleDateString("fr-FR");
  return [
    `Pack généré avec ${SITE_NAME}`,
    `Créé par ${AUTHOR_NAME}`,
    "",
    `Nom du pack : ${packInfo?.name || "-"}`,
    `Description : ${packInfo?.description || "-"}`,
    `Généré le : ${date}`,
  ].join("\n");
}

/**
 * Déclenche le téléchargement du pack dans le navigateur, sans dépendance
 * externe (pas besoin de file-saver).
 * @param {Blob} blob
 * @param {string} filename - ex: "mon-pack.mcpack"
 */
export function downloadPack(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
