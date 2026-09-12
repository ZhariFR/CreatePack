import { getSlotTargets } from "../lib/slotTargets.js";

export default function CategoryTabs({ categories, activeId, onSelect, selections }) {
  return (
    <nav className="category-tabs">
      {categories.map((category) => {
        const targets = category.slots.flatMap((slot) => getSlotTargets(slot));
        const total = targets.length;
        const done = targets.filter((target) => selections[target.key]).length;

        return (
          <button
            key={category.id}
            className={
              "category-tab" + (category.id === activeId ? " category-tab--active" : "")
            }
            onClick={() => onSelect(category.id)}
          >
            <span>{category.label}</span>
            <span className="category-tab__badge">
              {done}/{total}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
