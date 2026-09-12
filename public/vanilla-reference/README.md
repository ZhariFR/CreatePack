# Textures vanilla de référence (optionnel)

Ce dossier permet d'afficher la **vraie texture vanilla** de Minecraft comme
aperçu "avant remplacement", à la place de l'icône générique "Vanilla",
partout dans le générateur (tuiles, mosaïque des blocs multi-face).

## ⚠️ Droit d'auteur

Les textures de Minecraft appartiennent à Mojang. **Ne mets ici que des
fichiers que tu as le droit d'utiliser** (extraits de ta propre installation
du jeu, ou récupérés depuis le dépôt officiel Mojang prévu pour les
créateurs : https://github.com/Mojang/bedrock-samples).

Ce dossier est exclu du dépôt Git (voir `.gitignore` à la racine) : ces
fichiers restent uniquement sur ta machine, ils ne seront **jamais** publiés
sur GitHub ni inclus dans un pack généré par le site.

## Comment faire

Reproduis exactement la même arborescence que les `targetPath` utilisés
dans `src/data/categories/` (le chemin Bedrock du fichier, tel quel) :

```
public/vanilla-reference/
  textures/
    items/
      diamond_sword.png
      diamond_helmet.png
      ...
    blocks/
      crafting_table_top.png
      crafting_table_front.png
      ...
```

Le plus simple : télécharge le dossier `resource_pack/textures/` du dépôt
`bedrock-samples` de Mojang, et copie-le tel quel dans
`public/vanilla-reference/` (même structure, aucun renommage nécessaire).

Rien à configurer côté code : si le fichier existe, il s'affiche
automatiquement à la place de l'icône générique. S'il n'existe pas, le site
continue de fonctionner normalement avec l'icône par défaut.
