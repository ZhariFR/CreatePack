import { useEffect, useRef } from "react";
import * as THREE from "three";

// Résout une sélection (texture de bibliothèque OU upload) vers une URL
// utilisable pour charger l'image. Pour un upload, crée une URL objet
// temporaire — révoquée par l'appelant après usage.
function resolveTextureSrc(selection) {
  if (!selection) return null;
  if (selection.source === "upload" && selection.file) {
    return { url: URL.createObjectURL(selection.file), isObjectUrl: true };
  }
  if (selection.source === "library" && selection.url) {
    return { url: selection.url, isObjectUrl: false };
  }
  return null;
}

function loadTexture(loader, src) {
  return new Promise((resolve) => {
    if (!src) return resolve(null);
    loader.load(
      src.url,
      (tex) => {
        tex.magFilter = THREE.NearestFilter; // garde l'aspect pixel-art, pas de flou
        tex.minFilter = THREE.NearestFilter;
        tex.colorSpace = THREE.SRGBColorSpace;
        resolve(tex);
      },
      undefined,
      () => resolve(null) // échec de chargement -> pas bloquant, juste pas de texture
    );
  });
}

// Lit les pixels bruts d'une image (via un canvas caché) pour pouvoir la
// "voxeliser" ensuite : un petit cube par pixel opaque, RIEN pour les
// pixels transparents (contrairement à une simple plaque texturée, qui
// affichait un carré gris à la place des zones transparentes).
function readImagePixels(src) {
  return new Promise((resolve) => {
    if (!src) return resolve(null);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img, 0, 0);
      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        resolve({ imageData, width: canvas.width, height: canvas.height });
      } catch {
        resolve(null); // lecture impossible (rare) -> pas bloquant
      }
    };
    img.onerror = () => resolve(null);
    img.src = src.url;
  });
}

// Les 6 faces d'un cube unité (centré à l'origine, taille 1), chacune en 2
// triangles (6 sommets), avec sa normale. side: DoubleSide est utilisé au
// rendu par sécurité (au cas où l'ordre des sommets d'une face serait
// inversé, ça évite une face invisible plutôt qu'un vrai bug visuel).
const CUBE_FACES = [
  { normal: [1, 0, 0], corners: [[0.5, -0.5, -0.5], [0.5, 0.5, -0.5], [0.5, 0.5, 0.5], [0.5, -0.5, 0.5]] },
  { normal: [-1, 0, 0], corners: [[-0.5, -0.5, 0.5], [-0.5, 0.5, 0.5], [-0.5, 0.5, -0.5], [-0.5, -0.5, -0.5]] },
  { normal: [0, 1, 0], corners: [[-0.5, 0.5, -0.5], [-0.5, 0.5, 0.5], [0.5, 0.5, 0.5], [0.5, 0.5, -0.5]] },
  { normal: [0, -1, 0], corners: [[-0.5, -0.5, 0.5], [-0.5, -0.5, -0.5], [0.5, -0.5, -0.5], [0.5, -0.5, 0.5]] },
  { normal: [0, 0, 1], corners: [[-0.5, -0.5, 0.5], [0.5, -0.5, 0.5], [0.5, 0.5, 0.5], [-0.5, 0.5, 0.5]] },
  { normal: [0, 0, -1], corners: [[0.5, -0.5, -0.5], [-0.5, -0.5, -0.5], [-0.5, 0.5, -0.5], [0.5, 0.5, -0.5]] },
];

function addCube(positions, normals, colors, cx, cy, cz, size, color) {
  for (const face of CUBE_FACES) {
    const [a, b, c, d] = face.corners;
    for (const corner of [a, b, c, a, c, d]) {
      positions.push(cx + corner[0] * size, cy + corner[1] * size, cz + corner[2] * size);
      normals.push(face.normal[0], face.normal[1], face.normal[2]);
      colors.push(color.r, color.g, color.b);
    }
  }
}

// Construit la géométrie voxelisée : un cube par pixel dont l'opacité
// dépasse le seuil, rien pour les autres. Couleurs converties en espace
// linéaire (attendu par le pipeline de rendu de three.js).
function buildVoxelGeometry({ imageData, width, height }) {
  const positions = [];
  const normals = [];
  const colors = [];
  const pixelSize = 1 / Math.max(width, height);
  const ALPHA_THRESHOLD = 40;

  for (let py = 0; py < height; py++) {
    for (let px = 0; px < width; px++) {
      const idx = (py * width + px) * 4;
      const a = imageData.data[idx + 3];
      if (a < ALPHA_THRESHOLD) continue;

      const color = new THREE.Color(
        imageData.data[idx] / 255,
        imageData.data[idx + 1] / 255,
        imageData.data[idx + 2] / 255
      ).convertSRGBToLinear();

      const x = (px - width / 2 + 0.5) * pixelSize;
      const y = (height / 2 - py - 0.5) * pixelSize;
      addCube(positions, normals, colors, x, y, 0, pixelSize, color);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  return geometry;
}

// Applique un mapping UV façon "boîte Minecraft" (patron déplié en croix)
// sur un BoxGeometry three.js, pour une région (u,v,w,h,d) d'une image
// imgW x imgH. mirror=true inverse horizontalement (bras/jambe gauche,
// qui réutilisent la même région que le côté droit en miroir).
function applyBoxUV(geometry, { u, v, w, h, d, imgW, imgH, mirror = false }) {
  const uvAttr = geometry.attributes.uv;

  function setFaceUV(face, x0, y0, x1, y1) {
    if (mirror) {
      const tmp = x0;
      x0 = x1;
      x1 = tmp;
    }
    const u0 = x0 / imgW, u1 = x1 / imgW;
    const v0 = 1 - y0 / imgH, v1 = 1 - y1 / imgH;
    const base = face * 4;
    uvAttr.setXY(base + 0, u0, v0);
    uvAttr.setXY(base + 1, u1, v0);
    uvAttr.setXY(base + 2, u0, v1);
    uvAttr.setXY(base + 3, u1, v1);
  }

  setFaceUV(0, u, v + d, u + d, v + d + h); // droite
  setFaceUV(1, u + d + w, v + d, u + d + w + d, v + d + h); // gauche
  setFaceUV(2, u + d, v, u + d + w, v + d); // haut
  setFaceUV(3, u + d + w, v, u + d + w + w, v + d); // bas
  setFaceUV(4, u + d, v + d, u + d + w, v + d + h); // avant
  setFaceUV(5, u + d + w + d, v + d, u + d + w + d + w, v + d + h); // arrière

  uvAttr.needsUpdate = true;
}

function buildLimb(scene, { pw, ph, pd, x, y, z, u, v, imgW, imgH, mirror = false }) {
  const geometry = new THREE.BoxGeometry(pw * SCALE, ph * SCALE, pd * SCALE);
  applyBoxUV(geometry, { u, v, w: pw, h: ph, d: pd, imgW, imgH, mirror });
  const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color: FALLBACK_COLOR }));
  mesh.position.set(x, y, z);
  scene.add(mesh);
  return mesh;
}

const FALLBACK_COLOR = 0x342c24;
const SCALE = 1 / 16; // dimensions données en "pixels" Minecraft, mis à l'échelle

/**
 * @param {"cube"|"flat"|"armor"} mode
 * @param {{top?, bottom?, front?, side?}} [faceSelections] - pour mode="cube"
 * @param {object} [flatSelection] - pour mode="flat"
 * @param {object} [layer1Selection] - pour mode="armor" (casque/plastron/bottes)
 * @param {object} [layer2Selection] - pour mode="armor" (jambières)
 */
export default function Preview3D({ mode, faceSelections, flatSelection, layer1Selection, layer2Selection }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationId;
    let disposed = false;
    const createdObjectUrls = [];

    const width = container.clientWidth || 200;
    const height = container.clientHeight || 200;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.replaceChildren(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xfff2df, 0x1a1613, 1.15));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.55);
    dirLight.position.set(3, 4, 2);
    scene.add(dirLight);

    const fallbackMat = () => new THREE.MeshStandardMaterial({ color: FALLBACK_COLOR });

    let rotatingGroup = new THREE.Group();
    scene.add(rotatingGroup);
    let placeholder = null;

    if (mode === "cube") {
      camera.position.set(2.3, 1.9, 2.5);
      camera.lookAt(0, 0, 0);
      const geometry = new THREE.BoxGeometry(1.4, 1.4, 1.4);
      const materials = [fallbackMat(), fallbackMat(), fallbackMat(), fallbackMat(), fallbackMat(), fallbackMat()];
      rotatingGroup.add(new THREE.Mesh(geometry, materials));
    } else if (mode === "armor") {
      camera.position.set(2.4, 1.1, 3.0);
      camera.lookAt(0, 0.05, 0);
      const head = buildLimb(rotatingGroup, { pw: 8, ph: 8, pd: 8, x: 0, y: 0.75, z: 0, u: 0, v: 0, imgW: 64, imgH: 32 });
      const body = buildLimb(rotatingGroup, { pw: 8, ph: 12, pd: 4, x: 0, y: 0.125, z: 0, u: 16, v: 16, imgW: 64, imgH: 32 });
      const armR = buildLimb(rotatingGroup, { pw: 4, ph: 12, pd: 4, x: -0.375, y: 0.125, z: 0, u: 40, v: 16, imgW: 64, imgH: 32 });
      const armL = buildLimb(rotatingGroup, { pw: 4, ph: 12, pd: 4, x: 0.375, y: 0.125, z: 0, u: 40, v: 16, imgW: 64, imgH: 32, mirror: true });
      const legR = buildLimb(rotatingGroup, { pw: 4, ph: 12, pd: 4, x: -0.125, y: -0.625, z: 0, u: 0, v: 16, imgW: 64, imgH: 32 });
      const legL = buildLimb(rotatingGroup, { pw: 4, ph: 12, pd: 4, x: 0.125, y: -0.625, z: 0, u: 0, v: 16, imgW: 64, imgH: 32, mirror: true });
      rotatingGroup.userData.armorParts = { head, body, armR, armL, legR, legL };
    } else {
      // "flat" : placeholder neutre en attendant la voxelisation (ou si pas
      // de sélection du tout). Remplacé par le vrai modèle une fois prêt.
      camera.position.set(1.1, 0.9, 1.3);
      camera.lookAt(0, 0, 0);
      placeholder = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.25, 0.25), fallbackMat());
      rotatingGroup.add(placeholder);
    }

    function animate() {
      if (disposed) return;
      rotatingGroup.rotation.y += 0.012;
      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    }
    animate();

    async function applyTextures() {
      const loader = new THREE.TextureLoader();

      if (mode === "cube") {
        const srcs = {
          top: resolveTextureSrc(faceSelections?.top),
          bottom: resolveTextureSrc(faceSelections?.bottom),
          front: resolveTextureSrc(faceSelections?.front),
          side: resolveTextureSrc(faceSelections?.side),
        };
        for (const s of Object.values(srcs)) if (s?.isObjectUrl) createdObjectUrls.push(s.url);

        const [top, bottom, front, side] = await Promise.all([
          loadTexture(loader, srcs.top),
          loadTexture(loader, srcs.bottom),
          loadTexture(loader, srcs.front),
          loadTexture(loader, srcs.side),
        ]);
        if (disposed) return;
        const withMap = (tex) => (tex ? new THREE.MeshStandardMaterial({ map: tex }) : fallbackMat());
        rotatingGroup.children[0].material = [withMap(side), withMap(side), withMap(top), withMap(bottom), withMap(front), withMap(side)];
      } else if (mode === "armor") {
        const src1 = resolveTextureSrc(layer1Selection);
        const src2 = resolveTextureSrc(layer2Selection);
        if (src1?.isObjectUrl) createdObjectUrls.push(src1.url);
        if (src2?.isObjectUrl) createdObjectUrls.push(src2.url);

        const [layer1Tex, layer2Tex] = await Promise.all([loadTexture(loader, src1), loadTexture(loader, src2)]);
        if (disposed) return;

        const mat1 = layer1Tex ? new THREE.MeshStandardMaterial({ map: layer1Tex }) : fallbackMat();
        const mat2 = layer2Tex ? new THREE.MeshStandardMaterial({ map: layer2Tex }) : fallbackMat();
        const { head, body, armR, armL, legR, legL } = rotatingGroup.userData.armorParts;
        head.material = mat1;
        body.material = mat1;
        armR.material = mat1;
        armL.material = mat1;
        legR.material = mat2;
        legL.material = mat2;
      } else {
        const src = resolveTextureSrc(flatSelection);
        if (src?.isObjectUrl) createdObjectUrls.push(src.url);
        const pixels = await readImagePixels(src);
        if (disposed) return;
        if (!pixels) return; // pas de sélection ou lecture impossible -> garde le placeholder

        const geometry = buildVoxelGeometry(pixels);
        const material = new THREE.MeshStandardMaterial({ vertexColors: true, side: THREE.DoubleSide });
        const voxelMesh = new THREE.Mesh(geometry, material);

        if (placeholder) {
          rotatingGroup.remove(placeholder);
          placeholder.geometry.dispose();
          placeholder.material.dispose();
          placeholder = null;
        }
        rotatingGroup.add(voxelMesh);
      }
    }

    applyTextures();

    return () => {
      disposed = true;
      cancelAnimationFrame(animationId);
      renderer.dispose();
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        const mats = Array.isArray(obj.material) ? obj.material : obj.material ? [obj.material] : [];
        for (const m of mats) {
          if (m.map) m.map.dispose();
          m.dispose();
        }
      });
      for (const url of createdObjectUrls) URL.revokeObjectURL(url);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    mode,
    faceSelections?.top,
    faceSelections?.bottom,
    faceSelections?.front,
    faceSelections?.side,
    flatSelection,
    layer1Selection,
    layer2Selection,
  ]);

  return <div ref={containerRef} className="preview3d" />;
}
