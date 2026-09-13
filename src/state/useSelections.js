import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { assetUrl } from "../lib/assetPath.js";
import { loadSelections, saveSelections } from "../lib/selectionsStorage.js";

/**
 * Gère la sélection de texture pour chaque "cible" (un slot simple, ou une
 * face d'un slot multi-face — voir slotTargets.js). Sauvegarde/restaure
 * automatiquement depuis le navigateur. Retourne un objet indexé par
 * targetPath, exactement le format attendu par packBuilder.buildPack().
 */
export function useSelections() {
  // { [targetKey]: { targetPath, source: "library"|"upload", url?, file?, label } }
  const [selections, setSelections] = useState({});
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    loadSelections().then((restored) => {
      if (cancelled) return;
      setSelections(restored);
      hasLoadedRef.current = true;
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hasLoadedRef.current) return;
    saveSelections(selections);
  }, [selections]);

  const selectVariant = useCallback((target, variant) => {
    setSelections((prev) => ({
      ...prev,
      [target.key]: {
        targetPath: target.targetPath,
        source: "library",
        url: assetUrl(variant.textureUrl),
        thumbnail: variant.thumbnail,
        label: variant.label,
      },
    }));
  }, []);

  const selectUpload = useCallback((target, file) => {
    setSelections((prev) => ({
      ...prev,
      [target.key]: {
        targetPath: target.targetPath,
        source: "upload",
        file,
        label: file.name,
      },
    }));
  }, []);

  // Sélectionne un "set" complet de la bibliothèque (voir slotTargets.js /
  // armor.js) : un seul choix qui produit plusieurs fichiers à la fois.
  const selectSetVariant = useCallback((slot, variant) => {
    const outputs = slot.outputs.map((output) => ({
      targetPath: output.targetPath,
      source: "library",
      url: assetUrl(variant.files[output.key]),
    }));
    setSelections((prev) => ({
      ...prev,
      [slot.id]: {
        isSet: true,
        variantId: variant.id,
        label: variant.label,
        thumbnail: variant.thumbnail,
        outputs,
      },
    }));
  }, []);

  // Sélectionne un set complet UPLOADÉ par l'utilisateur (files = objet
  // { [outputKey]: File }). Pas besoin de fournir TOUS les outputs du slot :
  // ex. ne donner que le rendu porté (layer1/layer2) sans toucher aux
  // icônes est volontairement possible — ce qui n'est pas fourni reste
  // simplement vanilla dans le pack généré.
  const selectSetUpload = useCallback((slot, { label, files }) => {
    const providedOutputs = slot.outputs.filter((output) => files[output.key]);
    const outputs = providedOutputs.map((output) => ({
      targetPath: output.targetPath,
      source: "upload",
      file: files[output.key],
    }));

    // Miniature : priorité à une icône fournie (plus reconnaissable), sinon
    // la première texture fournie, quelle qu'elle soit.
    const thumbnailOutput =
      providedOutputs.find((o) => o.group === "icon") || providedOutputs[0];

    setSelections((prev) => ({
      ...prev,
      [slot.id]: {
        isSet: true,
        label,
        thumbnailFile: thumbnailOutput ? files[thumbnailOutput.key] : null,
        outputs,
      },
    }));
  }, []);

  const clearTarget = useCallback((targetKey) => {
    setSelections((prev) => {
      const next = { ...prev };
      delete next[targetKey];
      return next;
    });
  }, []);

  // Efface toutes les cibles données d'un coup (ex: toutes les faces d'un
  // bloc quand on clique la croix sur la tuile).
  const clearTargets = useCallback((targetKeys) => {
    setSelections((prev) => {
      const next = { ...prev };
      for (const key of targetKeys) delete next[key];
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setSelections({});
  }, []);

  // Remplace toute la sélection d'un coup (utilisé par l'import de fichier).
  const importSelections = useCallback((restored) => {
    setSelections(restored);
  }, []);

  // Reformate pour packBuilder.buildPack : { [targetPath]: Selection }
  const asPackSelections = useMemo(() => {
    const out = {};
    for (const entry of Object.values(selections)) {
      if (entry.isSet) {
        for (const output of entry.outputs) {
          out[output.targetPath] =
            output.source === "upload"
              ? { source: "upload", file: output.file }
              : { source: "library", url: output.url };
        }
        continue;
      }
      out[entry.targetPath] = entry.source === "upload"
        ? { source: "upload", file: entry.file }
        : { source: "library", url: entry.url };
    }
    return out;
  }, [selections]);

  const count = Object.keys(selections).length;

  return {
    selections,
    selectVariant,
    selectUpload,
    selectSetVariant,
    selectSetUpload,
    clearTarget,
    clearTargets,
    clearAll,
    importSelections,
    asPackSelections,
    count,
  };
}
