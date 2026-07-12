import { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import Globe from 'react-globe.gl';
import {
  chhauGeodata,
  STYLE_COLORS,
  CATEGORIES,
  getStyleColor,
  fetchWikiImage,
} from './data';
import './ChhauGlobe.css';

// Vector globe — no raster earth. Country geometry from Natural Earth (110m),
// CORS-clean via jsDelivr. Background starfield is the only image used.
const COUNTRIES_URL =
  'https://cdn.jsdelivr.net/gh/vasturiano/react-globe.gl@master/example/datasets/ne_110m_admin_0_countries.geojson';
const BG_IMG = '//unpkg.com/three-globe/example/img/night-sky.png';

const ACCENT = '#e7dcc8'; // host-country highlight (warm parchment, not neon)

// Camera vantage points + the heartland origin that arcs radiate from.
const HOME_POV = { lat: 18, lng: 80, altitude: 2.5 };
const INTRO_POV = { lat: 18, lng: 80, altitude: 4.5 };
const ORIGIN = { lat: 23.2, lng: 86.03 }; // Charida, the mask heartland

let countriesCache = null;

/** Ray-casting point-in-polygon against a GeoJSON outer ring ([lng,lat][]). */
function pointInRing(lng, lat, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0];
    const yi = ring[i][1];
    const xj = ring[j][0];
    const yj = ring[j][1];
    const intersect = yi > lat !== yj > lat && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

/** Track an element's size. Measures synchronously on mount (so we never
 *  depend on a ResizeObserver "initial" callback, which some embedded
 *  browsers don't deliver), then keeps it in sync via RO + window resize. */
function useElementSize() {
  const ref = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const measure = () => {
      const r = el.getBoundingClientRect();
      setSize((s) =>
        s.width === r.width && s.height === r.height ? s : { width: r.width, height: r.height }
      );
    };
    measure(); // immediate, reliable initial measurement
    let ro;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(measure);
      ro.observe(el);
    }
    window.addEventListener('resize', measure);
    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);
  return [ref, size];
}

const hexToRgb = (hex) => {
  const n = parseInt(hex.replace('#', ''), 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
};
const hexToRgba = (hex, a) => `rgba(${hexToRgb(hex)}, ${a})`;

export default function ChhauGlobe() {
  const globeRef = useRef(null);
  const [stageRef, { width, height }] = useElementSize();

  const [selected, setSelected] = useState(null);
  const [tooltip, setTooltip] = useState(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [globeReady, setGlobeReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [styleMode, setStyleMode] = useState('outline'); // 'outline' | 'hex'
  const [images, setImages] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeCat, setActiveCat] = useState(null);
  const [countries, setCountries] = useState(countriesCache || []);
  const [hoverPoly, setHoverPoly] = useState(null);

  const autoRotateRef = useRef(autoRotate);
  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);
  const bloomRef = useRef(null);

  // Dark "hologram" planet — lit by the scene so a soft terminator gives depth.
  const globeMaterial = useMemo(
    () =>
      new THREE.MeshPhongMaterial({
        color: 0x0e1730,
        specular: new THREE.Color(0x16243f),
        shininess: 10,
      }),
    []
  );

  // ---- Load country geometry once -----------------------------------------
  useEffect(() => {
    if (countriesCache) return undefined;
    let cancelled = false;
    fetch(COUNTRIES_URL)
      .then((r) => r.json())
      .then((geo) => {
        countriesCache = geo.features;
        if (!cancelled) setCountries(geo.features);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // ---- Derived data (memoised) --------------------------------------------
  const markerData = useMemo(
    () => chhauGeodata.map((d, i) => ({ ...d, _id: i })),
    []
  );

  const grouped = useMemo(() => {
    const map = Object.fromEntries(CATEGORIES.map((c) => [c.key, []]));
    markerData.forEach((d) => {
      (map[d.categorization] || (map[d.categorization] = [])).push(d);
    });
    return map;
  }, [markerData]);

  const countryCount = useMemo(
    () => new Set(chhauGeodata.map((d) => d.country)).size,
    []
  );

  // Split every country into individual polygons, flagging only the polygon
  // that actually contains a Chhau node as a host. This keeps overseas
  // territories (e.g. French Guiana, which has no node) from lighting up.
  const nodePoints = useMemo(() => chhauGeodata.map((d) => [d.lng, d.lat]), []);
  const polyFeatures = useMemo(() => {
    if (!countries.length) return [];
    const out = [];
    countries.forEach((f) => {
      const g = f.geometry;
      if (!g) return;
      const polys =
        g.type === 'Polygon' ? [g.coordinates] : g.type === 'MultiPolygon' ? g.coordinates : [];
      polys.forEach((rings) => {
        const host = nodePoints.some(([lng, lat]) => pointInRing(lng, lat, rings[0]));
        out.push({
          type: 'Feature',
          properties: f.properties,
          geometry: { type: 'Polygon', coordinates: rings },
          __host: host,
        });
      });
    });
    return out;
  }, [countries, nodePoints]);
  const isHost = useCallback((f) => !!f?.__host, []);

  // Glowing arcs radiating from the heartland to every node beyond India.
  const arcsData = useMemo(
    () =>
      markerData
        .filter((d) => d.country !== 'India')
        .map((d) => {
          const c = getStyleColor(d.style);
          return {
            startLat: ORIGIN.lat,
            startLng: ORIGIN.lng,
            endLat: d.lat,
            endLng: d.lng,
            cat: d.categorization,
            color: [hexToRgba(c, 0.03), hexToRgba(c, 0.95)],
            _gap: Math.random(),
          };
        }),
    [markerData]
  );

  const isolating = activeCat !== null;
  const visibleMarkers = useMemo(
    () => (isolating ? markerData.filter((d) => d.categorization === activeCat) : markerData),
    [markerData, isolating, activeCat]
  );
  const arcsForView = useMemo(
    () => (isolating ? arcsData.filter((a) => a.cat === activeCat) : arcsData),
    [arcsData, isolating, activeCat]
  );

  const ringsData = useMemo(
    () =>
      selected
        ? [{ lat: selected.lat, lng: selected.lng, color: getStyleColor(selected.style) }]
        : [],
    [selected]
  );

  // Active country geometry per render mode.
  const polyData = styleMode === 'outline' ? polyFeatures : [];
  const hexData = styleMode === 'hex' ? polyFeatures : [];

  // ---- Stable interaction handlers ----------------------------------------
  const focusNode = useCallback((d) => {
    setSelected(d);
    setAutoRotate(false);
    setMenuOpen(false);
    const g = globeRef.current;
    if (g) g.pointOfView({ lat: d.lat, lng: d.lng, altitude: 1.15 }, 1200);
  }, []);

  const resetView = useCallback(() => {
    setSelected(null);
    setActiveCat(null);
    setAutoRotate(true);
    const g = globeRef.current;
    if (g) g.pointOfView(HOME_POV, 1200);
  }, []);

  const toggleCat = useCallback((key) => {
    setActiveCat((prev) => (prev === key ? null : key));
    setSelected(null);
    setTooltip(null);
  }, []);

  const showTooltip = useCallback((d, evt) => {
    setTooltip({ data: d, x: evt.clientX, y: evt.clientY });
    const g = globeRef.current;
    if (g) g.controls().autoRotate = false;
  }, []);

  const hideTooltip = useCallback(() => {
    setTooltip(null);
    const g = globeRef.current;
    if (g) g.controls().autoRotate = autoRotateRef.current;
  }, []);

  const createMarker = useCallback(
    (d) => {
      const color = getStyleColor(d.style);
      const el = document.createElement('div');
      el.className = 'chhau-marker';
      el.style.setProperty('--mc', color);
      el.innerHTML =
        '<span class="marker-pulse"></span><span class="marker-pulse d2"></span><span class="marker-core"></span>';
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        focusNode(d);
      });
      el.addEventListener('mouseenter', (e) => showTooltip(d, e));
      el.addEventListener('mousemove', (e) => showTooltip(d, e));
      el.addEventListener('mouseleave', hideTooltip);
      return el;
    },
    [focusNode, showTooltip, hideTooltip]
  );

  // ---- Country polygon accessors ------------------------------------------
  const capColor = useCallback(
    (f) =>
      f === hoverPoly
        ? hexToRgba(ACCENT, 0.2)
        : isHost(f)
        ? hexToRgba(ACCENT, 0.07)
        : 'rgba(150,148,140,0.02)',
    [hoverPoly, isHost]
  );
  const strokeColor = useCallback(
    (f) => (isHost(f) || f === hoverPoly ? ACCENT : 'rgba(150,148,140,0.26)'),
    [hoverPoly, isHost]
  );
  const sideColor = useCallback(() => hexToRgba(ACCENT, 0.04), []);
  const polyAltitude = useCallback((f) => (f === hoverPoly ? 0.06 : 0.012), [hoverPoly]);
  const hexColor = useCallback(
    (f) => (isHost(f) ? ACCENT : 'rgba(150,148,140,0.4)'),
    [isHost]
  );

  // ---- Globe / camera side-effects ----------------------------------------
  useEffect(() => {
    const g = globeRef.current;
    if (!g || !globeReady) return undefined;
    const c = g.controls();
    c.enableDamping = true;
    c.dampingFactor = 0.075;
    c.rotateSpeed = 0.5;
    c.zoomSpeed = 0.9;
    c.minDistance = 108;
    c.maxDistance = 900;
    g.pointOfView(INTRO_POV, 0);
    const t = setTimeout(() => g.pointOfView(HOME_POV, 2800), 300);
    const l = setTimeout(() => setLoading(false), 600);
    return () => {
      clearTimeout(t);
      clearTimeout(l);
    };
  }, [globeReady]);

  useEffect(() => {
    const g = globeRef.current;
    if (!g || !globeReady) return;
    const c = g.controls();
    c.autoRotate = autoRotate;
    c.autoRotateSpeed = 0.45;
  }, [autoRotate, globeReady]);

  // Cinematic bloom — outlines, markers, arcs and atmosphere glow.
  useEffect(() => {
    const g = globeRef.current;
    if (!g || !globeReady) return undefined;
    const composer = g.postProcessingComposer();
    const bloom = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.45,
      0.4,
      0
    );
    bloomRef.current = bloom;
    composer.addPass(bloom);
    return () => {
      composer.removePass?.(bloom);
      bloom.dispose?.();
      bloomRef.current = null;
    };
  }, [globeReady]);

  // Lazily fetch a representative photo for the focused node (unless it has a
  // pinned, hand-verified image).
  useEffect(() => {
    if (selected?.img) return undefined;
    const w = selected?.wiki;
    if (!w) return undefined;
    let cancelled = false;
    fetchWikiImage(w).then((src) => {
      if (!cancelled) setImages((prev) => (w in prev ? prev : { ...prev, [w]: src }));
    });
    return () => {
      cancelled = true;
    };
  }, [selected]);

  const heroKey = selected?.wiki;
  const heroSrc = selected?.img ?? (heroKey ? images[heroKey] : undefined);
  const heroLoading = selected?.img ? false : heroKey ? !(heroKey in images) : false;

  return (
    <div className="chhau-app">
      {/* --------------------------- LOADING --------------------------- */}
      <div className={`loader${loading ? '' : ' done'}`}>
        <div className="loader-inner">
          <span className="loader-kicker">An Interactive Atlas</span>
          <h1 className="loader-title">
            Map of <em>Chhau</em>
          </h1>
          <div className="loader-rule">
            <span />
          </div>
          <span className="loader-sub">Charting a living tradition across the world</span>
        </div>
      </div>

      {/* ----------------------------- SIDEBAR ----------------------------- */}
      <aside className={`sidebar${menuOpen ? ' open' : ''}`}>
        <div className="brand">
          <span className="brand-kicker">An Interactive Atlas</span>
          <h1 className="brand-title">
            Map of <em>Chhau</em>
          </h1>
        </div>

        {isolating && (
          <button className="show-all" onClick={() => setActiveCat(null)}>
            Showing {CATEGORIES.find((c) => c.key === activeCat)?.label} — view all
          </button>
        )}

        <div className="cat-scroll">
          {CATEGORIES.map((cat, i) => {
            const dim = isolating && activeCat !== cat.key;
            return (
              <section
                className={`cat${activeCat === cat.key ? ' active' : ''}${dim ? ' dim' : ''}`}
                key={cat.key}
              >
                <button className="cat-head" onClick={() => toggleCat(cat.key)}>
                  <span className="cat-index">{String(i + 1).padStart(2, '0')}</span>
                  <span className="cat-titles">
                    <span className="cat-title">{cat.label}</span>
                    <span className="cat-blurb">{cat.blurb}</span>
                  </span>
                  <span className="cat-count">{grouped[cat.key]?.length || 0}</span>
                </button>
                <ul className={`loc-list${dim ? ' collapsed' : ''}`}>
                  {grouped[cat.key]?.map((d) => {
                    const active = selected && selected._id === d._id;
                    return (
                      <li key={d._id}>
                        <button
                          className={`loc${active ? ' active' : ''}`}
                          style={{ '--mc': getStyleColor(d.style) }}
                          onClick={() => focusNode(d)}
                        >
                          <span className="loc-dot" />
                          <span className="loc-text">
                            <span className="loc-city">{d.city}</span>
                            <span className="loc-meta">
                              {d.country} · {d.style}
                            </span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>

        <div className="legend">
          {Object.entries(STYLE_COLORS).map(([name, color]) => (
            <div className="legend-item" key={name}>
              <span className="legend-dot" style={{ background: color }} />
              {name}
            </div>
          ))}
        </div>
      </aside>

      {/* ------------------------------ STAGE ------------------------------ */}
      <div className="globe-stage" ref={stageRef}>
        <div className="stage-vignette" />

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle locations panel"
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        <header className="stage-header">
          <span className="title-kicker">Interactive Atlas</span>
          <h2>
            Map of <em>Chhau</em>
          </h2>
          <p>
            {chhauGeodata.length} nodes · {countryCount} countries · roots, stages &amp; diaspora
          </p>
        </header>

        {width > 0 && height > 0 && (
          <Globe
            ref={globeRef}
            width={width}
            height={height}
            onGlobeReady={() => setGlobeReady(true)}
            rendererConfig={{ antialias: true, alpha: true }}
            globeMaterial={globeMaterial}
            backgroundImageUrl={BG_IMG}
            backgroundColor="#04050c"
            showAtmosphere
            atmosphereColor="#5a6b7a"
            atmosphereAltitude={0.15}
            // --- country outlines ---
            polygonsData={polyData}
            polygonCapColor={capColor}
            polygonSideColor={sideColor}
            polygonStrokeColor={strokeColor}
            polygonAltitude={polyAltitude}
            polygonsTransitionDuration={300}
            onPolygonHover={setHoverPoly}
            polygonLabel={(f) =>
              `<div class="poly-label">${f.properties.ADMIN}${
                isHost(f) ? ' <b>· Chhau presence</b>' : ''
              }</div>`
            }
            // --- hex-dot countries (alt style) ---
            hexPolygonsData={hexData}
            hexPolygonResolution={3}
            hexPolygonMargin={0.35}
            hexPolygonColor={hexColor}
            hexPolygonAltitude={0.012}
            // --- glowing arcs: heartland -> world ---
            arcsData={arcsForView}
            arcColor={(d) => d.color}
            arcAltitudeAutoScale={0.5}
            arcStroke={0.5}
            arcDashLength={0.45}
            arcDashGap={0.6}
            arcDashInitialGap={(d) => d._gap}
            arcDashAnimateTime={4200}
            arcsTransitionDuration={400}
            // --- custom interactive neon markers ---
            htmlElementsData={visibleMarkers}
            htmlElement={createMarker}
            htmlElementVisibilityModifier={(el, isVisible) => {
              el.style.opacity = isVisible ? '1' : '0';
              el.style.pointerEvents = isVisible ? 'auto' : 'none';
            }}
            // --- expanding highlight ring under the focused node ---
            ringsData={ringsData}
            ringColor={(r) => (t) => `rgba(${hexToRgb(r.color)}, ${Math.sqrt(1 - t)})`}
            ringMaxRadius={3.5}
            ringPropagationSpeed={2}
            ringRepeatPeriod={900}
            onGlobeClick={() => setTooltip(null)}
          />
        )}

        {/* floating control bar */}
        <div className="stage-controls">
          <button
            className="ctl"
            onClick={() => setStyleMode((s) => (s === 'outline' ? 'hex' : 'outline'))}
          >
            {styleMode === 'outline' ? 'Hex' : 'Outline'}
          </button>
          <span className="ctl-sep" />
          <button
            className={`ctl${autoRotate ? ' on' : ''}`}
            onClick={() => setAutoRotate((a) => !a)}
          >
            {autoRotate ? 'Pause' : 'Rotate'}
          </button>
          <span className="ctl-sep" />
          <button className="ctl" onClick={resetView}>
            Reset
          </button>
        </div>

        {/* focused-node detail card */}
        {selected && (
          <div className="detail-card" style={{ '--mc': getStyleColor(selected.style) }}>
            <button
              className="detail-close"
              onClick={() => setSelected(null)}
              aria-label="Close"
            >
              ✕
            </button>
            <div className="detail-hero">
              {heroSrc ? (
                <img src={heroSrc} alt={selected.city} loading="lazy" />
              ) : (
                <div className={`hero-fallback${heroLoading ? ' loading' : ''}`}>
                  <span>{selected.city}</span>
                </div>
              )}
              <span className="detail-style">{selected.style}</span>
            </div>
            <div className="detail-body">
              <h3 className="detail-city">{selected.city}</h3>
              <span className="detail-country">
                {selected.region ? `${selected.region} · ` : ''}
                {selected.country}
              </span>
              <p className="detail-role">{selected.role}</p>
              {selected.detail && <p className="detail-extra">{selected.detail}</p>}
              <div className="detail-figs">
                <span className="detail-label">Key Institutions / Lineage</span>
                {selected.keyFigures}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ---------------------------- TOOLTIP ------------------------------ */}
      {tooltip && (
        <div
          className="tooltip-card"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            '--mc': getStyleColor(tooltip.data.style),
          }}
        >
          <div className="tt-style">{tooltip.data.style}</div>
          <div className="tt-city">
            {tooltip.data.city}, {tooltip.data.country}
          </div>
          {tooltip.data.region && <div className="tt-region">{tooltip.data.region}</div>}
          <div className="tt-role">{tooltip.data.role}</div>
          <div className="tt-key">
            <b>Key:</b> {tooltip.data.keyFigures}
          </div>
        </div>
      )}
    </div>
  );
}
