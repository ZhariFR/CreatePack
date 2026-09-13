// Catégorie "Épées" — 7 matériaux vanilla (copper inclus).

const MATERIALS = [
  { id: "wood", label: "Bois" },
  { id: "stone", label: "Pierre" },
  { id: "iron", label: "Fer" },
  { id: "gold", label: "Or" },
  { id: "diamond", label: "Diamant" },
  { id: "netherite", label: "Netherite" },
  { id: "copper", label: "Cuivre" },
];

export const swords = {
  id: "epees",
  label: "Épées",
  slots: MATERIALS.map((m) => ({
    id: `${m.id}_sword`,
    label: `Épée en ${m.label.toLowerCase()}`,
    targetPath: `textures/items/${m.id}_sword.png`,
    variants:
      m.id === "diamond"
        ? [
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
          ]
        : [], // pas encore de visuel pour ce matériau — voir README.md
  })),
};
