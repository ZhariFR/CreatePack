// Construit un manifest.json valide pour un resource pack Minecraft Bedrock.
// Doc officielle du format : https://learn.microsoft.com/minecraft/creator/documents/resourcepack

/**
 * @param {Object} packInfo
 * @param {string} packInfo.name - Nom du pack affiché en jeu
 * @param {string} packInfo.description - Description affichée en jeu
 * @param {[number, number, number]} [packInfo.version] - ex: [1, 0, 0]
 * @param {[number, number, number]} [packInfo.minEngineVersion] - ex: [1, 20, 0]
 * @returns {Object} l'objet manifest, prêt à être JSON.stringify()
 */
export function buildManifest(packInfo) {
  const version = packInfo.version ?? [1, 0, 0];
  const minEngineVersion = packInfo.minEngineVersion ?? [1, 20, 0];

  return {
    format_version: 2,
    header: {
      name: packInfo.name || "Mon pack de textures",
      description: packInfo.description || "Généré avec le configurateur de pack",
      uuid: crypto.randomUUID(),
      version,
      min_engine_version: minEngineVersion,
    },
    modules: [
      {
        type: "resources",
        uuid: crypto.randomUUID(),
        version,
      },
    ],
  };
}
