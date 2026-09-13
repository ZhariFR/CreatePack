// Catégorie "Outils" — pioche/hache/pelle/houe, 7 matériaux vanilla chacun
// (copper inclus).

const MATERIALS = [
  { id: "wood", label: "Bois" },
  { id: "stone", label: "Pierre" },
  { id: "iron", label: "Fer" },
  { id: "gold", label: "Or" },
  { id: "diamond", label: "Diamant" },
  { id: "netherite", label: "Netherite" },
  { id: "copper", label: "Cuivre" },
];

const TOOL_TYPES = [
  { id: "pickaxe", label: "Pioche" },
  { id: "axe", label: "Hache" },
  { id: "shovel", label: "Pelle" },
  { id: "hoe", label: "Houe" },
];

const slots = [];
for (const tool of TOOL_TYPES) {
  for (const material of MATERIALS) {
    slots.push({
      id: `${material.id}_${tool.id}`,
      label: `${tool.label} en ${material.label.toLowerCase()}`,
      targetPath: `textures/items/${material.id}_${tool.id}.png`,
      variants: [],
    });
  }
}

export const tools = {
  id: "outils",
  label: "Outils",
  slots,
};
