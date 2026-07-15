// Evidence-first atlas records.
//
// Publication rule: a marker is included only when an official primary source
// supports the Chhau-specific claim attached to each place. A map coordinate
// locates the named place; it does not imply an origin, resident tradition, or
// performance history beyond the words in `detail`.
//
// Research leads are intentionally excluded from the public dataset. Return
// them only after source review and with the metadata required below.

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
    role: 'A documented Purulia Chhau mask-making village',
    detail:
      'Purulia District Administration identifies “Chorida” as a small village where practically every house makes masks or assembles headgear during the Chhau season. This marker records its documented role in Purulia Chhau mask making.',
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
    role: 'A documented centre for Seraikella Chhau',
    detail:
      'Seraikela-Kharsawan District Administration links the district with Chhau. It describes Seraikella Chhau performers using masks to identify characters during performances linked to the annual spring season.',
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
    role: 'District headquarters used as a map anchor for Mayurbhanj Chhau',
    detail:
      'This map uses Baripada only as the headquarters of Mayurbhanj district. The district administration lists Chhau as part of Mayurbhanj’s cultural heritage and describes the form as known for beauty and vigour. The marker makes no origin claim for Baripada.',
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
      'UNESCO’s Intergovernmental Committee inscribed Chhau dance on the Representative List during its fifth session in Nairobi, Kenya. The element record names three distinct styles: Seraikella, Purulia and Mayurbhanj. Nairobi marks the decision venue. It is not a Chhau heartland.',
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

// Style -> earth-pigment hue. The palette reads like a printed atlas, not neon.
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
    blurb: 'Documented regional anchors',
  },
  {
    key: 'milestone',
    label: 'Documentary Milestone',
    blurb: 'UNESCO committee record',
  },
];
