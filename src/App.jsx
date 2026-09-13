import { useState } from "react";
import { categories } from "./data/categories/index.js";
import { useSelections } from "./state/useSelections.js";
import CategoryTabs from "./components/CategoryTabs.jsx";
import SlotGrid from "./components/SlotGrid.jsx";
import SelectionSummary from "./components/SelectionSummary.jsx";
import GenerateBar from "./components/GenerateBar.jsx";
import "./App.css";

export default function App() {
  const [activeId, setActiveId] = useState(categories[0]?.id);
  const {
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
  } = useSelections();

  const activeCategory = categories.find((c) => c.id === activeId);

  return (
    <div className="app">
      <header className="app__header">
        <div className="app__brand">
          <svg className="app__brand-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3.5" y="3.5" width="7.5" height="7.5" rx="1.5" stroke="var(--accent-strong)" strokeWidth="1.6" />
            <rect x="13" y="3.5" width="7.5" height="7.5" rx="1.5" stroke="var(--text-dim)" strokeWidth="1.6" />
            <rect x="3.5" y="13" width="7.5" height="7.5" rx="1.5" stroke="var(--text-dim)" strokeWidth="1.6" />
            <rect x="13" y="13" width="7.5" height="7.5" rx="1.5" stroke="var(--accent-strong)" strokeWidth="1.6" />
          </svg>
          <div>
            <h1>Générateur de pack de textures</h1>
            <p className="app__subtitle">
              Choisis un visuel pour chaque emplacement, ou envoie ta propre texture.
            </p>
          </div>
        </div>
      </header>

      <div className="app__body">
        <CategoryTabs
          categories={categories}
          activeId={activeId}
          onSelect={setActiveId}
          selections={selections}
        />

        <main className="app__main">
          {activeCategory ? (
            <SlotGrid
              key={activeCategory.id}
              category={activeCategory}
              selections={selections}
              onSelectVariant={selectVariant}
              onSelectUpload={selectUpload}
              onSelectSetVariant={selectSetVariant}
              onSelectSetUpload={selectSetUpload}
              onClearTarget={clearTarget}
              onClearTargets={clearTargets}
            />
          ) : (
            <p>Aucune catégorie disponible.</p>
          )}
        </main>

        <SelectionSummary
          categories={categories}
          selections={selections}
          onClear={clearTarget}
          onClearAll={clearAll}
          onImport={importSelections}
        />
      </div>

      <footer className="app__footer">
        <GenerateBar selectionCount={count} packSelections={asPackSelections} />
      </footer>
    </div>
  );
}
