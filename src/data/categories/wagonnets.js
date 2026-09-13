// Catégorie "Wagonnets" — tuiles vides (pas encore de texture dans la
// bibliothèque), à remplir en uploadant sa propre image sur le site.
// targetPath vérifiés contre item_texture.json (Mojang/bedrock-samples).

export const wagonnets = {
  id: "wagonnets",
  label: "Wagonnets",
  slots: [
    {
      id: "minecart_chest",
      label: "Wagonnet avec coffre",
      targetPath: "textures/items/minecart_chest.png",
      variants: [],
    },
    {
      id: "minecart_command_block",
      label: "Wagonnet avec bloc de commande",
      targetPath: "textures/items/minecart_command_block.png",
      variants: [],
    },
    {
      id: "minecart_furnace",
      label: "Wagonnet avec fourneau",
      targetPath: "textures/items/minecart_furnace.png",
      variants: [],
    },
    {
      id: "minecart_hopper",
      label: "Wagonnet avec entonnoir",
      targetPath: "textures/items/minecart_hopper.png",
      variants: [],
    },
    {
      id: "minecart_normal",
      label: "Wagonnet",
      targetPath: "textures/items/minecart_normal.png",
      variants: [],
    },
    {
      id: "minecart_tnt",
      label: "Wagonnet avec TNT",
      targetPath: "textures/items/minecart_tnt.png",
      variants: [],
    },
  ],
};
