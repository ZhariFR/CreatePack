// Convertit une sélection (voir useSelections.js) vers une forme
// sérialisable en JSON, et inversement. Les fichiers uploadés (File) ne
// peuvent pas être stockés tels quels -> convertis en dataURL (base64) à la
// sérialisation, reconvertis en fichier à la désérialisation. Utilisé à la
// fois par la sauvegarde navigateur (selectionsStorage.js) et l'export/
// import en fichier (selectionsExport.js) — même logique, deux usages.

export async function serializeSelections(selections) {
  const serializable = {};

  for (const [slotId, entry] of Object.entries(selections)) {
    if (entry.isSet) {
      const outputs = [];
      for (const output of entry.outputs) {
        if (output.source === "upload" && output.file) {
          outputs.push({
            targetPath: output.targetPath,
            source: "upload",
            fileName: output.file.name,
            fileType: output.file.type,
            dataUrl: await fileToDataUrl(output.file),
          });
        } else {
          outputs.push(output);
        }
      }

      let thumbnailFileData = null;
      if (entry.thumbnailFile) {
        thumbnailFileData = {
          fileName: entry.thumbnailFile.name,
          fileType: entry.thumbnailFile.type,
          dataUrl: await fileToDataUrl(entry.thumbnailFile),
        };
      }

      serializable[slotId] = {
        isSet: true,
        label: entry.label,
        variantId: entry.variantId,
        thumbnail: entry.thumbnail,
        thumbnailFileData,
        outputs,
      };
      continue;
    }

    if (entry.source === "upload" && entry.file) {
      serializable[slotId] = {
        targetPath: entry.targetPath,
        source: "upload",
        label: entry.label,
        fileName: entry.file.name,
        fileType: entry.file.type,
        dataUrl: await fileToDataUrl(entry.file),
      };
    } else {
      serializable[slotId] = entry;
    }
  }

  return serializable;
}

export async function deserializeSelections(serialized) {
  const restored = {};

  for (const [slotId, entry] of Object.entries(serialized)) {
    if (entry.isSet) {
      const outputs = [];
      for (const output of entry.outputs) {
        if (output.source === "upload" && output.dataUrl) {
          const file = await dataUrlToFile(output.dataUrl, output.fileName, output.fileType);
          outputs.push({ targetPath: output.targetPath, source: "upload", file });
        } else {
          outputs.push(output);
        }
      }

      let thumbnailFile = null;
      if (entry.thumbnailFileData) {
        thumbnailFile = await dataUrlToFile(
          entry.thumbnailFileData.dataUrl,
          entry.thumbnailFileData.fileName,
          entry.thumbnailFileData.fileType
        );
      }

      restored[slotId] = {
        isSet: true,
        label: entry.label,
        variantId: entry.variantId,
        thumbnail: entry.thumbnail,
        thumbnailFile,
        outputs,
      };
      continue;
    }

    if (entry.source === "upload" && entry.dataUrl) {
      const file = await dataUrlToFile(entry.dataUrl, entry.fileName, entry.fileType);
      restored[slotId] = {
        targetPath: entry.targetPath,
        source: "upload",
        file,
        label: entry.label,
      };
    } else {
      restored[slotId] = entry;
    }
  }

  return restored;
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function dataUrlToFile(dataUrl, fileName, fileType) {
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  return new File([blob], fileName || "texture.png", { type: fileType || blob.type });
}
