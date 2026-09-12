// Liste des catégories affichées sur le site. Pour en ajouter une :
// crée le fichier sur le modèle de swords.js, importe-le, ajoute-le ici.

import { swords } from "./swords.js";
import { armor } from "./armor.js";
import { blocks } from "./blocks.js";

export const categories = [
  swords,
  armor,
  blocks,
  // outils,
];
