import { useEffect, useState } from "react";
import { buildPack, downloadPack } from "../lib/packBuilder.js";
import { loadPackInfo, savePackInfo } from "../lib/packInfoStorage.js";

const saved = loadPackInfo();

export default function GenerateBar({ selectionCount, packSelections }) {
  const [name, setName] = useState(saved?.name ?? "Mon pack de textures");
  const [description, setDescription] = useState(
    saved?.description ?? "Généré avec le configurateur"
  );
  const [iconFile, setIconFile] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | building | error
  const [missing, setMissing] = useState([]);
  const [toast, setToast] = useState(null);

  // Sauvegarde le nom/description à chaque changement, pour ne pas avoir à
  // les retaper après un rafraîchissement de page.
  useEffect(() => {
    savePackInfo({ name, description });
  }, [name, description]);

  // Fait disparaître la notification de confirmation après quelques secondes.
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  function handleIconChange(event) {
    const file = event.target.files?.[0];
    if (file) setIconFile(file);
    event.target.value = "";
  }

  async function handleGenerate() {
    setStatus("building");
    setMissing([]);
    try {
      const { blob, missing } = await buildPack(packSelections, { name, description, iconFile });
      const filename = slugify(name) + ".mcpack";
      downloadPack(blob, filename);
      setMissing(missing);
      setStatus("idle");
      setToast(`Téléchargé : ${filename}`);
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  return (
    <div className="generate-bar">
      <div className="generate-bar__fields">
        <label className="field">
          <span>Nom du pack</span>
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="field">
          <span>Description</span>
          <input value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <label className="field field--icon">
          <span>Icône du pack (optionnel)</span>
          <input type="file" accept="image/png" onChange={handleIconChange} />
          {iconFile && <span className="field__hint">{iconFile.name}</span>}
        </label>
      </div>

      <button
        className="generate-bar__button"
        onClick={handleGenerate}
        disabled={selectionCount === 0 || status === "building"}
      >
        {status === "building" ? (
          <>
            <span className="spinner" aria-hidden="true" />
            Génération…
          </>
        ) : (
          `Générer mon pack (${selectionCount} texture${selectionCount > 1 ? "s" : ""})`
        )}
      </button>

      {status === "error" && (
        <p className="generate-bar__error">
          Un problème est survenu pendant la génération. Réessaie, et si ça persiste,
          vérifie que les images de la bibliothèque existent bien dans /public/textures.
        </p>
      )}

      {missing.length > 0 && (
        <p className="generate-bar__error">
          Le pack a été généré, mais {missing.length} texture{missing.length > 1 ? "s" : ""} n'
          {missing.length > 1 ? "ont" : "a"} pas pu être incluse{missing.length > 1 ? "s" : ""}{" "}
          (fichier introuvable) : {missing.join(", ")}
        </p>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "pack";
}
