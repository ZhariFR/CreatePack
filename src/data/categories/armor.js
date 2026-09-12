// Catégorie "Armures". Slot "set" : un seul choix produit les 4 icônes
// d'inventaire + les 2 fichiers de rendu porté (layer1 = casque/plastron/
// bottes, layer2 = jambières). Chaque output a un group ("icon"/"render")
// pour le formulaire d'upload custom — fournir un seul des deux groupes
// est possible. Un autre matériau = un autre slot "set" à part.

export const armor = {
  id: "armures",
  label: "Armures",
  slots: [
    {
      id: "diamond_armor_set",
      label: "Armure en diamant",
      outputs: [
        { key: "icon_helmet", label: "Casque (icône)", group: "icon", targetPath: "textures/items/diamond_helmet.png" },
        { key: "icon_chestplate", label: "Plastron (icône)", group: "icon", targetPath: "textures/items/diamond_chestplate.png" },
        { key: "icon_leggings", label: "Jambières (icône)", group: "icon", targetPath: "textures/items/diamond_leggings.png" },
        { key: "icon_boots", label: "Bottes (icône)", group: "icon", targetPath: "textures/items/diamond_boots.png" },
        { key: "layer1", label: "Rendu porté — casque/plastron/bottes", group: "render", targetPath: "textures/models/armor/diamond_1.png" },
        { key: "layer2", label: "Rendu porté — jambières", group: "render", targetPath: "textures/models/armor/diamond_2.png" },
      ],
      variants: [],
    },
  ],
};
