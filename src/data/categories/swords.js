// Catégorie "Épées". Une entrée par matériau/slot Bedrock réel.
//
// Voir /src/data/categories/README.md pour le format exact attendu et les
// règles à suivre (notamment : ne jamais inventer un targetPath, toujours
// vérifier la doc officielle Bedrock).

export const swords = {
  id: "epees",
  label: "Épées",
  slots: [
    {
      id: "diamond_sword",
      label: "Épée en diamant",
      targetPath: "textures/items/diamond_sword.png",
      variants: [
        {
          id: "diamond_sword_neon",
          label: "Néon",
          thumbnail: "textures/swords/diamond_neon_thumb.png",
          textureUrl: "textures/swords/diamond_neon.png",
        },
        {
          id: "diamond_sword_classic",
          label: "Classique amélioré",
          thumbnail: "textures/swords/diamond_classic_thumb.png",
          textureUrl: "textures/swords/diamond_classic.png",
        },
      ],
    },
  ],
};
