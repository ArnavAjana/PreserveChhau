"use client";

import {
  Component,
  Suspense,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type Ref,
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

const RECOVERED_PROTOTYPE_BYTES: Record<string, number> = {
  "chhau-figure-5a81ddf6.glb": 28751596,
  "chhau-group-1.glb": 31412360,
  "dance-troupe.glb": 58838248,
  "dancer-character.glb": 31065172,
  "human-figure-copy.glb": 29068768,
  "human-figure.glb": 29740348,
  "longsword.glb": 24083824,
  "martial-artist-2.glb": 29692544,
  "martial-artist-copy-2.glb": 29553164,
  "martial-artist-copy.glb": 28999220,
  "martial-artist-duo.glb": 30208160,
  "martial-artist-with-sword.glb": 28559496,
  "martial-artist.glb": 31324908,
  "performing-dancers.glb": 30013920,
  "round-shield.glb": 30687460,
  "traditional-dancer-copy.glb": 31255260,
  "traditional-dancer.glb": 30503892,
};

export type ChhauModelViewerProps = {
  className?: string;
  modelLabel?: string;
  modelScale?: number | string | null;
  modelUrl?: string | null;
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

function getPrototypeSizeLabel(modelUrl: string) {
  const filename = modelUrl.split("/").pop() ?? "";
  const bytes = RECOVERED_PROTOTYPE_BYTES[filename];
  return bytes ? `${(bytes / 1024 / 1024).toFixed(1)} MiB` : null;
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
  }, [activeClip, isPlaying]);

  useEffect(() => {
    const currentAction = currentActionRef.current;
    if (!currentAction) return;
    currentAction.timeScale = speed;
  }, [activeClip, speed]);

  useEffect(() => {
    const currentAction = currentActionRef.current;
    if (!currentAction) return;
    currentAction.clampWhenFinished = !loop;
    currentAction.setLoop(
      loop ? THREE.LoopRepeat : THREE.LoopOnce,
      loop ? Infinity : 1,
    );
  }, [activeClip, loop]);

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
  resetNonce,
}: {
  autoRotate: boolean;
  children: ReactNode;
  resetNonce: number;
}) {
  const ref = useRef<Group>(null);
  useEffect(() => {
    ref.current?.rotation.set(0, 0, 0);
  }, [resetNonce]);
  useFrame((_, delta) => {
    if (autoRotate && ref.current) ref.current.rotation.y += delta * 0.35;
  });
  return <group ref={ref}>{children}</group>;
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
  ariaControls,
  ariaExpanded,
  ariaLabel,
  buttonRef,
  children,
  onClick,
  pressed,
}: {
  active?: boolean;
  ariaControls?: string;
  ariaExpanded?: boolean;
  ariaLabel: string;
  buttonRef?: Ref<HTMLButtonElement>;
  children: ReactNode;
  onClick: () => void;
  pressed?: boolean;
}) {
  return (
    <button
      aria-controls={ariaControls}
      aria-expanded={ariaExpanded}
      aria-label={ariaLabel}
      aria-pressed={pressed}
      className={`grid h-11 min-w-11 shrink-0 place-items-center rounded-xl border px-2 text-xs font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f0b34a] sm:px-3 sm:text-sm ${
        active
          ? "border-[#d68a45] bg-[#9f402b] text-white"
          : "border-white/15 bg-[#111513]/80 text-[#efe7d0] hover:bg-[#29302d]"
      }`}
      onClick={onClick}
      ref={buttonRef}
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
  const settingsId = useId();
  const settingsButtonRef = useRef<HTMLButtonElement>(null);
  const settingsPanelRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!settingsOpen) return;
    settingsPanelRef.current?.querySelector<HTMLButtonElement>("button")?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setSettingsOpen(false);
        settingsButtonRef.current?.focus();
      }
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
    <div className="pointer-events-none absolute inset-0 z-20 p-2 sm:p-3">
      <div className="pointer-events-auto ml-auto flex w-fit max-w-full flex-wrap items-center justify-end gap-1.5 sm:gap-2">
        <IconButton
          active={autoRotate}
          ariaLabel={autoRotate ? "Stop automatic rotation" : "Start automatic rotation"}
          onClick={onRotateToggle}
          pressed={autoRotate}
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
            ariaControls={settingsId}
            ariaExpanded={settingsOpen}
            ariaLabel={settingsOpen ? "Close viewer options" : "Open viewer options"}
            buttonRef={settingsButtonRef}
            onClick={() => setSettingsOpen((value) => !value)}
          >
            Options
          </IconButton>
          {settingsOpen ? (
            <div
              aria-label="3D viewer options"
              className="absolute right-0 top-[3.25rem] max-h-[min(70dvh,24rem)] w-[min(21rem,calc(100vw-3rem))] overflow-y-auto rounded-2xl border border-white/15 bg-[#111513]/95 p-3 text-[#efe7d0] shadow-2xl backdrop-blur-xl sm:w-[min(21rem,calc(100vw-4rem))] sm:p-4"
              id={settingsId}
              ref={settingsPanelRef}
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
          active={isFullscreen}
          ariaLabel={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          onClick={onToggleFullscreen}
          pressed={isFullscreen}
        >
          {isFullscreen ? "Exit" : "Full screen"}
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
            className={`min-h-11 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
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
      <div className="absolute bottom-2 left-2 z-20 rounded-full border border-white/12 bg-[#111513]/80 px-3 py-2 text-xs font-semibold text-[#efe7d0]/70 backdrop-blur sm:bottom-3 sm:left-3">
        Static study
      </div>
    );
  }

  return (
    <div className="absolute inset-x-2 bottom-2 z-20 rounded-2xl border border-white/15 bg-[#111513]/92 p-2 text-[#efe7d0] shadow-xl backdrop-blur-xl sm:inset-x-3 sm:bottom-3 sm:p-3">
      <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
        <button
          aria-label={isPlaying ? "Pause animation" : "Play animation"}
          aria-pressed={isPlaying}
          className="h-11 shrink-0 rounded-xl bg-[#9f402b] px-3 text-xs font-bold text-white transition hover:bg-[#b24a32] sm:px-4 sm:text-sm"
          onClick={() => onPlayChange(!isPlaying)}
          type="button"
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
        <label className="min-w-0 flex-1 sm:max-w-64">
          <span className="sr-only">Animation clip</span>
          <select
            className="h-11 w-full min-w-0 rounded-xl border border-white/15 bg-white/8 px-2 text-xs text-[#efe7d0] sm:px-3 sm:text-sm"
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
        <label className="flex h-11 shrink-0 items-center gap-1 rounded-xl border border-white/15 bg-white/5 px-2 text-xs font-semibold sm:gap-2 sm:px-3">
          <span className="hidden sm:inline">Speed</span>
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
          className={`h-11 shrink-0 rounded-xl border px-2 text-xs font-bold sm:px-3 ${
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
      <div className="mt-1.5 flex items-center gap-2 sm:mt-2 sm:gap-3">
        <span className="w-8 text-right font-mono text-[10px] tabular-nums text-[#efe7d0]/65 sm:w-10 sm:text-[11px]">
          {formatTime(playback.currentTime)}
        </span>
        <input
          aria-label="Animation timeline"
          className="h-11 min-w-0 flex-1 cursor-pointer accent-[#d68a45]"
          max={playback.duration || 0}
          min={0}
          onChange={(event) => onSeek(Number(event.target.value))}
          step={0.01}
          type="range"
          value={Math.min(playback.currentTime, playback.duration || 0)}
        />
        <span className="w-8 font-mono text-[10px] tabular-nums text-[#efe7d0]/65 sm:w-10 sm:text-[11px]">
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
}: ChhauModelViewerProps) {
  const normalizedModelUrl = normalizeModelUrl(modelUrl);
  const normalizedModelScale = normalizeModelScale(modelScale);
  const isRecoveredPrototype =
    normalizedModelUrl?.startsWith("/models/chhau-web-assets/") ?? false;
  const prototypeSizeLabel = normalizedModelUrl
    ? getPrototypeSizeLabel(normalizedModelUrl)
    : null;
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
  const [useCompactRendering, setUseCompactRendering] = useState(false);
  const [loadedPrototypeUrl, setLoadedPrototypeUrl] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const media = window.matchMedia("(max-width: 640px), (max-height: 600px)");
    const updateRenderingMode = () => setUseCompactRendering(media.matches);
    updateRenderingMode();
    media.addEventListener("change", updateRenderingMode);
    return () => media.removeEventListener("change", updateRenderingMode);
  }, []);

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
      setStatusMessage("Fullscreen failed to open.");
    }
  }, []);

  function changeCameraView(view: CameraView) {
    setCameraView(view);
    setCameraCommand((previous) => ({
      nonce: (previous?.nonce ?? 0) + 1,
      view,
    }));
  }

  const shellClassName = `relative h-full w-full overflow-hidden border border-white/10 ${
    isFullscreen
      ? "min-h-0 rounded-none"
      : "min-h-[360px] rounded-2xl sm:min-h-[420px] [@media(max-height:600px)]:min-h-[300px]"
  } ${className}`;
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
        resolution={useCompactRendering ? 128 : 512}
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
      onZoom={(direction) =>
        setZoomCommand((previous) => ({
          direction,
          nonce: (previous?.nonce ?? 0) + 1,
        }))
      }
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
      }}
      onLoopChange={setLoop}
      onPlayChange={setIsPlaying}
      onSeek={(time) =>
        setSeekCommand((previous) => ({
          nonce: (previous?.nonce ?? 0) + 1,
          time,
        }))
      }
      onSpeedChange={setSpeed}
      playback={playback}
      speed={speed}
    />
  ) : null;

  if (!normalizedModelUrl) {
    return (
      <div
        aria-label={`${modelLabel} 3D viewer`}
        className={`grid place-items-center bg-[#151817] p-6 text-center ${shellClassName}`}
        role="region"
      >
        <div>
          <p className="text-sm font-bold text-[#efe7d0]">3D study not yet available</p>
          <p className="mt-2 max-w-sm text-xs leading-5 text-[#efe7d0]/55">
            This space is reserved for a future model study.
          </p>
        </div>
      </div>
    );
  }

  if (
    isRecoveredPrototype &&
    loadedPrototypeUrl !== normalizedModelUrl
  ) {
    return (
      <div
        aria-label={`${modelLabel} 3D visual prototype`}
        className={`grid place-items-center bg-[#151817] p-6 text-center ${shellClassName}`}
        role="region"
      >
        <div className="max-w-md">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#f0b34a]">
            Historical 3D prototype
          </p>
          <p className="mt-3 text-lg font-bold text-[#efe7d0]">{modelLabel}</p>
          <p className="mt-2 text-sm leading-6 text-[#efe7d0]/70">
            Large static model{prototypeSizeLabel ? `, ${prototypeSizeLabel}` : ""}.
            It loads after you choose, so the book stays responsive.
          </p>
          <button
            className="mt-5 min-h-11 rounded-xl bg-[#9f402b] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#b24a32] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f0b34a]"
            onClick={() => setLoadedPrototypeUrl(normalizedModelUrl)}
            type="button"
          >
            Load 3D prototype
          </button>
          <p className="mt-4 text-xs leading-5 text-[#efe7d0]/55">
            Generic generated study. It is not evidence of a named Chhau movement,
            regional tradition, costume, character, formation, performance, or prop.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      aria-label={`${modelLabel} interactive 3D viewer`}
      className={shellClassName}
      ref={containerRef}
      role="region"
      style={{ background: backgroundCss(background) }}
    >
      <p className="sr-only" aria-live="polite">{statusMessage}</p>
      <ModelErrorBoundary
        fallback={
          <ViewerStatus>
            The model did not load. Check its file path and compression decoders.
          </ViewerStatus>
        }
        resetKey={normalizedModelUrl}
      >
        <Suspense fallback={<ViewerStatus>Preparing 3D study...</ViewerStatus>}>
          <Canvas
            camera={{ fov: 38, position: [0, 0.7, 4] }}
            dpr={useCompactRendering ? 1 : [1, 1.5]}
            frameloop={isAnimating ? "always" : "demand"}
            gl={{ alpha: true, antialias: !useCompactRendering }}
            shadows
            style={{
              background: "transparent",
              touchAction: isFullscreen ? "none" : "pan-y",
            }}
          >
            <Bounds clip fit margin={1.25} observe>
              <Center>
                <RotatingGroup autoRotate={autoRotate} resetNonce={resetNonce}>
                  <LoadedModel
                    key={normalizedModelUrl}
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
      {toolbar}
      {animationControls}
    </div>
  );
}
