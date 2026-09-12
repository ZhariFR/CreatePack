import { useEffect, useState } from "react";
import { assetUrl } from "../lib/assetPath.js";

const ZONES = [
  { id: "head", label: "Tête", cx: 90, cy: 32, r: 18 },
  { id: "chest", label: "Torse", cx: 90, cy: 80, r: 24 },
  { id: "legs", label: "Jambes", cx: 90, cy: 134, r: 22 },
  { id: "feet", label: "Pieds", cx: 90, cy: 182, r: 16 },
];

export default function ArmorPreview({ slots, selections }) {
  const slotByZone = {};
  for (const slot of slots) {
    if (slot.previewZone) slotByZone[slot.previewZone] = slot;
  }

  return (
    <div className="armor-preview">
      <svg viewBox="0 0 180 210" className="armor-preview__figure" aria-hidden="true">
        <circle cx="90" cy="32" r="18" className="armor-preview__silhouette" />
        <rect x="64" y="54" width="52" height="58" rx="10" className="armor-preview__silhouette" />
        <rect x="68" y="114" width="44" height="52" rx="8" className="armor-preview__silhouette" />
        <rect x="70" y="168" width="40" height="22" rx="6" className="armor-preview__silhouette" />

        {ZONES.map((zone) => {
          const slot = slotByZone[zone.id];
          const isCustom = slot && Boolean(selections[slot.id]);
          return (
            <circle
              key={zone.id}
              cx={zone.cx}
              cy={zone.cy}
              r={zone.r}
              className={"armor-preview__zone" + (isCustom ? " armor-preview__zone--custom" : "")}
            />
          );
        })}
      </svg>

      <ul className="armor-preview__legend">
        {ZONES.filter((zone) => slotByZone[zone.id]).map((zone) => {
          const slot = slotByZone[zone.id];
          return (
            <ArmorLegendItem
              key={zone.id}
              zoneLabel={zone.label}
              slot={slot}
              selection={selections[slot.id]}
            />
          );
        })}
      </ul>
    </div>
  );
}

function ArmorLegendItem({ zoneLabel, slot, selection }) {
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (selection?.source === "upload" && selection.file) {
      const url = URL.createObjectURL(selection.file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreviewUrl(selection?.source === "library" ? assetUrl(selection.thumbnail) : null);
  }, [selection]);

  return (
    <li className="armor-preview__legend-item">
      <span className="armor-preview__legend-thumb">
        {previewUrl ? <img src={previewUrl} alt="" loading="lazy" /> : null}
      </span>
      <span className="armor-preview__legend-text">
        <strong>{zoneLabel}</strong>
        <span>{selection ? selection.label : `${slot.label} — Vanilla`}</span>
      </span>
    </li>
  );
}
