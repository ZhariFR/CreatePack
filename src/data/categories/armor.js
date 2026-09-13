// Catégorie "Armures" — 7 matériaux vanilla (copper inclus), chacun en slot
// "set" (voir README.md) : un seul choix produit à la fois les 4 icônes
// d'inventaire ET les 2 fichiers de rendu porté (le premier partagé
// casque/plastron/bottes, le second pour les jambières — nommés
// <matériau>_1.png / <matériau>_2.png en Bedrock, PAS "_layer_1/_layer_2"
// qui est la convention Java).

const MATERIALS = [
  { id: "leather", label: "Cuir" },
  { id: "chainmail", label: "Chaîne" },
  { id: "iron", label: "Fer" },
  { id: "gold", label: "Or" },
  { id: "diamond", label: "Diamant" },
  { id: "netherite", label: "Netherite" },
  { id: "copper", label: "Cuivre" },
];

export const armor = {
  id: "armures",
  label: "Armures",
  slots: MATERIALS.map((m) => ({
    id: `${m.id}_armor_set`,
    label: `Armure en ${m.label.toLowerCase()}`,
    outputs: [
      { key: "icon_helmet", label: "Casque (icône)", group: "icon", targetPath: `textures/items/${m.id}_helmet.png` },
      { key: "icon_chestplate", label: "Plastron (icône)", group: "icon", targetPath: `textures/items/${m.id}_chestplate.png` },
      { key: "icon_leggings", label: "Jambières (icône)", group: "icon", targetPath: `textures/items/${m.id}_leggings.png` },
      { key: "icon_boots", label: "Bottes (icône)", group: "icon", targetPath: `textures/items/${m.id}_boots.png` },
      { key: "layer1", label: "Rendu porté — casque/plastron/bottes", group: "render", targetPath: `textures/models/armor/${m.id}_1.png` },
      { key: "layer2", label: "Rendu porté — jambières", group: "render", targetPath: `textures/models/armor/${m.id}_2.png` },
    ],
    variants: [], // pas encore de set dans la bibliothèque — voir README.md
  })),
};
