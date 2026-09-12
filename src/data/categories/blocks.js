// Catégorie "Blocs". La table de craft utilise un slot multi-face (faces:
// dessus/dessous/avant/côtés au lieu d'un seul targetPath).
// Chemins vérifiés dans blocks.json de bedrock-samples. Note : "down" pointe
// en réalité vers planks_oak.png, pas vers un fichier crafting_table_bottom.

export const blocks = {
  id: "blocs",
  label: "Blocs",
  slots: [
    {
      id: "crafting_table",
      label: "Table de craft",
      faces: [
        {
          id: "top",
          label: "Dessus",
          targetPath: "textures/blocks/crafting_table_top.png",
          variants: [],
        },
        {
          id: "front",
          label: "Face avant",
          targetPath: "textures/blocks/crafting_table_front.png",
          variants: [],
        },
        {
          id: "side",
          label: "Côtés",
          targetPath: "textures/blocks/crafting_table_side.png",
          variants: [],
        },
        {
          id: "bottom",
          label: "Dessous",
          targetPath: "textures/blocks/planks_oak.png",
          variants: [],
        },
      ],
    },
  ],
};
