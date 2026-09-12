import { useEffect, useRef, useState, Suspense, lazy } from "react";
import { assetUrl } from "../lib/assetPath.js";
import { getSlotTargets, isSetSlot } from "../lib/slotTargets.js";

// three.js est assez lourd : on ne le charge que quand une fenêtre de choix
// s'ouvre réellement, pas au chargement initial du site.
const Preview3D = lazy(() => import("./Preview3D.jsx"));

// Ids de face reconnus pour le mapping vers les 4 faces visibles du cube 3D
// (voir README.md de src/data/categories/ pour la convention à respecter).
const CUBE_FACE_IDS = ["top", "bottom", "front", "side"];

export default function TexturePickerModal({
  slot,
  selections,
  onClose,
  onSelectVariant,
  onSelectUpload,
  onSelectSetVariant,
  onSelectSetUpload,
}) {
  const isSet = isSetSlot(slot);
  const targets = getSlotTargets(slot);
  const multiFace = !isSet && targets.length > 1;
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    closeButtonRef.current?.focus();

    function handleKey(e) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !modalRef.current) return;

      const focusable = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Prépare les données pour l'aperçu 3D : cube (bloc multi-face), item
  // extrudé (slot simple), ou aperçu du set choisi (slot "set").
  let preview3D = null;
  if (multiFace) {
    const byId = {};
    for (const slotFace of slot.faces) byId[slotFace.id] = slotFace;
    const hasRecognizedFaces = CUBE_FACE_IDS.some((id) => byId[id]);
    if (hasRecognizedFaces) {
      const faceSelections = {};
      for (const faceId of CUBE_FACE_IDS) {
        const face = byId[faceId];
        faceSelections[faceId] = face ? selections[`${slot.id}:${face.id}`] : null;
      }
      preview3D = <Preview3D mode="cube" faceSelections={faceSelections} />;
    }
  } else if (isSet) {
    const hasArmorLayers =
      slot.outputs?.some((o) => o.key === "layer1") && slot.outputs?.some((o) => o.key === "layer2");
    const current = selections[slot.id];

    if (hasArmorLayers) {
      const layer1Output = current?.outputs?.[slot.outputs.findIndex((o) => o.key === "layer1")];
      const layer2Output = current?.outputs?.[slot.outputs.findIndex((o) => o.key === "layer2")];
      preview3D = <Preview3D mode="armor" layer1Selection={layer1Output || null} layer2Selection={layer2Output || null} />;
    } else {
      const flatSelection = current
        ? current.thumbnailFile
          ? { source: "upload", file: current.thumbnailFile }
          : { source: "library", url: assetUrl(current.thumbnail) }
        : null;
      preview3D = <Preview3D mode="flat" flatSelection={flatSelection} />;
    }
  } else {
    preview3D = <Preview3D mode="flat" flatSelection={selections[targets[0].key]} />;
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={slot.label}
      >
        <div className="modal__header">
          <h3>{slot.label}</h3>
          <button className="modal__close" onClick={onClose} aria-label="Fermer" ref={closeButtonRef}>
            ×
          </button>
        </div>

        <div className="modal__layout">
          <div className="modal__body">
            {isSet ? (
              <SetVariantGrid
                slot={slot}
                currentSelection={selections[slot.id]}
                onSelect={(variant) => onSelectSetVariant(slot, variant)}
                onUploadSet={(data) => onSelectSetUpload(slot, data)}
              />
            ) : (
              targets.map((target) => (
                <TargetSection
                  key={target.key}
                  target={target}
                  currentSelection={selections[target.key]}
                  showHeading={multiFace}
                  onSelectVariant={(variant) => onSelectVariant(target, variant)}
                  onSelectUpload={(file) => onSelectUpload(target, file)}
                />
              ))
            )}
          </div>

          {preview3D && (
            <div className="modal__preview">
              <span className="modal__preview-label">Aperçu 3D</span>
              <Suspense fallback={<div className="preview3d preview3d--loading" />}>
                {preview3D}
              </Suspense>
              <span className="modal__preview-hint">
                {multiFace
                  ? "Vue schématique du bloc, pas un rendu exact du jeu."
                  : isSet
                  ? "Silhouette approximative, pas un rendu exact du jeu."
                  : "Modèle voxelisé pixel par pixel — pas de fond, juste la forme."}
              </span>
            </div>
          )}
        </div>

        <div className="modal__footer">
          <button className="modal__done" onClick={onClose}>
            Terminé
          </button>
        </div>
      </div>
    </div>
  );
}

function SetVariantGrid({ slot, currentSelection, onSelect, onUploadSet }) {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const isCustomUpload = Boolean(currentSelection?.outputs?.some((o) => o.source === "upload"));

  return (
    <div className="modal__section">
      <p className="modal__set-note">
        Un seul choix pour tout l'ensemble (icônes + rendu porté) — pas de mélange de pièces possible.
      </p>
      <div className="modal__grid">
        {slot.variants.length === 0 && (
          <p className="slot__empty-hint">Pas encore de set disponible dans la bibliothèque pour cette armure.</p>
        )}

        {slot.variants.map((variant) => (
          <button
            key={variant.id}
            className={
              "texture-card" + (currentSelection?.variantId === variant.id ? " texture-card--selected" : "")
            }
            onClick={() => onSelect(variant)}
            title={variant.label}
          >
            <span className="texture-card__thumb">
              <img src={assetUrl(variant.thumbnail)} alt={variant.label} loading="lazy" />
            </span>
            <span className="texture-card__label">{variant.label}</span>
          </button>
        ))}
      </div>

      <button className="modal__upload-toggle" onClick={() => setShowUploadForm((v) => !v)}>
        {showUploadForm ? "▾" : "▸"} {isCustomUpload ? "Modifier mon set personnalisé" : "Envoyer mon propre set"}
        {isCustomUpload && <span className="modal__upload-toggle-badge">actif : {currentSelection.label}</span>}
      </button>

      {showUploadForm && (
        <SetUploadForm
          slot={slot}
          onSubmit={(data) => {
            onUploadSet(data);
            setShowUploadForm(false);
          }}
        />
      )}
    </div>
  );
}

function SetUploadForm({ slot, onSubmit }) {
  const [label, setLabel] = useState("Mon set personnalisé");
  const [files, setFiles] = useState({});

  const providedCount = slot.outputs.filter((o) => files[o.key]).length;
  const canSubmit = label.trim().length > 0 && providedCount > 0;

  function handleFileChange(key, event) {
    const file = event.target.files?.[0];
    if (file) setFiles((prev) => ({ ...prev, [key]: file }));
    event.target.value = "";
  }

  // Regroupe les outputs par "group" (icon/render...) pour que l'utilisateur
  // comprenne qu'il peut ne remplir qu'un des deux groupes, pas forcément
  // tout. Les outputs sans group tombent dans un groupe "autre" sans titre.
  const groups = new Map();
  for (const output of slot.outputs) {
    const key = output.group || "_";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(output);
  }
  const groupLabels = { icon: "Icônes (item en main / inventaire)", render: "Rendu porté (sur le personnage)" };

  return (
    <div className="set-upload-form">
      <p className="set-upload-form__note">
        Tu peux ne remplir qu'une partie (par ex. juste le rendu porté, sans toucher à l'icône) — ce
        que tu ne fournis pas reste vanilla dans le pack généré.
      </p>

      <label className="field">
        <span>Nom du set</span>
        <input value={label} onChange={(e) => setLabel(e.target.value)} />
      </label>

      {[...groups.entries()].map(([groupKey, outputs]) => (
        <div key={groupKey} className="set-upload-form__group">
          {groupKey !== "_" && (
            <h5 className="set-upload-form__group-title">{groupLabels[groupKey] || groupKey}</h5>
          )}
          <div className="set-upload-form__files">
            {outputs.map((output) => (
              <label key={output.key} className="set-upload-form__file-row">
                <span className="set-upload-form__file-label">
                  {output.label || output.key}
                  {files[output.key] && (
                    <span className="set-upload-form__file-name"> — {files[output.key].name}</span>
                  )}
                </span>
                <input type="file" accept="image/png" onChange={(e) => handleFileChange(output.key, e)} />
              </label>
            ))}
          </div>
        </div>
      ))}

      <button
        className="set-upload-form__submit"
        disabled={!canSubmit}
        onClick={() => onSubmit({ label: label.trim(), files })}
      >
        {providedCount === 0
          ? "Choisis au moins un fichier"
          : `Utiliser ce set (${providedCount}/${slot.outputs.length} fichiers)`}
      </button>
    </div>
  );
}

function TargetSection({ target, currentSelection, showHeading, onSelectVariant, onSelectUpload }) {
  function handleUploadChange(event) {
    const file = event.target.files?.[0];
    if (file) onSelectUpload(file);
    event.target.value = "";
  }

  return (
    <div className="modal__section">
      {showHeading && <h4 className="modal__section-title">{target.label}</h4>}
      <div className="modal__grid">
        {target.variants.length === 0 && (
          <p className="slot__empty-hint">
            Pas encore de visuel disponible pour cette texture — tu peux envoyer la tienne.
          </p>
        )}

        {target.variants.map((variant) => (
          <button
            key={variant.id}
            className={
              "texture-card" +
              (currentSelection?.source === "library" && currentSelection.url === assetUrl(variant.textureUrl)
                ? " texture-card--selected"
                : "")
            }
            onClick={() => onSelectVariant(variant)}
            title={variant.label}
          >
            <span className="texture-card__thumb">
              <img src={assetUrl(variant.thumbnail)} alt={variant.label} loading="lazy" />
            </span>
            <span className="texture-card__label">{variant.label}</span>
          </button>
        ))}

        <label
          className={
            "texture-card texture-card--upload" +
            (currentSelection?.source === "upload" ? " texture-card--selected" : "")
          }
        >
          <span className="texture-card__thumb texture-card__thumb--upload">+</span>
          <span className="texture-card__label">
            {currentSelection?.source === "upload" ? currentSelection.label : "Ta texture"}
          </span>
          <input type="file" accept="image/png" onChange={handleUploadChange} hidden />
        </label>
      </div>
    </div>
  );
}
