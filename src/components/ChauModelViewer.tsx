"use client";

import {
  Component,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Bounds,
  Center,
  OrbitControls,
  useGLTF,
} from "@react-three/drei";
import * as THREE from "three";
import type { Group, Mesh, Material, Object3D } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

type ShadingMode =
  | "solid"
  | "clay"
  | "normal"
  | "matcap"
  | "wireframe"
  | "sketch"
  | "hologram";

type BackgroundMode = "studio" | "light" | "dark" | "transparent";
type LightingPreset = "studio" | "dramatic" | "soft";

type ChauModelViewerProps = {
  modelUrl?: string | null;
  modelScale?: number | string | null;
  className?: string;
  showFallbackScene?: boolean;
};

const SHADING_MODES: { id: ShadingMode; label: string; swatch: string }[] = [
  {
    id: "solid",
    label: "Standard",
    swatch:
      "radial-gradient(circle at 30% 28%, #fff6d4 0%, #d99248 40%, #6a2010 100%)",
  },
  {
    id: "clay",
    label: "Clay",
    swatch:
      "radial-gradient(circle at 35% 30%, #ffffff 0%, #c8c1b4 55%, #5f5a52 100%)",
  },
  {
    id: "normal",
    label: "Normal",
    swatch:
      "radial-gradient(circle at 35% 30%, #d6c1ff 0%, #8a64ff 35%, #4cd6e6 70%, #ff7ac0 100%)",
  },
  {
    id: "matcap",
    label: "Matcap",
    swatch:
      "radial-gradient(circle at 35% 28%, #fff2c4 0%, #f0a330 35%, #5e1e02 100%)",
  },
  {
    id: "wireframe",
    label: "Wireframe",
    swatch:
      "radial-gradient(circle at 35% 30%, #f0f0f0 0%, #aaaaaa 60%, #3a3a3a 100%)",
  },
  {
    id: "sketch",
    label: "Sketch",
    swatch:
      "repeating-linear-gradient(135deg, #efeae0 0 4px, #2a2018 4px 5px)",
  },
  {
    id: "hologram",
    label: "Hologram",
    swatch:
      "radial-gradient(circle at 35% 30%, #ffffff 0%, #6ce6ee 45%, #15323a 100%)",
  },
];

const BACKGROUND_MODES: { id: BackgroundMode; label: string; swatch: string }[] =
  [
    { id: "studio", label: "Studio", swatch: "#1d2024" },
    { id: "dark", label: "Ink", swatch: "#0e1414" },
    { id: "light", label: "Paper", swatch: "#f4ecd7" },
    { id: "transparent", label: "Off", swatch: "transparent" },
  ];

const LIGHTING_PRESETS: { id: LightingPreset; label: string }[] = [
  { id: "studio", label: "Studio" },
  { id: "dramatic", label: "Dramatic" },
  { id: "soft", label: "Soft" },
];

const SKETCH_LINE_NAME = "__chau_sketch_edges";

type ModelErrorBoundaryProps = {
  children: ReactNode;
  fallback: ReactNode;
  resetKey: string;
};

type ModelErrorBoundaryState = {
  hasError: boolean;
};

class ModelErrorBoundary extends Component<
  ModelErrorBoundaryProps,
  ModelErrorBoundaryState
> {
  state: ModelErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): ModelErrorBoundaryState {
    return { hasError: true };
  }

  componentDidUpdate(previousProps: ModelErrorBoundaryProps) {
    if (
      previousProps.resetKey !== this.props.resetKey &&
      this.state.hasError
    ) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Procedural matcap shader — warm orange/gold with rim highlight.
const matcapShader = {
  vertex: /* glsl */ `
    varying vec3 vViewNormal;
    void main() {
      vViewNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragment: /* glsl */ `
    varying vec3 vViewNormal;
    void main() {
      vec3 N = normalize(vViewNormal);
      vec2 muv = N.xy * 0.5 + 0.5;

      vec3 deep    = vec3(0.06, 0.025, 0.005);
      vec3 shadow  = vec3(0.32, 0.13, 0.04);
      vec3 mid     = vec3(0.94, 0.55, 0.16);
      vec3 hi      = vec3(1.00, 0.92, 0.74);

      vec3 col;
      if (muv.y < 0.32) {
        col = mix(deep, shadow, smoothstep(0.0, 0.32, muv.y));
      } else if (muv.y < 0.72) {
        col = mix(shadow, mid, smoothstep(0.32, 0.72, muv.y));
      } else {
        col = mix(mid, hi, smoothstep(0.72, 1.0, muv.y));
      }

      // Side rim from the camera-facing component
      float rim = pow(max(N.z, 0.0), 28.0);
      col += rim * vec3(1.0, 0.85, 0.55) * 0.45;

      // Subtle horizontal warmth gradient
      col *= 0.95 + 0.1 * smoothstep(0.0, 1.0, muv.x);

      gl_FragColor = vec4(col, 1.0);
    }
  `,
};

// Cross-hatching sketch shader: white paper with screen-space ink lines
// that thicken in shadowed areas.
const sketchShader = {
  vertex: /* glsl */ `
    varying vec3 vNormal;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragment: /* glsl */ `
    varying vec3 vNormal;
    void main() {
      vec3 N = normalize(vNormal);
      vec3 L = normalize(vec3(0.55, 0.85, 0.4));
      float diffuse = clamp(dot(N, L) * 0.6 + 0.4, 0.0, 1.0);

      vec2 sc = gl_FragCoord.xy;
      float h1 = step(0.5, mod((sc.x + sc.y) * 0.10, 1.0));
      float h2 = step(0.5, mod((sc.x - sc.y) * 0.10, 1.0));
      float h3 = step(0.5, mod(sc.y * 0.13, 1.0));

      vec3 paper = vec3(0.94, 0.92, 0.86);
      vec3 ink   = vec3(0.08, 0.06, 0.05);

      float t = 1.0;
      if (diffuse < 0.78) t = min(t, mix(0.55, 1.0, h1));
      if (diffuse < 0.55) t = min(t, mix(0.35, 1.0, h2));
      if (diffuse < 0.30) t = min(t, mix(0.18, 1.0, h3));

      // Add a soft side shadow at near-grazing normals
      float sideShadow = pow(1.0 - max(N.z, 0.0), 3.0);
      t = mix(t, t * 0.6, sideShadow * 0.4);

      vec3 col = mix(ink, paper, t);
      gl_FragColor = vec4(col, 1.0);
    }
  `,
};

// Fresnel-based cyan hologram: translucent body with bright silhouette edge.
const hologramShader = {
  vertex: /* glsl */ `
    varying vec3 vNormalW;
    varying vec3 vViewDirW;
    void main() {
      vec4 wp = modelMatrix * vec4(position, 1.0);
      vNormalW = normalize(mat3(modelMatrix) * normal);
      vViewDirW = normalize(cameraPosition - wp.xyz);
      gl_Position = projectionMatrix * viewMatrix * wp;
    }
  `,
  fragment: /* glsl */ `
    varying vec3 vNormalW;
    varying vec3 vViewDirW;
    void main() {
      vec3 N = normalize(vNormalW);
      vec3 V = normalize(vViewDirW);
      float ndv = max(dot(N, V), 0.0);
      float fresnel = pow(1.0 - ndv, 2.6);

      vec3 core = vec3(0.55, 0.95, 0.95);
      vec3 rimC = vec3(0.85, 1.00, 1.00);
      vec3 col  = mix(core * 0.35, rimC, fresnel);

      float alpha = 0.22 + fresnel * 0.78;
      gl_FragColor = vec4(col * 1.3, alpha);
    }
  `,
};

function makeMatcapMaterial() {
  return new THREE.ShaderMaterial({
    vertexShader: matcapShader.vertex,
    fragmentShader: matcapShader.fragment,
    side: THREE.DoubleSide,
  });
}

function makeSketchMaterial() {
  return new THREE.ShaderMaterial({
    vertexShader: sketchShader.vertex,
    fragmentShader: sketchShader.fragment,
    side: THREE.DoubleSide,
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1,
  });
}

function makeHologramMaterial() {
  return new THREE.ShaderMaterial({
    vertexShader: hologramShader.vertex,
    fragmentShader: hologramShader.fragment,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
  });
}

function buildMaterial(mode: ShadingMode, original: Material): Material {
  const originalAsStandard = original as THREE.MeshStandardMaterial;
  const originalMap = originalAsStandard.map ?? null;
  const originalColor =
    "color" in originalAsStandard && originalAsStandard.color
      ? originalAsStandard.color.clone()
      : new THREE.Color("#d8c9a8");

  switch (mode) {
    case "solid":
      return original;

    case "clay":
      return new THREE.MeshStandardMaterial({
        color: new THREE.Color("#cdc2af"),
        roughness: 0.78,
        metalness: 0.02,
      });

    case "wireframe":
      return new THREE.MeshBasicMaterial({
        color: new THREE.Color("#1a1d22"),
        wireframe: true,
      });

    case "normal":
      return new THREE.MeshNormalMaterial({ side: THREE.DoubleSide });

    case "matcap":
      return makeMatcapMaterial();

    case "sketch":
      return makeSketchMaterial();

    case "hologram":
      return makeHologramMaterial();

    default:
      void originalColor;
      void originalMap;
      return original;
  }
}

function clearSketchLines(root: Object3D) {
  const toRemove: Object3D[] = [];
  root.traverse((child) => {
    if (child.name === SKETCH_LINE_NAME) {
      toRemove.push(child);
    }
  });
  toRemove.forEach((line) => {
    line.parent?.remove(line);
    const ls = line as THREE.LineSegments;
    ls.geometry?.dispose?.();
    const mat = ls.material;
    if (Array.isArray(mat)) {
      mat.forEach((m) => m.dispose?.());
    } else {
      (mat as Material | undefined)?.dispose?.();
    }
  });
}

function addSketchEdges(root: Object3D) {
  root.traverse((child) => {
    const mesh = child as Mesh;
    if (!mesh.isMesh) return;
    if (!mesh.geometry) return;
    if (mesh.name === SKETCH_LINE_NAME) return;

    const edges = new THREE.EdgesGeometry(mesh.geometry, 24);
    const lineMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color("#0d0a08"),
      transparent: true,
      opacity: 0.92,
    });
    const lines = new THREE.LineSegments(edges, lineMaterial);
    lines.name = SKETCH_LINE_NAME;
    lines.renderOrder = 2;
    mesh.add(lines);
  });
}

function addWireframeEdges(root: Object3D) {
  root.traverse((child) => {
    const mesh = child as Mesh;
    if (!mesh.isMesh) return;
    if (!mesh.geometry) return;
    if (mesh.name === SKETCH_LINE_NAME) return;

    const edges = new THREE.EdgesGeometry(mesh.geometry, 18);
    const lineMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color("#3a3a3a"),
      transparent: true,
      opacity: 0.75,
    });
    const lines = new THREE.LineSegments(edges, lineMaterial);
    lines.name = SKETCH_LINE_NAME;
    lines.renderOrder = 2;
    mesh.add(lines);
  });
}

function applyShadingMode(
  root: Object3D,
  mode: ShadingMode,
  originals: Map<string, Material | Material[]>,
  customMaterials: Map<string, Material>,
) {
  clearSketchLines(root);

  root.traverse((child) => {
    const mesh = child as Mesh;
    if (!mesh.isMesh) return;
    if (mesh.name === SKETCH_LINE_NAME) return;

    if (!originals.has(mesh.uuid)) {
      originals.set(mesh.uuid, mesh.material);
    }

    const original = originals.get(mesh.uuid);
    if (!original) return;

    const previousCustom = customMaterials.get(mesh.uuid);
    if (previousCustom) {
      previousCustom.dispose();
      customMaterials.delete(mesh.uuid);
    }

    if (mode === "solid") {
      mesh.material = original;
      return;
    }

    const sample = Array.isArray(original) ? original[0] : original;
    if (!sample) return;

    const m = buildMaterial(mode, sample);
    mesh.material = m;
    customMaterials.set(mesh.uuid, m);
  });

  if (mode === "sketch") {
    addSketchEdges(root);
  } else if (mode === "wireframe") {
    // Cleaner read: use real EdgesGeometry overlay so silhouettes pop
    // rather than the messy triangle-soup that material.wireframe gives.
    clearSketchLines(root);
    root.traverse((child) => {
      const mesh = child as Mesh;
      if (!mesh.isMesh) return;
      // For wireframe, hide the mesh and rely on the edge lines
      const mat = mesh.material as Material;
      if ("wireframe" in mat) {
        (mat as THREE.MeshBasicMaterial).wireframe = false;
      }
    });
    addWireframeEdges(root);
  }
}

type LoadedModelProps = {
  url: string;
  scale: number;
  shadingMode: ShadingMode;
};

function LoadedModel({ url, scale, shadingMode }: LoadedModelProps) {
  const { scene } = useGLTF(url);
  const cloned = useMemo(() => scene.clone(true), [scene]);
  const originals = useRef<Map<string, Material | Material[]>>(new Map());
  const customMaterials = useRef<Map<string, Material>>(new Map());

  useEffect(() => {
    applyShadingMode(
      cloned,
      shadingMode,
      originals.current,
      customMaterials.current,
    );
  }, [cloned, shadingMode]);

  useEffect(() => {
    const customs = customMaterials.current;
    return () => {
      customs.forEach((mat) => mat.dispose());
      customs.clear();
      clearSketchLines(cloned);
    };
  }, [cloned]);

  return <primitive object={cloned} scale={scale} />;
}

type AutoRotatingModelProps = {
  children: ReactNode;
  autoRotate: boolean;
  autoRotateSpeed: number;
  scale?: number;
};

function AutoRotatingModel({
  children,
  autoRotate,
  autoRotateSpeed,
  scale = 1,
}: AutoRotatingModelProps) {
  const groupRef = useRef<Group>(null);
  const tiltRadians = useMemo(() => (23.5 * Math.PI) / 180, []);

  useFrame((_, delta) => {
    if (!autoRotate || !groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.55 * autoRotateSpeed;
  });

  return (
    <group ref={groupRef} rotation={[tiltRadians, 0, 0]} scale={scale}>
      {children}
    </group>
  );
}

function FallbackScene({
  autoRotate,
  autoRotateSpeed,
  scale,
  shadingMode,
}: {
  autoRotate: boolean;
  autoRotateSpeed: number;
  scale: number;
  shadingMode: ShadingMode;
}) {
  const baseColor =
    shadingMode === "hologram"
      ? "#7cf2ff"
      : shadingMode === "sketch"
        ? "#efeae0"
        : shadingMode === "matcap"
          ? "#d97c1e"
          : "#8b4513";
  const accentColor =
    shadingMode === "hologram"
      ? "#7cf2ff"
      : shadingMode === "sketch"
        ? "#e8dcb8"
        : shadingMode === "matcap"
          ? "#f0a330"
          : "#d97706";
  const isWire = shadingMode === "wireframe";

  return (
    <AutoRotatingModel
      autoRotate={autoRotate}
      autoRotateSpeed={autoRotateSpeed}
      scale={scale}
    >
      <mesh position={[0, -0.08, 0]} rotation={[0.24, 0.42, 0]}>
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshStandardMaterial
          color={baseColor}
          emissive="#442211"
          emissiveIntensity={shadingMode === "hologram" ? 0 : 0.3}
          metalness={0.3}
          roughness={0.6}
          wireframe={isWire}
        />
      </mesh>
      <mesh position={[0, 1.35, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color={accentColor}
          emissive="#ff8800"
          emissiveIntensity={shadingMode === "hologram" ? 0 : 0.5}
          metalness={0.2}
          roughness={0.4}
          wireframe={isWire}
        />
      </mesh>
    </AutoRotatingModel>
  );
}

function ViewerStatus({ children }: { children: ReactNode }) {
  return (
    <div className="absolute inset-0 grid place-items-center bg-[#1a1d22] text-sm font-medium text-[#cfc4ac]">
      {children}
    </div>
  );
}

function normalizeModelUrl(modelUrl: ChauModelViewerProps["modelUrl"]) {
  const url = typeof modelUrl === "string" ? modelUrl.trim() : "";
  return url.length > 0 ? url : null;
}

function normalizeModelScale(modelScale: ChauModelViewerProps["modelScale"]) {
  const scale =
    typeof modelScale === "string" ? Number.parseFloat(modelScale) : modelScale;
  if (typeof scale !== "number" || !Number.isFinite(scale) || scale <= 0) {
    return 1;
  }
  return scale;
}

function LightingRig({ preset }: { preset: LightingPreset }) {
  if (preset === "dramatic") {
    return (
      <>
        <ambientLight intensity={0.18} />
        <directionalLight color="#fff1c2" intensity={2.9} position={[5, 6, 4]} />
        <pointLight color="#ff6a3d" intensity={1.5} position={[-3, 1, -2]} />
      </>
    );
  }

  if (preset === "soft") {
    return (
      <>
        <ambientLight intensity={1.2} />
        <directionalLight color="#ffffff" intensity={0.95} position={[3, 4, 3]} />
        <directionalLight color="#ffe4b5" intensity={0.5} position={[-4, 2, -3]} />
      </>
    );
  }

  // studio
  return (
    <>
      <ambientLight intensity={0.75} />
      <directionalLight intensity={1.85} position={[4, 5, 6]} />
      <directionalLight color="#a8d8ff" intensity={0.45} position={[-5, 2, -3]} />
    </>
  );
}

type ZoomCommand = { direction: "in" | "out"; nonce: number };

function ControlsBridge({
  controlsRef,
  zoomCommand,
  resetNonce,
}: {
  controlsRef: React.MutableRefObject<OrbitControlsImpl | null>;
  zoomCommand: ZoomCommand | null;
  resetNonce: number;
}) {
  const lastZoom = useRef(0);
  const lastReset = useRef(0);
  const stateSaved = useRef(false);

  useFrame(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    if (!stateSaved.current && typeof controls.saveState === "function") {
      controls.saveState();
      stateSaved.current = true;
    }

    if (zoomCommand && zoomCommand.nonce !== lastZoom.current) {
      lastZoom.current = zoomCommand.nonce;
      const camera = controls.object;
      const offset = new THREE.Vector3()
        .copy(camera.position)
        .sub(controls.target);
      const factor = zoomCommand.direction === "in" ? 0.82 : 1.22;
      offset.multiplyScalar(factor);
      const minDistance = controls.minDistance ?? 0.5;
      const maxDistance = controls.maxDistance ?? 100;
      const distance = offset.length();
      if (distance < minDistance) {
        offset.setLength(minDistance);
      } else if (distance > maxDistance) {
        offset.setLength(maxDistance);
      }
      camera.position.copy(controls.target).add(offset);
      controls.update();
    }

    if (resetNonce !== lastReset.current) {
      lastReset.current = resetNonce;
      if (typeof controls.reset === "function") {
        controls.reset();
      }
    }
  });

  return null;
}

function backgroundCss(mode: BackgroundMode) {
  if (mode === "studio")
    return "radial-gradient(ellipse at 50% 30%, #2a2f36 0%, #16191d 70%, #0c0e10 100%)";
  if (mode === "light") return "#f4ecd7";
  if (mode === "dark") return "#0e1414";
  return "transparent";
}

type ViewerToolbarProps = {
  shadingMode: ShadingMode;
  setShadingMode: (mode: ShadingMode) => void;
  background: BackgroundMode;
  setBackground: (mode: BackgroundMode) => void;
  lighting: LightingPreset;
  setLighting: (preset: LightingPreset) => void;
  autoRotate: boolean;
  setAutoRotate: (value: boolean) => void;
  autoRotateSpeed: number;
  setAutoRotateSpeed: (value: number) => void;
  panEnabled: boolean;
  setPanEnabled: (value: boolean) => void;
  onResetCamera: () => void;
  onToggleFullscreen: () => void;
  onZoom: (direction: "in" | "out") => void;
  isFullscreen: boolean;
  isOnDarkBg: boolean;
};

function ViewerToolbar({
  shadingMode,
  setShadingMode,
  background,
  setBackground,
  lighting,
  setLighting,
  autoRotate,
  setAutoRotate,
  autoRotateSpeed,
  setAutoRotateSpeed,
  panEnabled,
  setPanEnabled,
  onResetCamera,
  onToggleFullscreen,
  onZoom,
  isFullscreen,
  isOnDarkBg,
}: ViewerToolbarProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!settingsOpen) return;
    function onDocPointerDown(event: PointerEvent) {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(event.target as Node)
      ) {
        setSettingsOpen(false);
      }
    }
    document.addEventListener("pointerdown", onDocPointerDown);
    return () => {
      document.removeEventListener("pointerdown", onDocPointerDown);
    };
  }, [settingsOpen]);

  const onDark = isOnDarkBg;
  const pillBg = onDark
    ? "bg-[#1c1f24]/90 border-white/10 text-[#efe7d0]"
    : "bg-white/90 border-black/10 text-[#2a1609]";
  const pillBgFloat = onDark
    ? "bg-[#1c1f24]/85 border-white/10 text-[#efe7d0]"
    : "bg-white/90 border-black/10 text-[#2a1609]";

  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      <div
        className={`pointer-events-auto absolute right-3 top-3 flex items-center gap-0.5 rounded-full border ${pillBgFloat} px-1 py-1 shadow-lg backdrop-blur-md`}
      >
        <IconButton
          ariaLabel="Zoom out"
          onClick={() => onZoom("out")}
          onDark={onDark}
        >
          <MinusIcon />
        </IconButton>
        <IconButton
          ariaLabel="Zoom in"
          onClick={() => onZoom("in")}
          onDark={onDark}
        >
          <PlusIcon />
        </IconButton>
        <Divider onDark={onDark} />
        <IconButton
          ariaLabel="Reset camera"
          onClick={onResetCamera}
          onDark={onDark}
        >
          <TargetIcon />
        </IconButton>
        <IconButton
          ariaLabel={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          onClick={onToggleFullscreen}
          onDark={onDark}
        >
          {isFullscreen ? <ShrinkIcon /> : <ExpandIcon />}
        </IconButton>
      </div>

      <div
        className="pointer-events-auto absolute bottom-3 left-1/2 -translate-x-1/2"
        ref={settingsRef}
      >
        <div
          className={`flex items-center gap-1 rounded-full border ${pillBg} px-1.5 py-1.5 shadow-xl backdrop-blur-md`}
        >
          <button
            aria-label="Viewer settings"
            aria-expanded={settingsOpen}
            className={`grid h-8 w-8 place-items-center rounded-full transition ${
              settingsOpen
                ? onDark
                  ? "bg-white/15"
                  : "bg-black/10"
                : onDark
                  ? "hover:bg-white/10"
                  : "hover:bg-black/8"
            }`}
            onClick={() => setSettingsOpen((v) => !v)}
            type="button"
          >
            <span className="h-4 w-4">
              <SlidersIcon />
            </span>
          </button>

          <span
            aria-hidden="true"
            className={`mx-0.5 h-5 w-px ${onDark ? "bg-white/15" : "bg-black/15"}`}
          />

          {SHADING_MODES.map((mode) => {
            const active = mode.id === shadingMode;
            return (
              <button
                aria-label={mode.label}
                aria-pressed={active}
                className="group relative grid h-8 w-8 place-items-center rounded-full transition"
                key={mode.id}
                onClick={() => setShadingMode(mode.id)}
                title={mode.label}
                type="button"
              >
                <span
                  aria-hidden="true"
                  className={`block h-6 w-6 rounded-full ring-1 transition ${
                    active
                      ? onDark
                        ? "ring-2 ring-[#7cf2ff] ring-offset-2 ring-offset-[#1c1f24]"
                        : "ring-2 ring-[#9b2f22] ring-offset-2 ring-offset-white"
                      : onDark
                        ? "ring-white/15 group-hover:ring-white/40"
                        : "ring-black/10 group-hover:ring-black/30"
                  }`}
                  style={{ background: mode.swatch }}
                />
              </button>
            );
          })}
        </div>

        {settingsOpen ? (
          <div
            className={`mt-2 w-[280px] rounded-2xl border ${pillBg} p-3 shadow-2xl backdrop-blur-md`}
            role="dialog"
          >
            <SettingsSection label="Auto-rotate" onDark={onDark}>
              <div className="flex items-center gap-2">
                <button
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                    autoRotate
                      ? "bg-[#9b2f22] text-[#fff8df]"
                      : onDark
                        ? "bg-white/10 text-[#efe7d0] hover:bg-white/20"
                        : "bg-black/5 text-[#2a1609] hover:bg-black/10"
                  }`}
                  onClick={() => setAutoRotate(!autoRotate)}
                  type="button"
                >
                  {autoRotate ? "Pause" : "Play"}
                </button>
                <input
                  aria-label="Auto-rotate speed"
                  className="h-1.5 flex-1 cursor-pointer accent-[#9b2f22]"
                  max={3}
                  min={0.1}
                  onChange={(e) =>
                    setAutoRotateSpeed(Number.parseFloat(e.target.value))
                  }
                  step={0.1}
                  type="range"
                  value={autoRotateSpeed}
                />
                <span
                  className={`w-10 text-right tabular-nums text-[11px] ${onDark ? "text-[#efe7d0]/70" : "text-[#2a1609]/65"}`}
                >
                  {autoRotateSpeed.toFixed(1)}x
                </span>
              </div>
            </SettingsSection>

            <SettingsSection label="Lighting" onDark={onDark}>
              <div className="flex gap-1.5">
                {LIGHTING_PRESETS.map((preset) => {
                  const active = preset.id === lighting;
                  return (
                    <button
                      aria-pressed={active}
                      className={`flex-1 rounded-full px-2 py-1 text-xs font-semibold transition ${
                        active
                          ? "bg-[#9b2f22] text-[#fff8df]"
                          : onDark
                            ? "bg-white/10 text-[#efe7d0] hover:bg-white/20"
                            : "bg-black/5 text-[#2a1609] hover:bg-black/10"
                      }`}
                      key={preset.id}
                      onClick={() => setLighting(preset.id)}
                      type="button"
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
            </SettingsSection>

            <SettingsSection label="Background" onDark={onDark}>
              <div className="flex gap-1.5">
                {BACKGROUND_MODES.map((bg) => {
                  const active = bg.id === background;
                  return (
                    <button
                      aria-label={bg.label}
                      aria-pressed={active}
                      className={`flex flex-1 items-center justify-center gap-1.5 rounded-full px-2 py-1 text-xs font-semibold transition ${
                        active
                          ? "bg-[#9b2f22] text-[#fff8df]"
                          : onDark
                            ? "bg-white/10 text-[#efe7d0] hover:bg-white/20"
                            : "bg-black/5 text-[#2a1609] hover:bg-black/10"
                      }`}
                      key={bg.id}
                      onClick={() => setBackground(bg.id)}
                      type="button"
                    >
                      <span
                        aria-hidden="true"
                        className="h-3 w-3 rounded-full border border-black/30"
                        style={{
                          background:
                            bg.swatch === "transparent"
                              ? "repeating-conic-gradient(#d6cdb6 0 25%, #f4ecd7 0 50%) 50% / 6px 6px"
                              : bg.swatch,
                        }}
                      />
                      {bg.label}
                    </button>
                  );
                })}
              </div>
            </SettingsSection>

            <SettingsSection label="Camera" onDark={onDark}>
              <button
                aria-pressed={panEnabled}
                className={`w-full rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  panEnabled
                    ? "bg-[#9b2f22] text-[#fff8df]"
                    : onDark
                      ? "bg-white/10 text-[#efe7d0] hover:bg-white/20"
                      : "bg-black/5 text-[#2a1609] hover:bg-black/10"
                }`}
                onClick={() => setPanEnabled(!panEnabled)}
                type="button"
              >
                {panEnabled ? "Pan enabled" : "Pan disabled"} · right-drag
              </button>
            </SettingsSection>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function SettingsSection({
  children,
  label,
  onDark,
}: {
  children: ReactNode;
  label: string;
  onDark: boolean;
}) {
  return (
    <div className="mb-3 last:mb-0">
      <div
        className={`mb-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] ${onDark ? "text-[#efe7d0]/55" : "text-[#2a1609]/55"}`}
      >
        {label}
      </div>
      {children}
    </div>
  );
}

function Divider({ onDark }: { onDark: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`mx-0.5 h-5 w-px ${onDark ? "bg-white/15" : "bg-black/15"}`}
    />
  );
}

function IconButton({
  ariaLabel,
  children,
  onClick,
  onDark,
}: {
  ariaLabel: string;
  children: ReactNode;
  onClick: () => void;
  onDark: boolean;
}) {
  return (
    <button
      aria-label={ariaLabel}
      className={`grid h-8 w-8 place-items-center rounded-full transition ${
        onDark ? "hover:bg-white/10" : "hover:bg-black/8"
      }`}
      onClick={onClick}
      type="button"
    >
      <span className="grid h-4 w-4 place-items-center">{children}</span>
    </button>
  );
}

export function ChauModelViewer({
  modelUrl,
  modelScale = 1,
  className = "",
  showFallbackScene = false,
}: ChauModelViewerProps) {
  const normalizedModelUrl = normalizeModelUrl(modelUrl);
  const normalizedModelScale = normalizeModelScale(modelScale);

  const containerRef = useRef<HTMLDivElement>(null);
  const orbitControlsRef = useRef<OrbitControlsImpl | null>(null);

  const [shadingMode, setShadingMode] = useState<ShadingMode>("solid");
  const [background, setBackground] = useState<BackgroundMode>("studio");
  const [lighting, setLighting] = useState<LightingPreset>("studio");
  const [autoRotate, setAutoRotate] = useState(true);
  const [autoRotateSpeed, setAutoRotateSpeed] = useState(1);
  const [panEnabled, setPanEnabled] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomCommand, setZoomCommand] = useState<ZoomCommand | null>(null);
  const [resetNonce, setResetNonce] = useState(0);

  function selectShadingMode(mode: ShadingMode) {
    setShadingMode(mode);
    // Effects-heavy modes look terrible on the paper background — auto-bump
    // to studio so the shader actually reads (Tripo does the same).
    if ((mode === "hologram" || mode === "normal") && background === "light") {
      setBackground("studio");
    }
  }

  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(
        Boolean(
          document.fullscreenElement &&
            containerRef.current &&
            document.fullscreenElement === containerRef.current,
        ),
      );
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const handleToggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (document.fullscreenElement === containerRef.current) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen();
    }
  }, []);

  const handleResetCamera = useCallback(() => {
    setResetNonce((n) => n + 1);
  }, []);

  const handleZoom = useCallback((direction: "in" | "out") => {
    setZoomCommand({ direction, nonce: Date.now() });
  }, []);

  const shellClassName = `relative h-full min-h-[360px] w-full overflow-hidden rounded-2xl ${className}`;
  const containerStyle = {
    background: backgroundCss(background),
  };
  const isOnDarkBg = background === "studio" || background === "dark";

  const toolbar = (
    <ViewerToolbar
      autoRotate={autoRotate}
      autoRotateSpeed={autoRotateSpeed}
      background={background}
      isFullscreen={isFullscreen}
      isOnDarkBg={isOnDarkBg}
      lighting={lighting}
      onResetCamera={handleResetCamera}
      onToggleFullscreen={handleToggleFullscreen}
      onZoom={handleZoom}
      panEnabled={panEnabled}
      setAutoRotate={setAutoRotate}
      setAutoRotateSpeed={setAutoRotateSpeed}
      setBackground={setBackground}
      setLighting={setLighting}
      setPanEnabled={setPanEnabled}
      setShadingMode={selectShadingMode}
      shadingMode={shadingMode}
    />
  );

  if (!normalizedModelUrl) {
    if (showFallbackScene) {
      return (
        <div
          aria-label="Interactive 3D study model"
          className={shellClassName}
          ref={containerRef}
          style={containerStyle}
        >
          <Canvas
            camera={{ position: [0, 0.8, 4], fov: 38 }}
            dpr={[1, 1.5]}
            frameloop="always"
            gl={{ alpha: true, antialias: true }}
            style={{ background: "transparent" }}
          >
            <LightingRig preset={lighting} />
            <ControlsBridge
              controlsRef={orbitControlsRef}
              resetNonce={resetNonce}
              zoomCommand={zoomCommand}
            />
            <FallbackScene
              autoRotate={autoRotate}
              autoRotateSpeed={autoRotateSpeed}
              scale={normalizedModelScale}
              shadingMode={shadingMode}
            />
            <OrbitControls
              ref={orbitControlsRef}
              enableDamping
              enablePan={panEnabled}
              makeDefault
              maxDistance={12}
              minDistance={1.4}
            />
          </Canvas>
          {toolbar}
        </div>
      );
    }

    return (
      <div className={`grid place-items-center ${shellClassName}`}>
        3D model unavailable
      </div>
    );
  }

  return (
    <div
      aria-label="Interactive 3D Chhau model"
      className={shellClassName}
      ref={containerRef}
      style={containerStyle}
    >
      <ModelErrorBoundary
        fallback={<ViewerStatus>3D model failed to load</ViewerStatus>}
        resetKey={normalizedModelUrl}
      >
        <Suspense fallback={<ViewerStatus>Loading model</ViewerStatus>}>
          <Canvas
            camera={{ position: [0, 0.8, 4], fov: 38 }}
            dpr={[1, 1.5]}
            frameloop="always"
            gl={{ alpha: true, antialias: true }}
            style={{ background: "transparent" }}
          >
            <LightingRig preset={lighting} />
            <ControlsBridge
              controlsRef={orbitControlsRef}
              resetNonce={resetNonce}
              zoomCommand={zoomCommand}
            />
            <Suspense fallback={null}>
              <Bounds fit clip observe margin={1.2}>
                <Center>
                  <AutoRotatingModel
                    autoRotate={autoRotate}
                    autoRotateSpeed={autoRotateSpeed}
                  >
                    <LoadedModel
                      scale={normalizedModelScale}
                      shadingMode={shadingMode}
                      url={normalizedModelUrl}
                    />
                  </AutoRotatingModel>
                </Center>
              </Bounds>
            </Suspense>
            <OrbitControls
              ref={orbitControlsRef}
              enableDamping
              enablePan={panEnabled}
              makeDefault
              maxDistance={12}
              minDistance={1.4}
            />
          </Canvas>
        </Suspense>
      </ModelErrorBoundary>
      {toolbar}
    </div>
  );
}

function SlidersIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 7h11M19 7h1M4 12h3M11 12h9M4 17h13M21 17h-1"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
      <circle cx="17" cy="7" r="2" stroke="currentColor" strokeWidth="2" />
      <circle cx="9" cy="12" r="2" stroke="currentColor" strokeWidth="2" />
      <circle cx="19" cy="17" r="2" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M5 12h14"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 2v3M12 19v3M2 12h3M19 12h3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function ExpandIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function ShrinkIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}
