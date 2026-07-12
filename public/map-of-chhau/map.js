const places = {
  mayurbhanj: {
    state: "Odisha",
    name: "Mayurbhanj Chhau",
    signal: "Unmasked · centred around Baripada",
    description:
      "The tradition at the centre of this eBook. Stance, torso, travel, rhythm, focus, and group design carry the performance while the face remains visible.",
    watch: "How the whole body organises direction and weight.",
    note: "Unmasked does not mean driven mainly by facial acting.",
  },
  seraikella: {
    state: "Jharkhand",
    name: "Seraikella Chhau",
    signal: "Masked · centred around Seraikella",
    description:
      "A masked tradition with important court histories. A fixed face becomes readable through head angle, body design, timing, relationship, and stillness.",
    watch: "How a small change around the mask alters the entire image.",
    note: "A fixed mask does not create a fixed expression.",
  },
  purulia: {
    state: "West Bengal",
    name: "Purulia Chhau",
    signal: "Masked · carried across Purulia district",
    description:
      "A festival-scale tradition shaped by vigorous movement, bold silhouettes, musicians, village troupes, and maker-led mask and costume craft.",
    watch: "How mask, headgear, cloth, and movement remain legible at distance.",
    note: "Spectacle should not hide the dancer’s technique or the maker’s work.",
  },
};

const fields = {
  state: document.querySelector("#place-state"),
  name: document.querySelector("#place-name"),
  signal: document.querySelector("#place-signal"),
  description: document.querySelector("#place-description"),
  watch: document.querySelector("#place-watch"),
  note: document.querySelector("#place-note"),
};

const controls = Array.from(document.querySelectorAll("[data-place]"));

function selectPlace(placeId) {
  const place = places[placeId];
  if (!place) return;

  Object.entries(fields).forEach(([key, element]) => {
    if (element) element.textContent = place[key];
  });

  controls.forEach((control) => {
    const active = control.dataset.place === placeId;
    control.classList.toggle("is-active", active);
    control.setAttribute("aria-pressed", active ? "true" : "false");
    if (control.classList.contains("place-tab")) {
      control.setAttribute("aria-current", active ? "true" : "false");
    }
  });
}

controls.forEach((control) => {
  control.addEventListener("click", () => selectPlace(control.dataset.place));
});

selectPlace("mayurbhanj");
