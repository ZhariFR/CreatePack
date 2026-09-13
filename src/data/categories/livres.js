// Catégorie "Livres" — tuiles vides (pas encore de texture dans la
// bibliothèque), à remplir en uploadant sa propre image sur le site.
// targetPath vérifiés contre item_texture.json (Mojang/bedrock-samples).

export const livres = {
  id: "livres",
  label: "Livres",
  slots: [
    {
      id: "book_enchanted",
      label: "Livre enchanté",
      targetPath: "textures/items/book_enchanted.png",
      variants: [],
    },
    {
      id: "book_normal",
      label: "Livre",
      targetPath: "textures/items/book_normal.png",
      variants: [],
    },
    {
      id: "book_writable",
      label: "Livre et plume",
      targetPath: "textures/items/book_writable.png",
      variants: [],
    },
    {
      id: "book_written",
      label: "Livre écrit",
      targetPath: "textures/items/book_written.png",
      variants: [],
    },
  ],
};
