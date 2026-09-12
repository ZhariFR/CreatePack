import { useEffect, useState } from "react";
import { assetUrl } from "../lib/assetPath.js";
import { getSlotTargets, isMultiFace, isSetSlot } from "../lib/slotTargets.js";
import { vanillaReferenceUrl } from "../lib/vanillaReference.js";

export default function SlotTile({ slot, selections, onOpen, onClearTarget, onClearTargets, onUpload }) {
  const multiFace = isMultiFace(slot);
  const isSet = isSetSlot(slot);
  const targets = getSlotTargets(slot);
  const isCustomized = targets.some((t) => selections[t.key]);

  // Slot simple : glisser-déposer direct + aperçu plein cadre. Pas pour un
  // slot "set" (un set demande plusieurs fichiers assortis à la fois, pas
  // un seul glissé au hasard) ni un slot multi-face (quelle face viserait-on ?).
  const [isDragOver, setIsDragOver] = useState(false);
  const allowDirectUpload = !multiFace && !isSet;
  const singleTarget = !multiFace ? targets[0] : null;
  const singleSelection = singleTarget ? selections[singleTarget.key] : null;

  function handleDragOver(e) {
    if (!allowDirectUpload) return;
    e.preventDefault();
    setIsDragOver(true);
  }
  function handleDragLeave() {
    setIsDragOver(false);
  }
  function handleDrop(e) {
    if (!allowDirectUpload) return;
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      onUpload(singleTarget, file);
    }
  }

  function handleClear(e) {
    e.stopPropagation();
    if (multiFace) {
      onClearTargets(targets.map((t) => t.key));
    } else {
      onClearTarget(singleTarget.key);
    }
  }

  return (
    <div className={"slot-tile" + (isCustomized ? " slot-tile--customized" : "")}>
      <button
        className={"slot-tile__open" + (isDragOver ? " slot-tile__open--dragover" : "")}
        onClick={onOpen}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        title={slot.label}
      >
        {multiFace ? (
          <span className="slot-tile__thumb slot-tile__thumb--mosaic">
            {targets.map((target) => (
              <FaceThumb key={target.key} selection={selections[target.key]} targetPath={target.targetPath} />
            ))}
          </span>
        ) : (
          <span className="slot-tile__thumb">
            {isDragOver ? (
              <span className="slot-tile__drop-hint">Dépose ici</span>
            ) : singleSelection ? (
              <FaceImage selection={singleSelection} alt={singleSelection.label} />
            ) : (
              <VanillaThumb targetPath={singleTarget?.targetPath} />
            )}
          </span>
        )}
        <span className="slot-tile__label">
          {slot.label}
          {multiFace && (
            <span className="slot-tile__face-count">
              {targets.filter((t) => selections[t.key]).length}/{targets.length} faces
            </span>
          )}
        </span>
      </button>

      {isCustomized && (
        <button
          className="slot-tile__clear"
          onClick={handleClear}
          title="Repasser en vanilla"
          aria-label="Repasser en vanilla"
        >
          ×
        </button>
      )}
    </div>
  );
}

function FaceThumb({ selection, targetPath }) {
  return (
    <span className="slot-tile__mini">
      {selection ? <FaceImage selection={selection} alt="" /> : <VanillaThumb targetPath={targetPath} compact />}
    </span>
  );
}

function FaceImage({ selection, alt }) {
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (selection?.source === "upload" && selection.file) {
      const url = URL.createObjectURL(selection.file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    if (selection?.isSet && selection.thumbnailFile) {
      const url = URL.createObjectURL(selection.thumbnailFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreviewUrl(
      selection?.source === "library" || (selection?.isSet && selection.thumbnail)
        ? assetUrl(selection.thumbnail)
        : null
    );
  }, [selection]);

  if (!previewUrl) return null;
  return <img src={previewUrl} alt={alt} loading="lazy" />;
}

// Affiche la vraie texture vanilla SI l'utilisateur en a déposé une dans
// public/vanilla-reference/ (voir vanillaReference.js) ; sinon, repli sur
// l'icône générique "Vanilla" habituelle. Le repli se fait automatiquement
// si le fichier n'existe pas (onError), donc aucune configuration requise
// pour que le reste du site continue de fonctionner sans ces fichiers.
function VanillaThumb({ targetPath, compact = false }) {
  const [failed, setFailed] = useState(false);
  const url = vanillaReferenceUrl(targetPath);

  useEffect(() => {
    setFailed(false);
  }, [url]);

  if (url && !failed) {
    return <img src={url} alt="Texture vanilla" loading="lazy" onError={() => setFailed(true)} />;
  }

  return (
    <span className="slot-tile__vanilla">
      <svg viewBox="0 0 24 24" width={compact ? 12 : 18} height={compact ? 12 : 18} fill="none">
        <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" />
      </svg>
      {!compact && "Vanilla"}
    </span>
  );
}
