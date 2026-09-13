import { useRef, useState } from "react";
import { getSlotTargets } from "../lib/slotTargets.js";
import { exportSelectionsToFile, importSelectionsFromFile } from "../lib/selectionsExport.js";

export default function SelectionSummary({ categories, selections, onClear, onClearAll, onImport }) {
  const fileInputRef = useRef(null);
  const [importError, setImportError] = useState(null);

  const targetInfoByKey = {};
  for (const category of categories) {
    for (const slot of category.slots) {
      for (const target of getSlotTargets(slot)) {
        targetInfoByKey[target.key] = { label: target.label, categoryLabel: category.label };
      }
    }
  }

  const entries = Object.entries(selections);

  async function handleImportFile(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    try {
      const restored = await importSelectionsFromFile(file);
      onImport(restored);
      setImportError(null);
    } catch (err) {
      console.error(err);
      setImportError("Fichier invalide — vérifie que c'est bien un export généré par ce site.");
    }
  }

  return (
    <aside className={"summary" + (entries.length === 0 ? " summary--empty" : "")}>
      <div className="summary__header">
        <h3 className="summary__title">Sélection{entries.length > 0 ? ` (${entries.length})` : ""}</h3>
        {entries.length > 0 && (
          <button
            className="summary__clear-all"
            onClick={() => {
              if (window.confirm("Tout réinitialiser ? Cette action retire toutes les textures choisies.")) {
                onClearAll();
              }
            }}
          >
            Tout réinitialiser
          </button>
        )}
      </div>

      {entries.length === 0 ? (
        <p className="summary__empty-text">Rien de choisi pour l'instant.</p>
      ) : (
        <ul className="summary__list">
          {entries.map(([targetKey, selection]) => {
            const info = targetInfoByKey[targetKey];
            return (
              <li key={targetKey} className="summary__item">
                <div className="summary__item-text">
                  <span className="summary__item-slot">{info?.label || targetKey}</span>
                  <span className="summary__item-category">{info?.categoryLabel}</span>
                  <span className="summary__item-source">
                    {selection.source === "upload" ? `Envoyé : ${selection.label}` : selection.label}
                  </span>
                </div>
                <button
                  className="summary__remove"
                  onClick={() => onClear(targetKey)}
                  title="Retirer cette sélection"
                >
                  ×
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <div className="summary__io">
        <button
          className="summary__io-button"
          onClick={() => exportSelectionsToFile(selections)}
          disabled={entries.length === 0}
        >
          Exporter en fichier
        </button>
        <button className="summary__io-button" onClick={() => fileInputRef.current?.click()}>
          Importer un fichier
        </button>
        <input ref={fileInputRef} type="file" accept="application/json" onChange={handleImportFile} hidden />
      </div>

      {importError && <p className="summary__io-error">{importError}</p>}
    </aside>
  );
}
