import { useState } from "react";
import SlotTile from "./SlotTile.jsx";
import TexturePickerModal from "./TexturePickerModal.jsx";
import ArmorPreview from "./ArmorPreview.jsx";

export default function SlotGrid({
  category,
  selections,
  onSelectVariant,
  onSelectUpload,
  onSelectSetVariant,
  onSelectSetUpload,
  onClearTarget,
  onClearTargets,
}) {
  const [openSlotId, setOpenSlotId] = useState(null);
  const [query, setQuery] = useState("");

  const normalizedQuery = query.trim().toLowerCase();
  const filteredSlots = normalizedQuery
    ? category.slots.filter((slot) => slot.label.toLowerCase().includes(normalizedQuery))
    : category.slots;

  const openSlot = category.slots.find((s) => s.id === openSlotId);
  const hasPreviewZones = category.slots.some((slot) => slot.previewZone);

  return (
    <>
      {hasPreviewZones && <ArmorPreview slots={category.slots} selections={selections} />}

      {category.slots.length > 8 && (
        <input
          className="slot-search"
          type="search"
          placeholder={`Rechercher dans ${category.label.toLowerCase()}...`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      )}

      {filteredSlots.length === 0 ? (
        <p className="slot__empty-hint">Aucun résultat pour "{query}".</p>
      ) : (
        <div className="slot-tile-grid">
          {filteredSlots.map((slot) => (
            <SlotTile
              key={slot.id}
              slot={slot}
              selections={selections}
              onOpen={() => setOpenSlotId(slot.id)}
              onClearTarget={onClearTarget}
              onClearTargets={onClearTargets}
              onUpload={onSelectUpload}
            />
          ))}
        </div>
      )}

      {openSlot && (
        <TexturePickerModal
          slot={openSlot}
          selections={selections}
          onClose={() => setOpenSlotId(null)}
          onSelectVariant={onSelectVariant}
          onSelectUpload={onSelectUpload}
          onSelectSetVariant={onSelectSetVariant}
          onSelectSetUpload={onSelectSetUpload}
        />
      )}
    </>
  );
}
