// Combine toutes les catégories du jeu. Pour ajouter une nouvelle catégorie :
// crée le fichier sur le modèle de swords.js, importe-le, ajoute-le ici.

import { swords } from "./swords.js";
import { tools } from "./tools.js";
import { armor } from "./armor.js";
import { blocks } from "./blocks.js";
import { nourriture } from "./nourriture.js";
import { materiaux } from "./materiaux.js";
import { potions } from "./potions.js";
import { utilitaires } from "./utilitaires.js";
import { livres } from "./livres.js";
import { teintures } from "./teintures.js";
import { portes } from "./portes.js";
import { wagonnets } from "./wagonnets.js";
import { disques } from "./disques.js";
import { recent } from "./recent.js";

export const categories = [
  swords,
  tools,
  armor,
  blocks,
  nourriture,
  materiaux,
  potions,
  utilitaires,
  livres,
  teintures,
  portes,
  wagonnets,
  disques,
  recent,
];
