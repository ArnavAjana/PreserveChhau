// ===========================================================================
// Map of Chhau — geospatial dataset
// ---------------------------------------------------------------------------
// Each entry maps a place connected to Chhau dance: origin villages, Indian
// institutions, international academic/archival centres, world stages where it
// has been performed, and diaspora/patron communities.
//
// `wiki` is an English Wikipedia page title used to lazily pull a representative
// photo (place or related Chhau image) via the pageimages API.
//
// NOTE: Indian heritage/institution nodes are well documented. Several
// international "World Stage" and "Diaspora & Patron" nodes are representative
// of where this UNESCO-listed touring tradition reaches and where Indian
// diaspora patronage lives — verify specifics before print publication.
// ===========================================================================

export const chhauGeodata = [
  // ----------------------------- HERITAGE ROOTS -----------------------------
  { style: 'Purulia', city: 'Charida', country: 'India', region: 'Purulia, West Bengal', lat: 23.2, lng: 86.03, role: 'Primary mask-making epicenter', detail: 'The "village of masks" where hundreds of Sutradhar artisan families carve and paint the towering Purulia Chhau masks.', keyFigures: 'Sutradhar family of mask-makers', wiki: 'Charida', categorization: 'heritage' },
  { style: 'Purulia', city: 'Bamnia & Palma', country: 'India', region: 'Purulia, West Bengal', lat: 23.14, lng: 86.04, role: 'Traditional dance training grounds', detail: 'Twin villages whose akhras drill the acrobatic leaps and martial vocabulary of the Purulia style.', keyFigures: 'Mura and Mahato families', img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Performance%20of%20Chhau%20dance%20of%20Purulia.jpg?width=720', wiki: 'Purulia_Chhau', categorization: 'heritage' },
  { style: 'Purulia', city: 'Bagmundi', country: 'India', region: 'Purulia, West Bengal', lat: 23.18, lng: 86.07, role: 'Cluster of hereditary Chhau troupes', detail: 'A heartland block of Purulia dotted with performing troupes that anchor the annual Chaitra Parva festival.', keyFigures: 'Hereditary village dals (troupes)', img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Chhau%20dance%20in%20Purulia.jpg?width=720', wiki: 'Purulia_Chhau', categorization: 'heritage' },
  { style: 'Purulia', city: 'Balarampur', country: 'India', region: 'Purulia, West Bengal', lat: 23.1, lng: 86.22, role: 'Akhra circuit & Chaitra Parva grounds', detail: 'Renowned for night-long open-air Chhau bouts staged during the spring Chaitra Parva.', keyFigures: 'Village akhra masters', img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Chhau%20Dance%20of%20Purulia%2C%20West%20bengal.jpg?width=720', wiki: 'Purulia_Chhau', categorization: 'heritage' },
  { style: 'Purulia', city: 'Jhalda', country: 'India', region: 'Purulia, West Bengal', lat: 23.36, lng: 85.97, role: 'Frontier town of Purulia lineages', detail: 'A western Purulia town sustaining family lineages of dancers, drummers and shehnai players.', keyFigures: 'Frontier Chhau gharanas', img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Chhau%20Dancers%20of%20Purulia.jpg?width=720', wiki: 'Purulia_Chhau', categorization: 'heritage' },
  { style: 'Seraikella', city: 'Seraikela', country: 'India', region: 'Seraikela-Kharsawan, Jharkhand', lat: 22.7, lng: 85.93, role: 'Royal birthplace and training akhadas', detail: 'The princely cradle of the lyrical, masked Seraikella style, refined under royal patronage and its chhau akhadas.', keyFigures: 'Singh Deo and Acharya families', img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Radha%20Khrisna%20in%20Seraikella%20Chhau%20Dance.jpg?width=720', wiki: 'Seraikella_Chhau', categorization: 'heritage' },
  { style: 'Seraikella', city: 'Kharsawan', country: 'India', region: 'Seraikela-Kharsawan, Jharkhand', lat: 22.78, lng: 85.83, role: 'Sister princely akhada', detail: 'The neighbouring former princely state that shares and sustains the Seraikella masked tradition.', keyFigures: 'Kharsawan royal akhada', img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Chhau%20dancer%20from%20Jharkhand.jpg?width=720', wiki: 'Seraikella_Chhau', categorization: 'heritage' },
  { style: 'Mayurbhanj', city: 'Baripada', country: 'India', region: 'Mayurbhanj, Odisha', lat: 21.93, lng: 86.73, role: 'Origin point of the unmasked martial style', detail: 'Home of the maskless Mayurbhanj Chhau, danced openly with full facial expression and vigorous martial movement.', keyFigures: 'Bhanjadeo and Sai Babu families', img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Mayurbhanj%20Chhau.jpg?width=720', wiki: 'Mayurbhanj_Chhau', categorization: 'heritage' },

  // ------------------------------ NATIONAL HUBS -----------------------------
  { style: 'All Styles', city: 'New Delhi', country: 'India', region: 'National Capital Territory', lat: 28.61, lng: 77.2, role: 'National launching pad for global tours', detail: 'The capital from which Chhau companies are programmed onto national festivals and international cultural tours.', keyFigures: 'Shriram Bharatiya Kala Kendra; Sangeet Natak Akademi', wiki: 'New_Delhi', categorization: 'national' },
  { style: 'All Styles', city: 'Chandankiyari', country: 'India', region: 'Bokaro, Jharkhand', lat: 23.57, lng: 86.35, role: 'National preservation & research centre', detail: 'Seat of a dedicated national Chhau centre documenting repertoire, music and pedagogy.', keyFigures: 'Sangeet Natak Akademi Chhau Kendra', img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Chhau%20-%20The%20Dance%20of%20the%20Masks%2001.jpg?width=720', wiki: 'Chhau_dance', categorization: 'national' },
  { style: 'All Styles', city: 'Kolkata', country: 'India', region: 'West Bengal', lat: 22.57, lng: 88.36, role: 'Eastern Zonal cultural coordination', detail: 'Regional command point for eastern India’s folk arts, linking Purulia troupes to academies and stages.', keyFigures: 'Eastern Zonal Cultural Centre; Rabindra Bharati University', wiki: 'Kolkata', categorization: 'national' },
  { style: 'All Styles', city: 'Ranchi', country: 'India', region: 'Jharkhand', lat: 23.34, lng: 85.31, role: 'State cultural directorate & festivals', detail: 'Jharkhand’s capital, programming tribal and Chhau showcases through its culture department.', keyFigures: 'Jharkhand Dept. of Art, Culture & Tribal Affairs', wiki: 'Ranchi', categorization: 'national' },
  { style: 'Seraikella', city: 'Jamshedpur', country: 'India', region: 'Jharkhand', lat: 22.8, lng: 86.2, role: 'Annual Chhau Mahotsav', detail: 'The steel city near Seraikela that hosts a marquee Chhau Mahotsav each spring.', keyFigures: 'Local Chhau Mahotsav committees', wiki: 'Jamshedpur', categorization: 'national' },
  { style: 'Mayurbhanj', city: 'Bhubaneswar', country: 'India', region: 'Odisha', lat: 20.3, lng: 85.82, role: 'Odisha state staging & academy', detail: 'Odisha’s capital stages Mayurbhanj Chhau at Rabindra Mandap and through its state akademi.', keyFigures: 'Odisha Sangeet Natak Akademi', wiki: 'Bhubaneswar', categorization: 'national' },
  { style: 'All Styles', city: 'Santiniketan', country: 'India', region: 'Birbhum, West Bengal', lat: 23.68, lng: 87.68, role: 'University study of the form', detail: 'Tagore’s university town, where Chhau is studied and adapted within Sangit Bhavana’s dance curriculum.', keyFigures: 'Visva-Bharati · Sangit Bhavana', wiki: 'Santiniketan', categorization: 'national' },
  { style: 'All Styles', city: 'Mumbai', country: 'India', region: 'Maharashtra', lat: 19.08, lng: 72.88, role: 'Premier national stagings', detail: 'India’s cultural metropolis, presenting Chhau on flagship proscenium stages.', keyFigures: 'National Centre for the Performing Arts (NCPA)', wiki: 'Mumbai', categorization: 'national' },
  { style: 'All Styles', city: 'Bhopal', country: 'India', region: 'Madhya Pradesh', lat: 23.26, lng: 77.41, role: 'Tribal & folk arts platform', detail: 'Bharat Bhavan’s multi-arts complex foregrounds Chhau within India’s tribal and folk arts.', keyFigures: 'Bharat Bhavan', wiki: 'Bharat_Bhavan', categorization: 'national' },
  { style: 'All Styles', city: 'Khajuraho', country: 'India', region: 'Madhya Pradesh', lat: 24.85, lng: 79.93, role: 'Khajuraho Dance Festival', detail: 'The temple-backdrop dance festival that has featured Chhau among India’s classical forms.', keyFigures: 'Khajuraho Dance Festival', wiki: 'Khajuraho_Group_of_Monuments', categorization: 'national' },
  { style: 'Mayurbhanj', city: 'Konark', country: 'India', region: 'Odisha', lat: 19.89, lng: 86.09, role: 'Konark Festival open-air stage', detail: 'The Sun Temple’s annual festival presents Mayurbhanj Chhau against monumental sculpture.', keyFigures: 'Konark Festival', wiki: 'Konark_Sun_Temple', categorization: 'national' },
  { style: 'All Styles', city: 'Chennai', country: 'India', region: 'Tamil Nadu', lat: 13.08, lng: 80.27, role: 'Margazhi season guest performances', detail: 'South India’s great music-and-dance season hosts Chhau as a guest folk-classical form.', keyFigures: 'Sabhas of the Margazhi season', wiki: 'Chennai', categorization: 'national' },
  { style: 'All Styles', city: 'Hyderabad', country: 'India', region: 'Telangana', lat: 17.42, lng: 78.45, role: 'Crafts & folk festival showcase', detail: 'Shilparamam’s crafts village regularly programmes Chhau within national folk festivals.', keyFigures: 'Shilparamam', wiki: 'Shilparamam', categorization: 'national' },

  // ------------------------------ GLOBAL NODES ------------------------------
  { style: 'Purulia / Seraikella', city: 'Paris', country: 'France', region: 'Île-de-France', lat: 48.85, lng: 2.35, role: 'UNESCO inscription & heritage seminars', detail: 'Where Chhau’s 2010 inscription on UNESCO’s Intangible Cultural Heritage list is stewarded and discussed.', keyFigures: 'UNESCO · Banglanatak.com · Folkland', wiki: 'Paris', categorization: 'global' },
  { style: 'All Styles', city: 'London', country: 'UK', region: 'England', lat: 51.5, lng: -0.12, role: 'European staging & development hub', detail: 'A leading European centre for South Asian dance presentation, training and networking.', keyFigures: 'The Nehru Centre · Akademi', wiki: 'London', categorization: 'global' },
  { style: 'Purulia / Seraikella', city: 'Lisbon', country: 'Portugal', region: 'Lisbon', lat: 38.72, lng: -9.13, role: 'Major European mask collection & archive', detail: 'The Museu do Oriente holds a significant collection of Chhau masks and Asian performance artefacts.', keyFigures: 'Fundação Oriente (Museu do Oriente)', wiki: 'Museu_do_Oriente', categorization: 'global' },
  { style: 'Mayurbhanj', city: 'New York', country: 'USA', region: 'New York', lat: 40.71, lng: -74.0, role: 'Diaspora workshops & academic networks', detail: 'University programmes and cultural societies run Chhau workshops and lecture-demonstrations.', keyFigures: 'Universities & cultural societies', wiki: 'New_York_City', categorization: 'global' },
  { style: 'All Styles', city: 'Berlin', country: 'Germany', region: 'Berlin', lat: 52.52, lng: 13.4, role: 'Ethnological collections & symposia', detail: 'Museum and symposium platforms engage Chhau within Asian performance and material culture.', keyFigures: 'Humboldt Forum · ethnological collections', wiki: 'Humboldt_Forum', categorization: 'global' },

  // ------------------------------ WORLD STAGES ------------------------------
  { style: 'Mayurbhanj', city: 'Washington, D.C.', country: 'USA', region: 'District of Columbia', lat: 38.89, lng: -77.03, role: 'Premier North American performance node', detail: 'The Kennedy Center has presented Indian classical and Chhau-adjacent programmes to U.S. audiences.', keyFigures: 'The Kennedy Center · IPAP', wiki: 'John_F._Kennedy_Center_for_the_Performing_Arts', categorization: 'stage' },
  { style: 'All Styles', city: 'Edinburgh', country: 'UK', region: 'Scotland', lat: 55.95, lng: -3.19, role: 'Edinburgh Festival Fringe', detail: 'The world’s largest arts festival, a recurring window for Indian touring companies.', keyFigures: 'Edinburgh Festival Fringe', wiki: 'Edinburgh_Festival_Fringe', categorization: 'stage' },
  { style: 'Seraikella', city: 'Avignon', country: 'France', region: 'Provence', lat: 43.95, lng: 4.81, role: 'European festival touring', detail: 'A landmark European theatre festival on the international touring circuit.', keyFigures: 'Avignon Festival', wiki: 'Avignon_Festival', categorization: 'stage' },
  { style: 'All Styles', city: 'Singapore', country: 'Singapore', region: 'Singapore', lat: 1.29, lng: 103.85, role: 'Kalaa Utsavam Indian festival', detail: 'Esplanade – Theatres on the Bay presents Indian arts through its annual Kalaa Utsavam.', keyFigures: 'Esplanade – Theatres on the Bay', img: 'https://commons.wikimedia.org/wiki/Special:FilePath/The%20Esplanade%20%E2%80%93%20Theatres%20on%20the%20Bay.jpg?width=720', wiki: 'Singapore', categorization: 'stage' },
  { style: 'All Styles', city: 'Adelaide', country: 'Australia', region: 'South Australia', lat: -34.93, lng: 138.6, role: 'OzAsia Festival', detail: 'Australia’s leading festival of Asian arts, a southern-hemisphere stage for Indian dance.', keyFigures: 'OzAsia Festival', wiki: 'Adelaide', categorization: 'stage' },
  { style: 'Mayurbhanj', city: 'Sydney', country: 'Australia', region: 'New South Wales', lat: -33.86, lng: 151.21, role: 'Opera House guest seasons', detail: 'Iconic harbour stages hosting Indian cultural seasons and diaspora festivals.', keyFigures: 'Sydney Opera House programmes', wiki: 'Sydney_Opera_House', categorization: 'stage' },
  { style: 'All Styles', city: 'Tokyo', country: 'Japan', region: 'Kantō', lat: 35.68, lng: 139.69, role: 'India–Japan cultural exchange', detail: 'Festivals of India and exchange programmes bring Chhau to Japanese audiences.', keyFigures: 'India–Japan cultural exchange', wiki: 'Tokyo', categorization: 'stage' },
  { style: 'All Styles', city: 'Toronto', country: 'Canada', region: 'Ontario', lat: 43.65, lng: -79.38, role: 'Diaspora theatre & festival circuit', detail: 'A major North American diaspora hub for South Asian performing arts.', keyFigures: 'South Asian arts festivals', wiki: 'Toronto', categorization: 'stage' },
  { style: 'All Styles', city: 'Dubai', country: 'UAE', region: 'Dubai', lat: 25.2, lng: 55.27, role: 'Cultural-diplomacy stagings', detail: 'Expo and festival platforms present Indian heritage arts to global Gulf audiences.', keyFigures: 'Festival & Expo platforms', wiki: 'Dubai', categorization: 'stage' },
  { style: 'All Styles', city: 'Rome', country: 'Italy', region: 'Lazio', lat: 41.9, lng: 12.5, role: 'European festival node', detail: 'Italian festivals and India cultural weeks host touring Indian dance.', keyFigures: 'Italy India cultural weeks', wiki: 'Rome', categorization: 'stage' },
  { style: 'All Styles', city: 'Ismailia', country: 'Egypt', region: 'Suez Canal', lat: 30.59, lng: 32.27, role: 'Ismailia Intl. Folklore Festival', detail: 'A celebrated international folklore festival where Indian folk-classical troupes appear.', keyFigures: 'Ismailia International Folklore Festival', wiki: 'Ismailia', categorization: 'stage' },
  { style: 'All Styles', city: 'Moscow', country: 'Russia', region: 'Moscow', lat: 55.75, lng: 37.62, role: 'Days of Indian Culture stagings', detail: 'Long-running India–Russia cultural exchanges present Indian classical and folk dance.', keyFigures: 'Days of Indian Culture', wiki: 'Moscow', categorization: 'stage' },

  // -------------------------- DIASPORA & PATRONS ----------------------------
  { style: 'Mayurbhanj', city: 'Bogota', country: 'Colombia', region: 'Bogotá D.C.', lat: 4.71, lng: -74.07, role: 'South American cross-cultural training', detail: 'A non-Indian practitioner hub adapting Mayurbhanj Chhau for Latin American students.', keyFigures: 'Chhau Dance Sangam (Carolina Prada)', wiki: 'Bogotá', categorization: 'diaspora' },
  { style: 'All Styles', city: 'Port of Spain', country: 'Trinidad & Tobago', region: 'Trinidad', lat: 10.66, lng: -61.51, role: 'Indo-Caribbean cultural patronage', detail: 'A historic Indian-diaspora society sustaining Indian dance traditions in the Caribbean.', keyFigures: 'Indo-Caribbean cultural associations', wiki: 'Port_of_Spain', categorization: 'diaspora' },
  { style: 'All Styles', city: 'Georgetown', country: 'Guyana', region: 'Demerara-Mahaica', lat: 6.8, lng: -58.16, role: 'Indo-Guyanese heritage groups', detail: 'Guyana’s large Indian-descended community supports classical and folk Indian dance.', keyFigures: 'Indo-Guyanese cultural bodies', wiki: 'Georgetown,_Guyana', categorization: 'diaspora' },
  { style: 'All Styles', city: 'Paramaribo', country: 'Suriname', region: 'Paramaribo', lat: 5.87, lng: -55.17, role: 'Indo-Surinamese heritage circles', detail: 'Hindustani-Surinamese associations keep Indian performance traditions alive.', keyFigures: 'Hindustani-Surinamese associations', wiki: 'Paramaribo', categorization: 'diaspora' },
  { style: 'All Styles', city: 'Port Louis', country: 'Mauritius', region: 'Port Louis', lat: -20.16, lng: 57.5, role: 'Indian-diaspora cultural patronage', detail: 'A deep-rooted Indian-Mauritian community patronising classical and folk Indian arts.', keyFigures: 'Indo-Mauritian cultural institutions', wiki: 'Port_Louis', categorization: 'diaspora' },
  { style: 'All Styles', city: 'Durban', country: 'South Africa', region: 'KwaZulu-Natal', lat: -29.86, lng: 31.02, role: 'South African Indian diaspora', detail: 'One of the largest Indian communities outside India, with active dance societies.', keyFigures: 'South African Indian cultural societies', wiki: 'Durban', categorization: 'diaspora' },
  { style: 'All Styles', city: 'Kuala Lumpur', country: 'Malaysia', region: 'Kuala Lumpur', lat: 3.14, lng: 101.69, role: 'Indian-Malaysian arts patrons', detail: 'A vibrant Indian-Malaysian arts scene presenting classical and folk Indian dance.', keyFigures: 'Indian-Malaysian arts bodies', wiki: 'Kuala_Lumpur', categorization: 'diaspora' },
  { style: 'All Styles', city: 'Suva', country: 'Fiji', region: 'Central Division', lat: -18.14, lng: 178.44, role: 'Indo-Fijian cultural societies', detail: 'Indo-Fijian communities maintain Indian performance arts across the Pacific.', keyFigures: 'Indo-Fijian cultural societies', wiki: 'Suva', categorization: 'diaspora' },
  { style: 'Purulia', city: 'Dhaka', country: 'Bangladesh', region: 'Dhaka', lat: 23.81, lng: 90.41, role: 'Shared Bengali Chhau-form traditions', detail: 'Across the Bengal border, related masked and folk-dance traditions echo the Purulia idiom.', keyFigures: 'Bengali folk-arts institutions', wiki: 'Dhaka', categorization: 'diaspora' },
  { style: 'All Styles', city: 'Kathmandu', country: 'Nepal', region: 'Bagmati', lat: 27.71, lng: 85.32, role: 'Himalayan cultural exchange', detail: 'India–Nepal cultural programmes share folk and classical dance across the Himalaya.', keyFigures: 'India–Nepal cultural programmes', wiki: 'Kathmandu', categorization: 'diaspora' },
];

// Style -> earth-pigment hue (muted, harmonious — a printed-atlas legend, not neon).
export const STYLE_COLORS = {
  Purulia: '#cf6a4a', // warm clay
  Seraikella: '#5f8f8a', // muted teal
  Mayurbhanj: '#c6a052', // ochre
  'All Styles': '#8c9a60', // sage
};

// Resolve a colour even for combined styles like "Purulia / Seraikella".
export function getStyleColor(style) {
  if (STYLE_COLORS[style]) return STYLE_COLORS[style];
  const primary = style.split('/')[0].trim();
  return STYLE_COLORS[primary] || '#9a9183';
}

// Sidebar groupings mapped to the dataset's `categorization` field.
export const CATEGORIES = [
  { key: 'heritage', label: 'Heritage Roots', blurb: 'Origin villages & royal akhadas' },
  { key: 'national', label: 'National Hubs', blurb: 'Indian institutions & festivals' },
  { key: 'global', label: 'Global Nodes', blurb: 'Academic & archival centres' },
  { key: 'stage', label: 'World Stages', blurb: 'Theatres & festivals abroad' },
  { key: 'diaspora', label: 'Diaspora & Patrons', blurb: 'Communities & cultural societies' },
];

// ---------------------------------------------------------------------------
// Lazy Wikipedia thumbnail lookup (CORS-enabled pageimages API), module-cached
// so repeat selections are instant and we never re-fetch the same title.
// ---------------------------------------------------------------------------
const imageCache = new Map();

export async function fetchWikiImage(title) {
  if (!title) return null;
  if (imageCache.has(title)) return imageCache.get(title);
  try {
    const url =
      'https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*' +
      '&redirects=1&prop=pageimages&piprop=thumbnail&pithumbsize=720&titles=' +
      encodeURIComponent(title);
    const res = await fetch(url, { referrerPolicy: 'no-referrer' });
    if (!res.ok) throw new Error(`Image lookup returned ${res.status}`);
    const json = await res.json();
    const pages = json?.query?.pages || {};
    const src = Object.values(pages)[0]?.thumbnail?.source || null;
    imageCache.set(title, src);
    return src;
  } catch {
    imageCache.set(title, null);
    return null;
  }
}
