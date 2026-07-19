import { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import Globe from 'react-globe.gl';
import {
  chhauGeodata,
  STYLE_COLORS,
  CATEGORIES,
  getStyleColor,
} from './data';
import './ChhauGlobe.css';

// Vector globe with no raster earth. Both resources are bundled locally so the
// atlas remains usable when a school network blocks third-party CDNs.
const COUNTRIES_URL = './data/countries.geojson';

const ACCENT = '#c6b58f'; // warm paper highlight for countries with records

// Camera vantage points.
const HOME_POV = { lat: 18, lng: 80, altitude: 2.5 };
const INTRO_POV = { lat: 18, lng: 80, altitude: 4.5 };

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
      const next = {
        width: Math.max(0, Math.round(r.width)),
        height: Math.max(0, Math.round(r.height)),
      };
      setSize((s) =>
        s.width === next.width && s.height === next.height ? s : next
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

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, [query]);
  return matches;
}

const hexToRgb = (hex) => {
  const n = parseInt(hex.replace('#', ''), 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
};
const hexToRgba = (hex, a) => `rgba(${hexToRgb(hex)}, ${a})`;
const escapeHtml = (value) =>
  String(value ?? '').replace(
    /[&<>"']/g,
    (character) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[
        character
      ],
  );

export default function ChhauGlobe() {
  const globeRef = useRef(null);
  const menuToggleRef = useRef(null);
  const menuWasOpenRef = useRef(false);
  const sidebarRef = useRef(null);
  const detailCloseRef = useRef(null);
  const hadSelectionRef = useRef(false);
  const selectionTriggerRef = useRef(null);
  const [stageRef, { width, height }] = useElementSize();

  const [selected, setSelected] = useState(null);
  const [tooltip, setTooltip] = useState(null);
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const coarsePointer = useMediaQuery('(hover: none), (pointer: coarse)');
  const mobileLayout = useMediaQuery('(max-width: 860px)');
  // The atlas opens as a still reference map. Rotation is available only as
  // an explicit reader choice, rather than as ambient motion.
  const [autoRotate, setAutoRotate] = useState(false);
  const [globeReady, setGlobeReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeCat, setActiveCat] = useState(null);
  const [query, setQuery] = useState('');
  const [countries, setCountries] = useState(countriesCache || []);
  const [hoverPoly, setHoverPoly] = useState(null);
  const [mapError, setMapError] = useState('');

  const autoRotateRef = useRef(autoRotate);
  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const stopRotation = (event) => {
      if (event.matches) setAutoRotate(false);
    };
    media.addEventListener('change', stopRotation);
    return () => media.removeEventListener('change', stopRotation);
  }, []);
  // A warm, low-gloss globe: closer to an archival teaching model than a
  // cinematic planet.
  const globeMaterial = useMemo(
    () =>
      new THREE.MeshPhongMaterial({
        color: 0x45483e,
        specular: new THREE.Color(0x77705e),
        shininess: 3,
      }),
    []
  );

  // ---- Load country geometry once -----------------------------------------
  useEffect(() => {
    if (countriesCache) return undefined;
    let cancelled = false;
    fetch(COUNTRIES_URL)
      .then((r) => {
        if (!r.ok) throw new Error(`Country data returned ${r.status}`);
        return r.json();
      })
      .then((geo) => {
        if (!Array.isArray(geo?.features)) {
          throw new Error('Country data is not valid GeoJSON');
        }
        countriesCache = geo.features;
        if (!cancelled) setCountries(geo.features);
      })
      .catch(() => {
        if (!cancelled) {
          setMapError('Country outlines did not load. Location markers remain available.');
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // ---- Derived data (memoised) --------------------------------------------
  const markerData = useMemo(
    () => chhauGeodata.map((d, i) => ({ ...d, _id: i })),
    []
  );

  const filteredMarkers = useMemo(() => {
    const term = query.trim().toLocaleLowerCase();
    if (!term) return markerData;
    return markerData.filter((record) =>
      [
        record.venue,
        record.city,
        record.country,
        record.region,
        record.style,
        record.eventName,
        record.performer,
        record.date,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLocaleLowerCase().includes(term)),
    );
  }, [markerData, query]);

  const grouped = useMemo(() => {
    const map = Object.fromEntries(CATEGORIES.map((c) => [c.key, []]));
    filteredMarkers.forEach((d) => {
      (map[d.categorization] || (map[d.categorization] = [])).push(d);
    });
    return map;
  }, [filteredMarkers]);

  const countryCount = useMemo(
    () => new Set(chhauGeodata.map((d) => d.country)).size,
    []
  );
  const venueCount = useMemo(
    () => chhauGeodata.filter((d) => d.recordType === 'performance-venue').length,
    [],
  );

  // Split every country into individual polygons. Flag only the polygon
  // containing a Chhau node as a host. This keeps overseas
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

  const isolating = activeCat !== null;
  const visibleMarkers = useMemo(
    () =>
      isolating
        ? filteredMarkers.filter((d) => d.categorization === activeCat)
        : filteredMarkers,
    [filteredMarkers, isolating, activeCat]
  );
  // ---- Stable interaction handlers ----------------------------------------
  const focusNode = useCallback((d) => {
    if (document.activeElement instanceof HTMLElement) {
      selectionTriggerRef.current = document.activeElement;
    }
    setSelected(d);
    setAutoRotate(false);
    setMenuOpen(false);
    const g = globeRef.current;
    if (g) {
      g.pointOfView(
        { lat: d.lat, lng: d.lng, altitude: 1.15 },
        reduceMotion ? 0 : 1200,
      );
    }
  }, [reduceMotion]);

  const resetView = useCallback(() => {
    setSelected(null);
    setActiveCat(null);
    setQuery('');
    setAutoRotate(false);
    const g = globeRef.current;
    if (g) g.pointOfView(HOME_POV, reduceMotion ? 0 : 1200);
  }, [reduceMotion]);

  const toggleCat = useCallback((key) => {
    setActiveCat((prev) => (prev === key ? null : key));
    setSelected(null);
    setTooltip(null);
  }, []);

  const showTooltip = useCallback((d, evt) => {
    if (coarsePointer) return;
    const halfWidth = 138;
    const x = Math.min(
      Math.max(evt.clientX, halfWidth),
      Math.max(halfWidth, window.innerWidth - halfWidth),
    );
    const y = Math.max(evt.clientY, 178);
    setTooltip({ data: d, x, y });
    const g = globeRef.current;
    if (g) g.controls().autoRotate = false;
  }, [coarsePointer]);

  const hideTooltip = useCallback(() => {
    setTooltip(null);
    const g = globeRef.current;
    if (g) g.controls().autoRotate = autoRotateRef.current;
  }, []);

  const createMarker = useCallback(
    (d) => {
      const color = getStyleColor(d.style);
      const el = document.createElement('button');
      el.type = 'button';
      el.className = 'chhau-marker';
      el.style.setProperty('--mc', color);
      const placeLabel = d.venue ? `${d.venue}, ${d.city}` : d.city;
      el.setAttribute('aria-label', `Open ${placeLabel}, ${d.country}. ${d.style}`);
      el.title = `${placeLabel}, ${d.country}`;
      el.innerHTML = '<span class="marker-core"></span>';
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
    g.pointOfView(reduceMotion ? HOME_POV : INTRO_POV, 0);
    const t = setTimeout(
      () => g.pointOfView(HOME_POV, reduceMotion ? 0 : 2200),
      reduceMotion ? 0 : 220,
    );
    const l = setTimeout(() => setLoading(false), reduceMotion ? 80 : 520);
    return () => {
      clearTimeout(t);
      clearTimeout(l);
    };
  }, [globeReady, reduceMotion]);

  useEffect(() => {
    const g = globeRef.current;
    if (!g || !globeReady) return;
    g.renderer().setPixelRatio(
      Math.min(window.devicePixelRatio || 1, reduceMotion || width < 700 ? 1.25 : 1.6),
    );
  }, [globeReady, reduceMotion, width]);

  // Never leave the reader behind a loader if WebGL initialisation is slow or
  // unavailable. The sidebar still provides access to every mapped location.
  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 5000);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const g = globeRef.current;
    if (!g || !globeReady) return;
    const c = g.controls();
    c.autoRotate = autoRotate;
    c.autoRotateSpeed = 0.45;
  }, [autoRotate, globeReady]);

  useEffect(() => {
    function handleEscape(event) {
      if (event.key !== 'Escape') return;
      setMenuOpen(false);
      setSelected(null);
      setTooltip(null);
    }
    function handleTab(event) {
      if (event.key !== 'Tab' || !mobileLayout || !menuOpen || !sidebarRef.current) return;
      const focusable = Array.from(
        sidebarRef.current.querySelectorAll(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter(
        (element) => element.getClientRects().length > 0 && !element.closest('[inert]')
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener('keydown', handleEscape);
    document.addEventListener('keydown', handleTab);
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('keydown', handleTab);
    };
  }, [menuOpen, mobileLayout]);

  useEffect(() => {
    if (!mobileLayout) {
      menuWasOpenRef.current = false;
      return undefined;
    }

    const frame = window.requestAnimationFrame(() => {
      if (menuOpen) {
        menuWasOpenRef.current = true;
        sidebarRef.current?.querySelector('button:not([disabled])')?.focus();
      } else if (menuWasOpenRef.current) {
        menuWasOpenRef.current = false;
        menuToggleRef.current?.focus();
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [menuOpen, mobileLayout]);

  useEffect(() => {
    const hadSelection = hadSelectionRef.current;
    hadSelectionRef.current = Boolean(selected);

    const frame = window.requestAnimationFrame(() => {
      if (selected) {
        detailCloseRef.current?.focus();
        return;
      }
      if (!hadSelection) return;
      const previous = selectionTriggerRef.current;
      if (!mobileLayout && previous?.isConnected && !previous.closest('[inert]')) {
        previous.focus();
      } else {
        menuToggleRef.current?.focus();
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [selected, mobileLayout]);

  return (
    <div className="chhau-app">
      {/* --------------------------- LOADING --------------------------- */}
      <div
        aria-hidden={!loading}
        aria-live="polite"
        className={`loader${loading ? '' : ' done'}`}
        role="status"
      >
        <div className="loader-inner">
          <span className="loader-kicker">The Science of Chhau Dance</span>
          <h1 className="loader-title">
            Field <em>Atlas</em>
          </h1>
          <div className="loader-rule">
            <span />
          </div>
          <span className="loader-sub">
            Source-linked heartlands, records and performance venues.
          </span>
        </div>
      </div>

      {/* ----------------------------- SIDEBAR ----------------------------- */}
      <aside
        aria-hidden={mobileLayout && !menuOpen}
        aria-label="Chhau field atlas locations"
        aria-modal={mobileLayout && menuOpen ? true : undefined}
        className={`sidebar${menuOpen ? ' open' : ''}`}
        id="atlas-locations"
        inert={mobileLayout && !menuOpen}
        ref={sidebarRef}
        role={mobileLayout && menuOpen ? 'dialog' : undefined}
      >
        <button
          aria-label="Close locations panel"
          className="sidebar-mobile-close"
          onClick={() => setMenuOpen(false)}
          type="button"
        >
          Close
        </button>
        <div className="brand">
          <span className="brand-kicker">The Science of Chhau Dance</span>
          <h1 className="brand-title">
            Field <em>Atlas</em>
          </h1>
        </div>

        <div className="atlas-search">
          <label className="atlas-search-label" htmlFor="atlas-search-input">
            Find a venue or place
          </label>
          <div className="atlas-search-control">
            <input
              autoComplete="off"
              id="atlas-search-input"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Venue, city, country, style"
              type="search"
              value={query}
            />
            {query ? (
              <button
                aria-label="Clear atlas search"
                onClick={() => setQuery('')}
                type="button"
              >
                Clear
              </button>
            ) : null}
          </div>
          {query ? (
            <p className="atlas-search-count" role="status">
              {filteredMarkers.length} matching {filteredMarkers.length === 1 ? 'record' : 'records'}
            </p>
          ) : null}
        </div>

        {isolating && (
          <button className="show-all" onClick={() => setActiveCat(null)} type="button">
            Showing {CATEGORIES.find((c) => c.key === activeCat)?.label}. View all.
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
                <button
                  aria-controls={`locations-${cat.key}`}
                  aria-expanded={!dim}
                  className="cat-head"
                  onClick={() => toggleCat(cat.key)}
                  type="button"
                >
                  <span className="cat-index">{String(i + 1).padStart(2, '0')}</span>
                  <span className="cat-titles">
                    <span className="cat-title">{cat.label}</span>
                    <span className="cat-blurb">{cat.blurb}</span>
                  </span>
                  <span className="cat-count">{grouped[cat.key]?.length || 0}</span>
                </button>
                <ul
                  className={`loc-list${dim ? ' collapsed' : ''}`}
                  id={`locations-${cat.key}`}
                >
                  {grouped[cat.key]?.map((d) => {
                    const active = selected && selected._id === d._id;
                    return (
                      <li key={d._id}>
                        <button
                          aria-current={active ? 'location' : undefined}
                          className={`loc${active ? ' active' : ''}`}
                          style={{ '--mc': getStyleColor(d.style) }}
                          onClick={() => focusNode(d)}
                          type="button"
                        >
                          <span className="loc-dot" />
                          <span className="loc-text">
                            <span className="loc-city">{d.venue ?? d.city}</span>
                            <span className="loc-meta">
                              {d.venue
                                ? `${d.city} · ${d.country}`
                                : `${d.country} · ${d.style}`}
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
          {filteredMarkers.length === 0 ? (
            <p className="atlas-search-empty">No verified record matches this search.</p>
          ) : null}
        </div>

        <div className="legend">
          {Object.entries(STYLE_COLORS).map(([name, color]) => (
            <div className="legend-item" key={name}>
              <span className="legend-dot" style={{ background: color }} />
              {name}
            </div>
          ))}
        </div>
        <p className="atlas-note">
          Every marker links to Chhau-specific evidence. Venue markers document
          one performance record. They do not claim a resident tradition or a
          complete world performance history.
        </p>
      </aside>

      {menuOpen ? (
        <button
          aria-label="Close locations panel"
          className="sidebar-backdrop"
          onClick={() => setMenuOpen(false)}
          tabIndex={-1}
          type="button"
        />
      ) : null}

      {/* ------------------------------ STAGE ------------------------------ */}
      <div
        className="globe-stage"
        inert={mobileLayout && menuOpen}
        ref={stageRef}
      >
        <div className="stage-vignette" />

        <button
          aria-controls="atlas-locations"
          aria-expanded={menuOpen}
          className="menu-toggle"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? 'Close locations panel' : 'Open locations panel'}
          ref={menuToggleRef}
          type="button"
        >
          {menuOpen ? 'Close' : 'Menu'}
        </button>

        <header className="stage-header">
          <span className="title-kicker">Source map · verified records</span>
          <h2>
            Where the record places <em>Chhau</em>
          </h2>
          <p>
            {chhauGeodata.length} verified records. {venueCount} documented venues.{' '}
            {countryCount} countries. Three styles.
          </p>
        </header>

        {mapError ? (
          <p className="map-error" role="status">
            {mapError}
          </p>
        ) : null}

        {width > 0 && height > 0 && (
          <Globe
            ref={globeRef}
            width={width}
            height={height}
            onGlobeReady={() => setGlobeReady(true)}
            rendererConfig={{
              antialias: !reduceMotion && width >= 640,
              alpha: true,
              powerPreference: 'high-performance',
            }}
            globeMaterial={globeMaterial}
            backgroundColor="#171a17"
            showAtmosphere
            atmosphereColor="#8f8065"
            atmosphereAltitude={0.11}
            // --- country outlines ---
            polygonsData={polyFeatures}
            polygonCapColor={capColor}
            polygonSideColor={sideColor}
            polygonStrokeColor={strokeColor}
            polygonAltitude={polyAltitude}
            polygonsTransitionDuration={300}
            onPolygonHover={setHoverPoly}
            polygonLabel={(f) =>
              `<div class="poly-label">${escapeHtml(f.properties.ADMIN)}${
                isHost(f) ? ' <b>· verified atlas record</b>' : ''
              }</div>`
            }
            // --- custom interactive field-map markers ---
            htmlElementsData={visibleMarkers}
            htmlElement={createMarker}
            htmlElementVisibilityModifier={(el, isVisible) => {
              el.style.opacity = isVisible ? '1' : '0';
              el.style.pointerEvents = isVisible ? 'auto' : 'none';
            }}
            onGlobeClick={() => setTooltip(null)}
          />
        )}

        {/* floating control bar */}
        <div aria-label="Atlas view controls" className="stage-controls" role="group">
          <button
            aria-pressed={autoRotate}
            className={`ctl${autoRotate ? ' on' : ''}`}
            onClick={() => setAutoRotate((a) => !a)}
            type="button"
          >
            {autoRotate ? 'Stop rotation' : 'Rotate globe'}
          </button>
          <span className="ctl-sep" />
          <button className="ctl" onClick={resetView} type="button">
            Reset
          </button>
        </div>

        {/* focused-node detail card */}
        {selected && (
          <section
            aria-label={`${selected.venue ?? selected.city} map details`}
            aria-live="polite"
            className="detail-card"
            style={{ '--mc': getStyleColor(selected.style) }}
          >
            <button
              className="detail-close"
              onClick={() => setSelected(null)}
              aria-label={`Close details for ${selected.venue ?? selected.city}`}
              ref={detailCloseRef}
              type="button"
            >
              Close
            </button>
            <div className="detail-body">
              <div className="detail-heading">
                <span className="detail-style">{selected.style}</span>
                <span className="detail-record">{selected.recordType.replaceAll('-', ' ')}</span>
              </div>
              <p className="detail-status">
                {selected.recordType === 'performance-venue'
                  ? 'Verified venue record.'
                  : 'Verified source record.'}{' '}
                {selected.evidenceType}
              </p>
              <h3 className="detail-city">{selected.venue ?? selected.city}</h3>
              <span className="detail-country">
                {selected.venue ? `${selected.city}. ` : ''}
                {selected.region ? `${selected.region}. ` : ''}
                {selected.country}
              </span>
              <p className="detail-role">{selected.role}</p>
              {selected.detail && <p className="detail-extra">{selected.detail}</p>}
              <div className="detail-source">
                <span className="detail-label">
                  {selected.sourceLabel ?? 'Official source'}
                </span>
                <a href={selected.sourceUrl} rel="noreferrer" target="_blank">
                  {selected.sourceTitle}
                </a>
                {selected.secondarySourceUrl ? (
                  <a href={selected.secondarySourceUrl} rel="noreferrer" target="_blank">
                    {selected.secondarySourceTitle}
                  </a>
                ) : null}
                <dl className="detail-evidence">
                  {selected.eventName ? (
                    <div>
                      <dt>Event</dt>
                      <dd>{selected.eventName}</dd>
                    </div>
                  ) : null}
                  {selected.performer ? (
                    <div>
                      <dt>Artist</dt>
                      <dd>{selected.performer}</dd>
                    </div>
                  ) : null}
                  <div>
                    <dt>Record date</dt>
                    <dd>{selected.date}</dd>
                  </div>
                  {selected.coordinateBasis ? (
                    <div>
                      <dt>Map point</dt>
                      <dd>{selected.coordinateBasis}</dd>
                    </div>
                  ) : null}
                  <div>
                    <dt>Checked</dt>
                    <dd>{selected.verifiedAt}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </section>
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
            {tooltip.data.venue ?? tooltip.data.city}
          </div>
          {tooltip.data.venue ? (
            <div className="tt-region">
              {tooltip.data.city}, {tooltip.data.country}
            </div>
          ) : null}
          {!tooltip.data.venue && tooltip.data.region ? (
            <div className="tt-region">{tooltip.data.region}</div>
          ) : null}
          <div className="tt-role">{tooltip.data.role}</div>
          <div className="tt-key">
            <b>Evidence:</b> {tooltip.data.evidenceType}
          </div>
        </div>
      )}
    </div>
  );
}
