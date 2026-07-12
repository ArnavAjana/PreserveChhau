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
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Bounds,
  Center,
  ContactShadows,
  OrbitControls,
  useGLTF,
} from "@react-three/drei";
import * as THREE from "three";
import type { Group, Material, Mesh, Object3D } from "three";
import {
  KTX2Loader,
  type GLTFLoader,
  type OrbitControls as OrbitControlsImpl,
} from "three-stdlib";
import { clone as cloneSkeleton } from "three/examples/jsm/utils/SkeletonUtils.js";

type AppearanceMode = "texture" | "clay" | "structure";
type BackgroundMode = "ink" | "paper";
type LightingPreset = "studio" | "soft" | "dramatic";
type CameraView = "front" | "three-quarter" | "side" | "back";

export type ChhauModelViewerProps = {
  className?: string;
  modelLabel?: string;
  modelScale?: number | string | null;
  modelUrl?: string | null;
  showFallbackScene?: boolean;
};

type PlaybackSnapshot = {
  currentTime: number;
  duration: number;
};

type SeekCommand = {
  nonce: number;
  time: number;
};

type CameraCommand = {
  nonce: number;
  view: CameraView;
};

type ZoomCommand = {
  direction: "in" | "out";
  nonce: number;
};

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
  state: ModelErrorBoundaryState = { hasError: false };

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
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

function normalizeModelUrl(modelUrl: ChhauModelViewerProps["modelUrl"]) {
  const value = typeof modelUrl === "string" ? modelUrl.trim() : "";
  return value.length > 0 ? value : null;
}

function normalizeModelScale(modelScale: ChhauModelViewerProps["modelScale"]) {
  const value =
    typeof modelScale === "string" ? Number.parseFloat(modelScale) : modelScale;
  return typeof value === "number" && Number.isFinite(value) && value > 0
    ? value
    : 1;
}

function humanizeClipName(name: string) {
  return name
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${remainder}`;
}

function cloneMaterialForMode(material: Material, mode: AppearanceMode) {
  if (mode === "texture") return material;

  const source = material as THREE.MeshStandardMaterial;
  if (mode === "structure") {
    return new THREE.MeshBasicMaterial({
      color: "#d9cbb2",
      transparent: false,
      wireframe: true,
    });
  }

  return new THREE.MeshStandardMaterial({
    color: "#b96f51",
    metalness: 0.02,
    roughness: 0.82,
    side: source.side ?? THREE.FrontSide,
  });
}

function applyAppearance(
  root: Object3D,
  mode: AppearanceMode,
  originals: Map<Mesh, Material | Material[]>,
  owned: Set<Material>,
) {
  owned.forEach((material) => material.dispose());
  owned.clear();

  root.traverse((child) => {
    const mesh = child as Mesh;
    if (!mesh.isMesh) return;
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    if (!originals.has(mesh)) originals.set(mesh, mesh.material);
    const original = originals.get(mesh);
    if (!original) return;

    if (mode === "texture") {
      mesh.material = original;
      return;
    }

    if (Array.isArray(original)) {
      const materials = original.map((material) =>
        cloneMaterialForMode(material, mode),
      );
      materials.forEach((material) => owned.add(material));
      mesh.material = materials;
      return;
    }

    const material = cloneMaterialForMode(original, mode);
    owned.add(material);
    mesh.material = material;
  });
}

type LoadedModelProps = {
  activeClip: string;
  appearance: AppearanceMode;
  isPlaying: boolean;
  loop: boolean;
  onClipsChange: (clips: string[]) => void;
  onPlaybackChange: (snapshot: PlaybackSnapshot) => void;
  scale: number;
  seekCommand: SeekCommand | null;
  speed: number;
  url: string;
};

function LoadedModel({
  activeClip,
  appearance,
  isPlaying,
  loop,
  onClipsChange,
  onPlaybackChange,
  scale,
  seekCommand,
  speed,
  url,
}: LoadedModelProps) {
  const gl = useThree((state) => state.gl);
  const ktx2Loader = useMemo(
    () =>
      new KTX2Loader()
        .setTranscoderPath("/basis/")
        .detectSupport(gl),
    [gl],
  );
  const extendLoader = useCallback(
    (loader: GLTFLoader) => loader.setKTX2Loader(ktx2Loader),
    [ktx2Loader],
  );
  const { animations, scene } = useGLTF(
    url,
    "/draco/gltf/",
    true,
    extendLoader,
  );
  const cloned = useMemo(() => cloneSkeleton(scene) as Group, [scene]);
  const actionsRef = useRef<Map<string, THREE.AnimationAction>>(new Map());
  const currentActionRef = useRef<THREE.AnimationAction | null>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const originals = useRef<Map<Mesh, Material | Material[]>>(new Map());
  const ownedMaterials = useRef<Set<Material>>(new Set());
  const lastProgressUpdate = useRef(0);
  const lastSeekNonce = useRef(0);

  useEffect(() => {
    const mixer = new THREE.AnimationMixer(cloned);
    const actions = new Map<string, THREE.AnimationAction>();
    animations.forEach((clip, index) => {
      const name = clip.name.trim() || `clip-${index + 1}`;
      actions.set(name, mixer.clipAction(clip, cloned));
    });
    mixerRef.current = mixer;
    actionsRef.current = actions;
    onClipsChange(Array.from(actions.keys()));

    return () => {
      mixer.stopAllAction();
      mixer.uncacheRoot(cloned);
      if (mixerRef.current === mixer) mixerRef.current = null;
      actionsRef.current = new Map();
      currentActionRef.current = null;
    };
  }, [animations, cloned, onClipsChange]);

  useEffect(() => {
    applyAppearance(
      cloned,
      appearance,
      originals.current,
      ownedMaterials.current,
    );
  }, [appearance, cloned]);

  useEffect(() => {
    const currentAction = activeClip
      ? actionsRef.current.get(activeClip)
      : undefined;
    actionsRef.current.forEach((action) => action.stop());
    currentActionRef.current = currentAction ?? null;
    if (!currentAction) {
      onPlaybackChange({ currentTime: 0, duration: 0 });
      return;
    }

    currentAction.reset();
    currentAction.enabled = true;
    currentAction.play();
    onPlaybackChange({
      currentTime: 0,
      duration: currentAction.getClip().duration,
    });

    return () => {
      currentAction.stop();
      if (currentActionRef.current === currentAction) {
        currentActionRef.current = null;
      }
    };
  }, [activeClip, cloned, onPlaybackChange]);

  useEffect(() => {
    const currentAction = currentActionRef.current;
    if (!currentAction) return;
    currentAction.paused = !isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    const currentAction = currentActionRef.current;
    if (!currentAction) return;
    currentAction.timeScale = speed;
  }, [speed]);

  useEffect(() => {
    const currentAction = currentActionRef.current;
    if (!currentAction) return;
    currentAction.clampWhenFinished = !loop;
    currentAction.setLoop(
      loop ? THREE.LoopRepeat : THREE.LoopOnce,
      loop ? Infinity : 1,
    );
  }, [loop]);

  useEffect(() => {
    const currentAction = currentActionRef.current;
    if (!currentAction || !seekCommand) return;
    if (seekCommand.nonce === lastSeekNonce.current) return;
    lastSeekNonce.current = seekCommand.nonce;
    currentAction.time = Math.min(
      Math.max(seekCommand.time, 0),
      currentAction.getClip().duration,
    );
  }, [seekCommand]);

  useEffect(() => {
    const materialsToDispose = ownedMaterials.current;
    const materialsToRestore = originals.current;
    return () => {
      materialsToDispose.forEach((material) => material.dispose());
      materialsToDispose.clear();
      materialsToRestore.forEach((material, mesh) => {
        mesh.material = material;
      });
      materialsToRestore.clear();
      ktx2Loader.dispose();
    };
  }, [ktx2Loader]);

  useFrame((state, delta) => {
    mixerRef.current?.update(delta);
    const currentAction = currentActionRef.current;
    if (!currentAction) return;
    if (state.clock.elapsedTime - lastProgressUpdate.current < 0.08) return;
    lastProgressUpdate.current = state.clock.elapsedTime;
    onPlaybackChange({
      currentTime: currentAction.time,
      duration: currentAction.getClip().duration,
    });
  });

  return <primitive object={cloned} scale={scale} />;
}

function RotatingGroup({
  autoRotate,
  children,
}: {
  autoRotate: boolean;
  children: ReactNode;
}) {
  const ref = useRef<Group>(null);
  useFrame((_, delta) => {
    if (autoRotate && ref.current) ref.current.rotation.y += delta * 0.35;
  });
  return <group ref={ref}>{children}</group>;
}

function ControlsPreview({ autoRotate }: { autoRotate: boolean }) {
  const ref = useRef<Group>(null);
  useFrame((_, delta) => {
    if (autoRotate && ref.current) ref.current.rotation.y += delta * 0.28;
  });

  return (
    <group ref={ref}>
      <mesh castShadow position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.38, 0.58, 2.15, 32]} />
        <meshStandardMaterial color="#a75336" roughness={0.76} />
      </mesh>
      <mesh castShadow position={[0, 1.52, 0]}>
        <sphereGeometry args={[0.42, 32, 32]} />
        <meshStandardMaterial color="#d6a64b" roughness={0.68} />
      </mesh>
      <mesh position={[0, 0.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.08, 0.025, 12, 96]} />
        <meshStandardMaterial color="#eadfc8" emissive="#5a2818" />
      </mesh>
      <mesh position={[0, 1.45, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.72, 0.02, 12, 96]} />
        <meshStandardMaterial color="#eadfc8" emissive="#5a2818" />
      </mesh>
    </group>
  );
}

function LightingRig({ preset }: { preset: LightingPreset }) {
  if (preset === "soft") {
    return (
      <>
        <ambientLight intensity={1.1} />
        <directionalLight intensity={1.05} position={[4, 6, 5]} />
        <directionalLight color="#f0c98d" intensity={0.4} position={[-4, 2, -3]} />
      </>
    );
  }

  if (preset === "dramatic") {
    return (
      <>
        <ambientLight intensity={0.25} />
        <directionalLight color="#fff0c7" intensity={2.5} position={[5, 6, 4]} />
        <pointLight color="#b84f34" intensity={1.1} position={[-3, 1, -2]} />
      </>
    );
  }

  return (
    <>
      <ambientLight intensity={0.72} />
      <directionalLight intensity={1.8} position={[4, 6, 6]} />
      <directionalLight color="#d7e3df" intensity={0.36} position={[-5, 2, -3]} />
    </>
  );
}

function ControlsBridge({
  cameraCommand,
  controlsRef,
  resetNonce,
  zoomCommand,
}: {
  cameraCommand: CameraCommand | null;
  controlsRef: React.MutableRefObject<OrbitControlsImpl | null>;
  resetNonce: number;
  zoomCommand: ZoomCommand | null;
}) {
  const lastCamera = useRef(0);
  const lastReset = useRef(0);
  const lastZoom = useRef(0);
  const stateSaved = useRef(false);

  useFrame(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    if (!stateSaved.current) {
      controls.saveState();
      stateSaved.current = true;
    }

    if (zoomCommand && zoomCommand.nonce !== lastZoom.current) {
      lastZoom.current = zoomCommand.nonce;
      const offset = controls.object.position.clone().sub(controls.target);
      offset.multiplyScalar(zoomCommand.direction === "in" ? 0.82 : 1.22);
      offset.setLength(
        Math.min(
          Math.max(offset.length(), controls.minDistance ?? 1),
          controls.maxDistance ?? 12,
        ),
      );
      controls.object.position.copy(controls.target).add(offset);
      controls.update();
    }

    if (cameraCommand && cameraCommand.nonce !== lastCamera.current) {
      lastCamera.current = cameraCommand.nonce;
      const radius = Math.max(
        controls.object.position.distanceTo(controls.target),
        2.4,
      );
      const positions: Record<CameraView, THREE.Vector3> = {
        front: new THREE.Vector3(0, radius * 0.08, radius),
        "three-quarter": new THREE.Vector3(
          radius * 0.68,
          radius * 0.08,
          radius * 0.68,
        ),
        side: new THREE.Vector3(radius, radius * 0.08, 0),
        back: new THREE.Vector3(0, radius * 0.08, -radius),
      };
      controls.object.position.copy(controls.target).add(positions[cameraCommand.view]);
      controls.update();
    }

    if (resetNonce !== lastReset.current) {
      lastReset.current = resetNonce;
      controls.reset();
    }
  });

  return null;
}

function ViewerStatus({ children }: { children: ReactNode }) {
  return (
    <div className="absolute inset-0 grid place-items-center bg-[#151817] px-6 text-center text-sm font-medium text-[#efe7d0]/75">
      {children}
    </div>
  );
}

function backgroundCss(mode: BackgroundMode) {
  return mode === "paper"
    ? "linear-gradient(180deg,#f5efe4,#e8dcc8)"
    : "radial-gradient(circle at 50% 28%,#303937 0%,#151918 66%,#0b0d0c 100%)";
}

function IconButton({
  active = false,
  ariaLabel,
  children,
  onClick,
}: {
  active?: boolean;
  ariaLabel: string;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={ariaLabel}
      aria-pressed={active || undefined}
      className={`grid h-11 min-w-11 place-items-center rounded-xl border px-3 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f0b34a] ${
        active
          ? "border-[#d68a45] bg-[#9f402b] text-white"
          : "border-white/15 bg-[#111513]/80 text-[#efe7d0] hover:bg-[#29302d]"
      }`}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

function ViewerToolbar({
  appearance,
  autoRotate,
  background,
  cameraView,
  isFullscreen,
  lighting,
  onAppearanceChange,
  onBackgroundChange,
  onCameraView,
  onReset,
  onRotateToggle,
  onToggleFullscreen,
  onZoom,
  onLightingChange,
}: {
  appearance: AppearanceMode;
  autoRotate: boolean;
  background: BackgroundMode;
  cameraView: CameraView;
  isFullscreen: boolean;
  lighting: LightingPreset;
  onAppearanceChange: (mode: AppearanceMode) => void;
  onBackgroundChange: (mode: BackgroundMode) => void;
  onCameraView: (view: CameraView) => void;
  onLightingChange: (preset: LightingPreset) => void;
  onReset: () => void;
  onRotateToggle: () => void;
  onToggleFullscreen: () => void;
  onZoom: (direction: "in" | "out") => void;
}) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!settingsOpen) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setSettingsOpen(false);
    }
    function handlePointerDown(event: PointerEvent) {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(event.target as Node)
      ) {
        setSettingsOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [settingsOpen]);

  return (
    <div className="pointer-events-none absolute inset-0 z-20 p-3">
      <div className="pointer-events-auto ml-auto flex w-fit flex-wrap items-center gap-2">
        <IconButton
          active={autoRotate}
          ariaLabel={autoRotate ? "Stop automatic rotation" : "Start automatic rotation"}
          onClick={onRotateToggle}
        >
          Rotate
        </IconButton>
        <IconButton ariaLabel="Zoom out" onClick={() => onZoom("out")}>
          −
        </IconButton>
        <IconButton ariaLabel="Zoom in" onClick={() => onZoom("in")}>
          +
        </IconButton>
        <IconButton ariaLabel="Reset camera" onClick={onReset}>
          Reset
        </IconButton>
        <div className="relative" ref={settingsRef}>
          <IconButton
            active={settingsOpen}
            ariaLabel="Open viewer options"
            onClick={() => setSettingsOpen((value) => !value)}
          >
            View
          </IconButton>
          {settingsOpen ? (
            <div
              aria-label="3D viewer options"
              className="absolute right-0 top-13 w-[min(21rem,calc(100vw-2rem))] rounded-2xl border border-white/15 bg-[#111513]/95 p-4 text-[#efe7d0] shadow-2xl backdrop-blur-xl"
              role="dialog"
            >
              <OptionGroup
                label="Camera"
                onChange={(value) => onCameraView(value as CameraView)}
                options={[
                  ["front", "Front"],
                  ["three-quarter", "¾"],
                  ["side", "Side"],
                  ["back", "Back"],
                ]}
                value={cameraView}
              />
              <OptionGroup
                label="Appearance"
                onChange={(value) => onAppearanceChange(value as AppearanceMode)}
                options={[
                  ["texture", "Texture"],
                  ["clay", "Clay"],
                  ["structure", "Structure"],
                ]}
                value={appearance}
              />
              <OptionGroup
                label="Light"
                onChange={(value) => onLightingChange(value as LightingPreset)}
                options={[
                  ["studio", "Studio"],
                  ["soft", "Soft"],
                  ["dramatic", "Dramatic"],
                ]}
                value={lighting}
              />
              <OptionGroup
                label="Background"
                onChange={(value) => onBackgroundChange(value as BackgroundMode)}
                options={[
                  ["ink", "Ink"],
                  ["paper", "Paper"],
                ]}
                value={background}
              />
            </div>
          ) : null}
        </div>
        <IconButton
          ariaLabel={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          onClick={onToggleFullscreen}
        >
          {isFullscreen ? "Close" : "Full"}
        </IconButton>
      </div>
    </div>
  );
}

function OptionGroup({
  label,
  onChange,
  options,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  options: Array<[string, string]>;
  value: string;
}) {
  return (
    <fieldset className="mb-4 last:mb-0">
      <legend className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#efe7d0]/55">
        {label}
      </legend>
      <div className="grid grid-cols-2 gap-2">
        {options.map(([optionValue, optionLabel]) => (
          <button
            aria-pressed={optionValue === value}
            className={`min-h-10 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
              optionValue === value
                ? "border-[#d68a45] bg-[#9f402b] text-white"
                : "border-white/10 bg-white/5 text-[#efe7d0] hover:bg-white/10"
            }`}
            key={optionValue}
            onClick={() => onChange(optionValue)}
            type="button"
          >
            {optionLabel}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function AnimationControls({
  activeClip,
  clips,
  isPlaying,
  loop,
  onClipChange,
  onLoopChange,
  onPlayChange,
  onSeek,
  onSpeedChange,
  playback,
  speed,
}: {
  activeClip: string;
  clips: string[];
  isPlaying: boolean;
  loop: boolean;
  onClipChange: (clip: string) => void;
  onLoopChange: (loop: boolean) => void;
  onPlayChange: (playing: boolean) => void;
  onSeek: (time: number) => void;
  onSpeedChange: (speed: number) => void;
  playback: PlaybackSnapshot;
  speed: number;
}) {
  if (clips.length === 0) {
    return (
      <div className="absolute bottom-3 left-3 z-20 rounded-full border border-white/12 bg-[#111513]/80 px-3 py-2 text-xs font-semibold text-[#efe7d0]/70 backdrop-blur">
        Static study
      </div>
    );
  }

  return (
    <div className="absolute inset-x-3 bottom-3 z-20 rounded-2xl border border-white/15 bg-[#111513]/92 p-3 text-[#efe7d0] shadow-xl backdrop-blur-xl">
      <div className="flex flex-wrap items-center gap-2">
        <button
          aria-label={isPlaying ? "Pause animation" : "Play animation"}
          className="h-11 rounded-xl bg-[#9f402b] px-4 text-sm font-bold text-white transition hover:bg-[#b24a32]"
          onClick={() => onPlayChange(!isPlaying)}
          type="button"
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
        <label className="min-w-0 flex-1 sm:max-w-64">
          <span className="sr-only">Animation clip</span>
          <select
            className="h-11 w-full rounded-xl border border-white/15 bg-white/8 px-3 text-sm text-[#efe7d0]"
            onChange={(event) => onClipChange(event.target.value)}
            value={activeClip}
          >
            {clips.map((clip) => (
              <option className="bg-[#111513]" key={clip} value={clip}>
                {humanizeClipName(clip)}
              </option>
            ))}
          </select>
        </label>
        <label className="flex h-11 items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 text-xs font-semibold">
          Speed
          <select
            aria-label="Animation speed"
            className="bg-transparent text-sm font-bold"
            onChange={(event) => onSpeedChange(Number(event.target.value))}
            value={speed}
          >
            <option className="bg-[#111513]" value={0.25}>0.25×</option>
            <option className="bg-[#111513]" value={0.5}>0.5×</option>
            <option className="bg-[#111513]" value={1}>1×</option>
          </select>
        </label>
        <button
          aria-pressed={loop}
          className={`h-11 rounded-xl border px-3 text-xs font-bold ${
            loop
              ? "border-[#d68a45] bg-[#9f402b] text-white"
              : "border-white/15 bg-white/5"
          }`}
          onClick={() => onLoopChange(!loop)}
          type="button"
        >
          Loop
        </button>
      </div>
      <div className="mt-2 flex items-center gap-3">
        <span className="w-10 text-right font-mono text-[11px] tabular-nums text-[#efe7d0]/65">
          {formatTime(playback.currentTime)}
        </span>
        <input
          aria-label="Animation timeline"
          className="h-2 min-w-0 flex-1 cursor-pointer accent-[#d68a45]"
          max={playback.duration || 0}
          min={0}
          onChange={(event) => onSeek(Number(event.target.value))}
          step={0.01}
          type="range"
          value={Math.min(playback.currentTime, playback.duration || 0)}
        />
        <span className="w-10 font-mono text-[11px] tabular-nums text-[#efe7d0]/65">
          {formatTime(playback.duration)}
        </span>
      </div>
    </div>
  );
}

export function ChhauModelViewer({
  className = "",
  modelLabel = "3D study",
  modelScale = 1,
  modelUrl,
  showFallbackScene = false,
}: ChhauModelViewerProps) {
  const normalizedModelUrl = normalizeModelUrl(modelUrl);
  const normalizedModelScale = normalizeModelScale(modelScale);
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitControlsRef = useRef<OrbitControlsImpl | null>(null);

  const [activeClip, setActiveClip] = useState("");
  const [appearance, setAppearance] = useState<AppearanceMode>("texture");
  const [autoRotate, setAutoRotate] = useState(false);
  const [background, setBackground] = useState<BackgroundMode>("ink");
  const [cameraCommand, setCameraCommand] = useState<CameraCommand | null>(null);
  const [cameraView, setCameraView] = useState<CameraView>("front");
  const [clips, setClips] = useState<string[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [lighting, setLighting] = useState<LightingPreset>("studio");
  const [loop, setLoop] = useState(true);
  const [playback, setPlayback] = useState<PlaybackSnapshot>({
    currentTime: 0,
    duration: 0,
  });
  const [resetNonce, setResetNonce] = useState(0);
  const [seekCommand, setSeekCommand] = useState<SeekCommand | null>(null);
  const [speed, setSpeed] = useState(1);
  const [statusMessage, setStatusMessage] = useState("");
  const [zoomCommand, setZoomCommand] = useState<ZoomCommand | null>(null);

  const handleClipsChange = useCallback((nextClips: string[]) => {
    setIsPlaying(false);
    setPlayback({ currentTime: 0, duration: 0 });
    setClips((previous) =>
      previous.join("\u0000") === nextClips.join("\u0000")
        ? previous
        : nextClips,
    );
    setActiveClip((previous) =>
      previous && nextClips.includes(previous) ? previous : nextClips[0] ?? "",
    );
  }, []);

  const handlePlaybackChange = useCallback((snapshot: PlaybackSnapshot) => {
    setPlayback((previous) =>
      Math.abs(previous.currentTime - snapshot.currentTime) < 0.02 &&
      previous.duration === snapshot.duration
        ? previous
        : snapshot,
    );
  }, []);

  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(document.fullscreenElement === containerRef.current);
    }
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const container = containerRef.current;
    if (!container) return;
    try {
      if (document.fullscreenElement === container) {
        await document.exitFullscreen();
      } else if (container.requestFullscreen) {
        await container.requestFullscreen();
      } else {
        setStatusMessage("Fullscreen is not available in this browser.");
      }
    } catch {
      setStatusMessage("Fullscreen could not be opened.");
    }
  }, []);

  function changeCameraView(view: CameraView) {
    setCameraView(view);
    setCameraCommand({ nonce: Date.now(), view });
  }

  const shellClassName = `relative h-full min-h-[420px] w-full overflow-hidden rounded-2xl border border-white/10 ${className}`;
  const isAnimating = isPlaying || autoRotate;

  const commonScene = (
    <>
      <LightingRig preset={lighting} />
      <ControlsBridge
        cameraCommand={cameraCommand}
        controlsRef={orbitControlsRef}
        resetNonce={resetNonce}
        zoomCommand={zoomCommand}
      />
      <ContactShadows
        blur={2.5}
        far={6}
        opacity={background === "paper" ? 0.24 : 0.42}
        position={[0, -1.48, 0]}
        resolution={512}
        scale={7}
      />
      <OrbitControls
        ref={orbitControlsRef}
        enableDamping
        enablePan={isFullscreen}
        enableZoom={isFullscreen}
        makeDefault
        maxDistance={12}
        minDistance={1.3}
      />
    </>
  );

  const toolbar = (
    <ViewerToolbar
      appearance={appearance}
      autoRotate={autoRotate}
      background={background}
      cameraView={cameraView}
      isFullscreen={isFullscreen}
      lighting={lighting}
      onAppearanceChange={setAppearance}
      onBackgroundChange={setBackground}
      onCameraView={changeCameraView}
      onLightingChange={setLighting}
      onReset={() => setResetNonce((value) => value + 1)}
      onRotateToggle={() => setAutoRotate((value) => !value)}
      onToggleFullscreen={toggleFullscreen}
      onZoom={(direction) => setZoomCommand({ direction, nonce: Date.now() })}
    />
  );

  const animationControls = normalizedModelUrl ? (
    <AnimationControls
      activeClip={activeClip}
      clips={clips}
      isPlaying={isPlaying}
      loop={loop}
      onClipChange={(clip) => {
        setActiveClip(clip);
        setIsPlaying(false);
      }}
      onLoopChange={setLoop}
      onPlayChange={setIsPlaying}
      onSeek={(time) => setSeekCommand({ nonce: Date.now(), time })}
      onSpeedChange={setSpeed}
      playback={playback}
      speed={speed}
    />
  ) : null;

  if (!normalizedModelUrl && !showFallbackScene) {
    return (
      <div className={`grid place-items-center bg-[#151817] p-6 text-center ${shellClassName}`}>
        <div>
          <p className="text-sm font-bold text-[#efe7d0]">3D study not yet available</p>
          <p className="mt-2 max-w-sm text-xs leading-5 text-[#efe7d0]/55">
            This space stays empty until the model has practitioner, credit, and rights review.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      aria-label={`Interactive ${modelLabel}`}
      className={shellClassName}
      ref={containerRef}
      style={{ background: backgroundCss(background) }}
    >
      <p className="sr-only" aria-live="polite">{statusMessage}</p>
      {normalizedModelUrl ? (
        <ModelErrorBoundary
          fallback={
            <ViewerStatus>
              The model could not be loaded. Check the file path and compression decoders.
            </ViewerStatus>
          }
          resetKey={normalizedModelUrl}
        >
          <Suspense fallback={<ViewerStatus>Preparing 3D study…</ViewerStatus>}>
            <Canvas
              camera={{ fov: 38, position: [0, 0.7, 4] }}
              dpr={[1, 1.5]}
              frameloop={isAnimating ? "always" : "demand"}
              gl={{ alpha: true, antialias: true }}
              shadows
              style={{ background: "transparent" }}
            >
              <Bounds clip fit margin={1.25} observe>
                <Center>
                  <RotatingGroup autoRotate={autoRotate}>
                    <LoadedModel
                      activeClip={activeClip}
                      appearance={appearance}
                      isPlaying={isPlaying}
                      loop={loop}
                      onClipsChange={handleClipsChange}
                      onPlaybackChange={handlePlaybackChange}
                      scale={normalizedModelScale}
                      seekCommand={seekCommand}
                      speed={speed}
                      url={normalizedModelUrl}
                    />
                  </RotatingGroup>
                </Center>
              </Bounds>
              {commonScene}
            </Canvas>
          </Suspense>
        </ModelErrorBoundary>
      ) : (
        <Canvas
          camera={{ fov: 38, position: [0, 0.5, 4.6] }}
          dpr={[1, 1.5]}
          frameloop={autoRotate ? "always" : "demand"}
          gl={{ alpha: true, antialias: true }}
          shadows
          style={{ background: "transparent" }}
        >
          <Bounds clip fit margin={1.35} observe>
            <Center>
              <ControlsPreview autoRotate={autoRotate} />
            </Center>
          </Bounds>
          {commonScene}
        </Canvas>
      )}
      {toolbar}
      {animationControls}
      {!normalizedModelUrl ? (
        <div className="pointer-events-none absolute inset-x-3 bottom-3 z-20 rounded-2xl border border-white/12 bg-[#111513]/86 p-3 text-[#efe7d0] backdrop-blur">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#e4a84a]">
            Viewer controls preview
          </p>
          <p className="mt-1 text-xs leading-5 text-[#efe7d0]/65">
            This abstract object demonstrates the controls. It is not a Chhau dancer, pose, mask, or costume.
          </p>
        </div>
      ) : null}
    </div>
  );
}
