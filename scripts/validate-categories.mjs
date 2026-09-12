// Vérifie l'intégrité de src/data/categories/ AVANT de tester dans le
// navigateur : détecte les ids en double, les targetPath dupliqués, et les
// fichiers image référencés qui n'existent pas réellement dans /public.
//
// Gère les 3 types de slots : simple (targetPath+variants), multi-face
// (faces: [...]), et "set" (outputs+variants avec un files{} par variante).
//
// Usage : npm run validate

import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { categories } from "../src/data/categories/index.js";
import { isMultiFace, isSetSlot } from "../src/lib/slotTargets.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "..", "public");

const errors = [];
const warnings = [];

const seenCategoryIds = new Set();
const seenSlotIds = new Set();
const seenVariantIds = new Set();
const seenTargetPaths = new Map(); // targetPath -> description

let slotCount = 0;
let targetPathCount = 0;
let variantCount = 0;

function checkFile(label, value) {
  if (!value) {
    errors.push(`${label} : chemin manquant.`);
    return;
  }
  const fullPath = join(publicDir, value.startsWith("/") ? value.slice(1) : value);
  if (!existsSync(fullPath)) {
    errors.push(`${label} : fichier introuvable -> public/${value}`);
  }
}

function registerTargetPath(targetPath, description) {
  if (!targetPath) {
    errors.push(`${description} n'a pas de targetPath.`);
    return;
  }
  if (seenTargetPaths.has(targetPath)) {
    errors.push(`targetPath dupliqué : "${targetPath}" utilisé par "${description}" ET "${seenTargetPaths.get(targetPath)}"`);
  } else {
    seenTargetPaths.set(targetPath, description);
  }
  targetPathCount++;
}

for (const category of categories) {
  if (seenCategoryIds.has(category.id)) {
    errors.push(`Catégorie en double : id "${category.id}"`);
  }
  seenCategoryIds.add(category.id);

  if (!category.slots || category.slots.length === 0) {
    warnings.push(`Catégorie "${category.id}" n'a aucun slot.`);
    continue;
  }

  for (const slot of category.slots) {
    slotCount++;

    if (seenSlotIds.has(slot.id)) {
      errors.push(`Slot en double : id "${slot.id}" (catégorie "${category.id}")`);
    }
    seenSlotIds.add(slot.id);

    const kindCount = [isMultiFace(slot), isSetSlot(slot), Boolean(slot.targetPath)].filter(Boolean).length;
    if (kindCount > 1) {
      errors.push(`Slot "${slot.id}" mélange plusieurs formats (faces/outputs/targetPath) — il n'en faut qu'un.`);
      continue;
    }

    if (isMultiFace(slot)) {
      for (const face of slot.faces) {
        registerTargetPath(face.targetPath, `${slot.id}:${face.id}`);

        if (!face.variants || face.variants.length === 0) {
          warnings.push(`"${slot.id}:${face.id}" n'a encore aucune variante (variants: []).`);
          continue;
        }
        for (const variant of face.variants) {
          variantCount++;
          if (seenVariantIds.has(variant.id)) {
            errors.push(`Variante en double : id "${variant.id}" (${slot.id}:${face.id})`);
          }
          seenVariantIds.add(variant.id);
          checkFile(`Variante "${variant.id}" (${slot.id}:${face.id}) thumbnail`, variant.thumbnail);
          checkFile(`Variante "${variant.id}" (${slot.id}:${face.id}) textureUrl`, variant.textureUrl);
        }
      }
    } else if (isSetSlot(slot)) {
      const outputKeys = new Set();
      for (const output of slot.outputs) {
        registerTargetPath(output.targetPath, `${slot.id}.outputs.${output.key}`);
        outputKeys.add(output.key);
      }

      if (!slot.variants || slot.variants.length === 0) {
        warnings.push(`"${slot.id}" (set) n'a encore aucune variante (variants: []).`);
        continue;
      }
      for (const variant of slot.variants) {
        variantCount++;
        if (seenVariantIds.has(variant.id)) {
          errors.push(`Variante en double : id "${variant.id}" (set "${slot.id}")`);
        }
        seenVariantIds.add(variant.id);
        checkFile(`Variante "${variant.id}" (set "${slot.id}") thumbnail`, variant.thumbnail);

        for (const key of outputKeys) {
          const filePath = variant.files?.[key];
          checkFile(`Variante "${variant.id}" (set "${slot.id}") files.${key}`, filePath);
        }
      }
    } else {
      registerTargetPath(slot.targetPath, slot.id);

      if (!slot.variants || slot.variants.length === 0) {
        warnings.push(`"${slot.id}" n'a encore aucune variante (variants: []).`);
        continue;
      }
      for (const variant of slot.variants) {
        variantCount++;
        if (seenVariantIds.has(variant.id)) {
          errors.push(`Variante en double : id "${variant.id}" (${slot.id})`);
        }
        seenVariantIds.add(variant.id);
        checkFile(`Variante "${variant.id}" (${slot.id}) thumbnail`, variant.thumbnail);
        checkFile(`Variante "${variant.id}" (${slot.id}) textureUrl`, variant.textureUrl);
      }
    }
  }
}

console.log(`Catégories : ${categories.length}`);
console.log(`Slots : ${slotCount}`);
console.log(`Fichiers de sortie (targetPath) distincts : ${targetPathCount}`);
console.log(`Variantes : ${variantCount}`);
console.log("");

if (warnings.length > 0) {
  console.log(`⚠ ${warnings.length} avertissement(s) :`);
  for (const w of warnings) console.log("  - " + w);
  console.log("");
}

if (errors.length > 0) {
  console.log(`✗ ${errors.length} erreur(s) :`);
  for (const e of errors) console.log("  - " + e);
  process.exit(1);
} else {
  console.log("✓ Rien à signaler côté erreurs.");
}
