// Aplatit les 3 formats de slot (simple, multi-face, "set") vers une liste
// uniforme de cibles { key, targetPath, label, variants }.

export function isMultiFace(slot) {
  return Boolean(slot.faces && slot.faces.length > 0);
}

export function isSetSlot(slot) {
  return Boolean(slot.outputs && slot.outputs.length > 0);
}

export function getSlotTargets(slot) {
  if (isMultiFace(slot)) {
    return slot.faces.map((face) => ({
      key: `${slot.id}:${face.id}`,
      targetPath: face.targetPath,
      label: face.label,
      variants: face.variants || [],
    }));
  }

  if (isSetSlot(slot)) {
    // targetPath: null car un set n'en a pas qu'un seul
    return [
      {
        key: slot.id,
        targetPath: null,
        label: slot.label,
        variants: slot.variants || [],
      },
    ];
  }

  return [
    {
      key: slot.id,
      targetPath: slot.targetPath,
      label: slot.label,
      variants: slot.variants || [],
    },
  ];
}
