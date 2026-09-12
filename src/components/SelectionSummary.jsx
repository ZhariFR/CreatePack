import { getSlotTargets } from "../lib/slotTargets.js";

export default function SelectionSummary({ categories, selections, onClear, onClearAll }) {
  const targetInfoByKey = {};
  for (const category of categories) {
    for (const slot of category.slots) {
      for (const target of getSlotTargets(slot)) {
        targetInfoByKey[target.key] = { label: target.label, categoryLabel: category.label };
      }
    }
  }

  const entries = Object.entries(selections);

  if (entries.length === 0) {
    return (
      <aside className="summary summary--empty">
        <h3 className="summary__title">Sélection</h3>
        <p className="summary__empty-text">Rien de choisi pour l'instant.</p>
      </aside>
    );
  }

  return (
    <aside className="summary">
      <div className="summary__header">
        <h3 className="summary__title">Sélection ({entries.length})</h3>
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
      </div>
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
    </aside>
  );
}
