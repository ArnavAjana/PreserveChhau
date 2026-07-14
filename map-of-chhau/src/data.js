// Evidence-first atlas records.
//
// Publication rule: a marker is included only when an official primary source
// supports the Chhau-specific claim attached to that place. A map coordinate
// locates the named place; it does not imply an origin, resident tradition, or
// performance history beyond the words in `detail`.
//
// Research leads are intentionally excluded from the public dataset. They can
// return only after a source review and with the metadata required below.

const VERIFIED_AT = '2026-07-14';

export const chhauGeodata = [
  {
    id: 'purulia-charida',
    status: 'verified',
    recordType: 'living-tradition',
    style: 'Purulia',
    city: 'Charida',
    country: 'India',
    region: 'Purulia district, West Bengal',
    lat: 23.2,
    lng: 86.03,
    role: 'Officially documented Purulia Chhau mask-making village',
    detail:
      'Purulia District Administration identifies “Chorida” as a small village in the district where, during the Chhau season, practically every house takes part in making masks or assembling headgear. This marker records that documented craft role.',
    sourceTitle: 'Folk & Culture — Purulia District Administration',
    sourceUrl: 'https://purulia.gov.in/folk-culture/',
    evidenceType: 'Government district cultural record',
    date: 'Page last updated 29 June 2026',
    verifiedAt: VERIFIED_AT,
    categorization: 'heartland',
  },
  {
    id: 'seraikella-seraikela',
    status: 'verified',
    recordType: 'living-tradition',
    style: 'Seraikella',
    city: 'Seraikella',
    country: 'India',
    region: 'Seraikela-Kharsawan district, Jharkhand',
    lat: 22.7,
    lng: 85.93,
    role: 'Officially documented Seraikella Chhau centre',
    detail:
      'The Seraikela-Kharsawan District Administration identifies the district with Chhau and describes Seraikella Chhau as using masks to identify characters in performances associated with the annual spring season.',
    sourceTitle: 'Culture & Heritage — Seraikela-Kharsawan District Administration',
    sourceUrl: 'https://seraikela.nic.in/culture-heritage/',
    evidenceType: 'Government district cultural record',
    date: 'Page last updated 9 July 2026',
    verifiedAt: VERIFIED_AT,
    categorization: 'heartland',
  },
  {
    id: 'mayurbhanj-baripada',
    status: 'verified',
    recordType: 'living-tradition',
    style: 'Mayurbhanj',
    city: 'Baripada',
    country: 'India',
    region: 'Mayurbhanj district, Odisha',
    lat: 21.932,
    lng: 86.751,
    role: 'District-headquarters map anchor for Mayurbhanj Chhau',
    detail:
      'Baripada is used here only as the mapped headquarters of Mayurbhanj district. The district administration identifies Chhau as part of Mayurbhanj’s cultural heritage and describes the form as known for beauty and vigour. This marker does not claim that Baripada is Chhau’s origin.',
    sourceTitle: 'Culture & Heritage — Mayurbhanj District Administration',
    sourceUrl: 'https://mayurbhanj.odisha.gov.in/en/tourism/culture-Heritage',
    secondarySourceTitle: 'Mayurbhanj District at a Glance — Government of Odisha',
    secondarySourceUrl: 'https://mayurbhanj.odisha.gov.in/en',
    evidenceType: 'Government district cultural record',
    date: 'Page last updated 13 July 2026',
    verifiedAt: VERIFIED_AT,
    categorization: 'heartland',
  },
  {
    id: 'unesco-nairobi-2010',
    status: 'verified',
    recordType: 'documentary-milestone',
    style: 'All Styles',
    city: 'Nairobi',
    country: 'Kenya',
    region: 'Nairobi County',
    lat: -1.286,
    lng: 36.817,
    role: 'Venue of UNESCO’s 2010 Chhau inscription decision',
    detail:
      'At its fifth session in Nairobi, Kenya, UNESCO’s Intergovernmental Committee inscribed Chhau dance on the Representative List. UNESCO’s element record describes three distinct styles: Seraikella, Purulia and Mayurbhanj. Nairobi is the decision venue, not a Chhau heartland.',
    sourceTitle: 'Fifth session of the Intergovernmental Committee (5.COM)',
    sourceUrl: 'https://ich.unesco.org/en/5com',
    secondarySourceTitle: 'Chhau dance — Representative List of the Intangible Cultural Heritage of Humanity',
    secondarySourceUrl: 'https://ich.unesco.org/en/RL/chhau-dance-00337',
    evidenceType: 'UNESCO fifth-session record and element record',
    date: 'Fifth session, Nairobi · 15–19 November 2010',
    verifiedAt: VERIFIED_AT,
    categorization: 'milestone',
  },
];

// Style -> earth-pigment hue (muted, harmonious — a printed-atlas legend, not neon).
export const STYLE_COLORS = {
  Purulia: '#cf6a4a', // warm clay
  Seraikella: '#5f8f8a', // muted teal
  Mayurbhanj: '#c6a052', // ochre
  'All Styles': '#8c9a60', // sage
};

export function getStyleColor(style) {
  return STYLE_COLORS[style] || '#9a9183';
}

export const CATEGORIES = [
  {
    key: 'heartland',
    label: 'Living Heartlands',
    blurb: 'Officially documented regional anchors',
  },
  {
    key: 'milestone',
    label: 'Documentary Milestone',
    blurb: 'UNESCO committee record',
  },
];
