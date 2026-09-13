# Format des catégories

Chaque fichier de ce dossier exporte UNE catégorie, sur ce modèle :

```js
export const nomDeLaCategorie = {
  id: "identifiant_unique_de_la_categorie",
  label: "Nom affiché en français",
  slots: [
    {
      id: "identifiant_unique_du_slot",
      label: "Nom affiché en français",
      targetPath: "textures/.../fichier.png", // chemin EXACT Bedrock
      variants: [
        {
          id: "identifiant_unique_de_la_variante",
          label: "Nom affiché en français",
          thumbnail: "textures/<categorie>/<fichier>_thumb.png",
          textureUrl: "textures/<categorie>/<fichier>.png",
        },
      ],
    },
  ],
};
```

### Armure : un set complet = UN SEUL choix (slot "set")

Une pièce d'armure a en réalité DEUX textures bien distinctes :

- **L'icône d'inventaire** (`textures/items/diamond_helmet.png` etc.) : une
  par pièce.
- **Le rendu porté** (ce qui s'affiche sur le personnage) : `textures/models/armor/<materiau>_1.png`
  (casque + plastron + bottes, PARTAGÉ entre les 3) et `<materiau>_2.png`
  (jambières, à part). ⚠️ Bedrock nomme ces fichiers `_1`/`_2` — PAS
  `_layer_1`/`_layer_2`, qui est la convention Java (différente).

Comme un joueur ne choisit jamais des pièces dépareillées, l'armure utilise
un slot **"set"** : UN SEUL choix qui produit PLUSIEURS fichiers à la fois
(remplace `targetPath`/`variants` par `outputs` + `variants`) :

```js
{
  id: "diamond_armor_set",
  label: "Armure en diamant",
  outputs: [
    { key: "icon_helmet", targetPath: "textures/items/diamond_helmet.png" },
    { key: "icon_chestplate", targetPath: "textures/items/diamond_chestplate.png" },
    { key: "icon_leggings", targetPath: "textures/items/diamond_leggings.png" },
    { key: "icon_boots", targetPath: "textures/items/diamond_boots.png" },
    { key: "layer1", targetPath: "textures/models/armor/diamond_1.png" },
    { key: "layer2", targetPath: "textures/models/armor/diamond_2.png" },
  ],
  variants: [
    {
      id: "diamond_set_exemple",
      label: "Nom du set",
      thumbnail: "textures/armor/<fichier>_thumb.png", // aperçu affiché sur la tuile
      files: {
        // une entrée par "key" définie dans outputs ci-dessus, chemin RELATIF
        // à /public, comme thumbnail/textureUrl ailleurs
        icon_helmet: "textures/armor/<fichier>_helmet.png",
        icon_chestplate: "textures/armor/<fichier>_chestplate.png",
        icon_leggings: "textures/armor/<fichier>_leggings.png",
        icon_boots: "textures/armor/<fichier>_boots.png",
        layer1: "textures/armor/<fichier>_1.png",
        layer2: "textures/armor/<fichier>_2.png",
      },
    },
  ],
}
```

Chaque `variant.files` doit fournir un fichier pour CHAQUE `key` listée dans
`outputs` du même slot — sinon cette sortie sera silencieusement absente du
pack généré. Chaque `output` peut aussi avoir un `label` (texte affiché dans
le formulaire d'upload d'un set personnalisé, voir plus bas) — optionnel,
retombe sur `key` si absent. Un autre matériau (fer, or...) = un autre slot
"set" à part, avec ses propres `outputs`/`targetPath`.

**Upload d'un set personnalisé** : contrairement à un slot simple ou
multi-face, l'utilisateur ne glisse pas un seul fichier — un formulaire dédié
(dans la fenêtre de choix) lui demande un fichier par `output` du slot, plus
un nom. Rien à faire côté données pour l'activer, ça marche automatiquement
dès qu'un slot a des `outputs`.

## Slots multi-face (blocs avec plusieurs textures)

Un bloc comme une table de craft n'a pas UNE texture mais PLUSIEURS (dessus,
face avant, côtés...). Pour ça, remplace `targetPath` + `variants` par un
tableau `faces` — chaque face a son propre `targetPath` + `variants`,
exactement comme un slot simple :

```js
{
  id: "crafting_table",
  label: "Table de craft",
  faces: [
    {
      id: "top",              // unique DANS ce slot (pas besoin d'être
                               // unique dans tout le projet)
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
  ],
}
```

Un slot a **soit** `targetPath`+`variants` (texture unique), **soit**
`faces` (plusieurs textures) — jamais les deux en même temps. Voir
`blocks.js` pour un exemple complet.

### Aperçu 3D (cube) pour les blocs multi-face

Si les ids de faces utilisent ce vocabulaire reconnu : `"top"`, `"bottom"`,
`"front"`, `"side"` — un cube 3D texturé s'affiche automatiquement dans la
fenêtre de choix (voir `Preview3D.jsx`). `"side"` est appliqué aux 3 faces
non-avant du cube (gauche/droite/arrière), ce qui correspond au comportement
de la plupart des blocs vanilla. Si un bloc a besoin de faces vraiment
différentes sur chaque côté (gauche ≠ droite ≠ arrière), le cube 3D ne le
représentera pas fidèlement — mais le pack généré restera correct puisqu'il
utilise directement les `targetPath`, indépendamment de l'aperçu.

## Règles importantes

- **`targetPath`** (sur un slot simple OU sur chaque face) doit être le
  chemin EXACT attendu par un resource pack Minecraft **Bedrock** (pas Java,
  c'est différent). En cas de doute, vérifier la doc officielle plutôt que
  deviner.
- **`thumbnail` et `textureUrl`** sont des chemins RELATIFS au dossier
  `/public` du site (sans `/` au début). Les vrais fichiers doivent exister
  dans `public/textures/<categorie>/...` — sinon la texture sera listée comme
  "manquante" au moment de générer un pack.
- **`previewZone` (optionnel, hérité)** : ancien mécanisme pour afficher un
  schéma de personnage par pièce d'armure séparée. Plus utilisé depuis que
  l'armure est passée en slot "set" (voir plus haut) — ne pas l'ajouter sur
  un nouveau slot.
- **`variants: []` (vide) est acceptable** tant qu'on n'a pas encore les
  vrais visuels — ça permet de préparer la liste des slots (ou des faces) à
  l'avance sans bloquer sur les assets. Ne jamais inventer un visuel/nom de
  fichier qui n'existe pas réellement.
- Chaque `id` de catégorie, de slot, et de variante doit être unique dans
  tout le projet. Les `id` de faces doivent juste être uniques À L'INTÉRIEUR
  de leur slot (ex: deux slots différents peuvent chacun avoir une face
  `"top"`).

## Ajouter une nouvelle catégorie

1. Crée un fichier `nom_categorie.js` dans ce dossier, sur le modèle de
   `swords.js` (slot simple), `blocks.js` (slot multi-face), ou `armor.js`
   (slot "set", un choix = plusieurs fichiers assortis).
2. Ajoute les vrais fichiers image dans `public/textures/nom_categorie/`.
3. Dans `index.js`, importe la catégorie et ajoute-la au tableau `categories`.
4. Lance `npm run validate` pour vérifier qu'il n'y a pas d'erreur.
