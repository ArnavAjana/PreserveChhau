export type PageAnimationType =
  | "page-turn-soft"
  | "page-turn-minimal"
  | "paper-slide"
  | "sheet-glide"
  | "chapter-fade"
  | "chapter-slide"
  | "spread-open"
  | "spread-close"
  | "paper-lift"
  | "paper-settle";

export type BookPageTextStyle = {
  headingColor: string;
  bodyTextColor: string;
  fontStyle: "normal" | "italic";
  lineHeight: string;
};

export type BookPageType = "cover" | "section" | "content";

export type BookPageModelOption = {
  label: string;
  modelUrl: string;
  modelScale?: number;
};

/** An audio example rendered with the shared PageAudioPlayer. */
export type BookPageAudioTrack = {
  src: string;
  title: string;
  caption?: string;
  loop?: boolean;
};

/** An image in a page's media gallery (PageMediaGallery). */
export type BookPageGalleryImage = {
  src: string;
  alt: string;
  caption?: string;
};

/** Special interactive layouts a page can opt into. */
export type BookPageInteractive = "sandbox-guide";

export type BookPage = {
  id: string;
  pageNumber: number;
  pageType?: BookPageType;
  title: string;
  body: string;
  modelUrl: string | null;
  modelScale: number;
  modelOptions?: BookPageModelOption[];
  coverImageUrl?: string | null;
  coverImageLargeUrl?: string | null;
  coverImageAlt?: string;
  audioUrl: string | null;
  audioLoop: boolean;
  /* Optional interactive layers. Any page may add audio examples, an
     image gallery, or a video clip by filling these fields — the reader
     renders them after the page's text with the shared components. */
  interactive?: BookPageInteractive;
  audioTracks?: BookPageAudioTrack[];
  gallery?: BookPageGalleryImage[];
  videoUrl?: string | null;
  videoCaption?: string;
  /** Embedded interactive experience served from public/ (e.g. the
      Map of Chhau globe atlas), rendered with PageEmbed. */
  embedUrl?: string | null;
  embedTitle?: string;
  embedCaption?: string;
  embedHeight?: string;
  backgroundStyle: string;
  textStyle: BookPageTextStyle;
  animationStyle: PageAnimationType;
  modelFrameStyle: string;
  modelViewerHeight: string;
  modelViewerBackground: string;
  showFallbackScene: boolean;
};

const defaultTextStyle: BookPageTextStyle = {
  headingColor: "#2a1609",
  bodyTextColor: "#2a1609",
  fontStyle: "normal",
  lineHeight: "1.85",
};

const defaultPageAppearance = {
  backgroundStyle:
    "linear-gradient(135deg, #fff8db 0%, #fff0c4 52%, #fed7aa 100%)",
  textStyle: defaultTextStyle,
  animationStyle: "page-turn-soft" as const,
  modelFrameStyle: "border-transparent bg-transparent shadow-none",
  modelViewerHeight: "50vh",
  modelViewerBackground: "transparent",
};

export const bookPages: BookPage[] = [
  {
    id: "chhau",
    pageNumber: 0,
    pageType: "cover",
    title: "Chhau",
    body: "*An interactive introduction to the Mayurbhanj, Seraikella, and Purulia traditions.*\n\nArnav Ajana",
    modelUrl: null,
    modelScale: 1,
    coverImageUrl: "/images/cover-mobile.png",
    coverImageLargeUrl: "/images/cover-large.png",
    coverImageAlt: "Chhau eBook cover",
    audioUrl: null,
    audioLoop: false,
    showFallbackScene: false,
    ...defaultPageAppearance,
  },
  {
    id: "foreword",
    pageNumber: 1,
    pageType: "section",
    title: "Foreword",
    body: "",
    modelUrl: null,
    modelScale: 1,
    audioUrl: null,
    audioLoop: false,
    showFallbackScene: false,
    ...defaultPageAppearance,
  },
  {
    id: "about-me",
    pageNumber: 2,
    pageType: "content",
    title: "About Me",
    body: "I found Chhau two years ago. I was preparing for an international dance competition and looking for a form I hadn't worked with before, and my mentor, who was trained in Mayurbhanj Chhau, opened my eyes to the world of Chhau. I only meant to learn enough for one performance, but it pulled me in further than I expected. Every day in school while the team practiced for different compositions, we would find ourselves doing Chhau for fun, wanting more.\n\nWhat surprised me was how hard it was to find reliable and satisfactory information about it. I'd look things up and keep hitting dead ends, or scattered pages that didn't add up to a full picture. It seemed wrong that something this old and this important was so hard to actually learn about.\n\nI'm an actor and a dancer, and a student in the IB Diploma Programme. I'm not an expert on Chhau. But I spent a long time trying to understand it, and I wanted to put what I found over two years into a single place so the next person doesn't have to start from nothing — so that I might make some small effort to preserve it.\n\nThat's all this eBook really is: a clear, honest, and structured introduction to Chhau for anyone, especially younger people, who want to learn about it and contribute to its life.\n\nI'm grateful to every guru, dancer, mask maker, musician, scholar, and friend whose lessons, writings, talks, and conversations I have leaned on. Anything that reads well in here was learned from them. Any mistake is my own.\n\n*— Arnav Ajana*",
    modelUrl: null,
    modelScale: 1,
    audioUrl: null,
    audioLoop: false,
    showFallbackScene: false,
    ...defaultPageAppearance,
  },
  {
    id: "about-chhau",
    pageNumber: 3,
    pageType: "content",
    title: "About Chhau",
    body: "Chhau is one of India's oldest and most physically demanding dance forms. It grew out of martial training and slowly took on a performance life, and this eBook tries to follow that whole arc — where Chhau came from, and what it has become.\n\nChhau, much like Hip-Hop, is not a single style. It is a family of three regional traditions, and they are genuinely different from each other. Seraikella Chhau, from the town of Seraikella in Jharkhand, tells its stories through carved masks and a quiet, restrained body. Purulia Chhau, from the Purulia district of West Bengal, is fast, acrobatic, and community-driven, with large, sculptural masks. Mayurbhanj Chhau, from the Mayurbhanj district of northern Odisha, is performed without masks and depends entirely on the body and the face. What ties the three together is the music — the dhol, the dhamsa, and the reed instrument that gives Chhau its open-air sound.\n\nThis resource tries to reflect how alive the form still is. It includes video demonstrations, breakdowns of actual movements, and the history behind them. It also looks at how Chhau tells its stories, at the role of costume, mask, and colour, and at the training that keeps these traditions going inside the communities that practice them.\n\nI owe a lot to the artists who took the time to share what they know. Their dedication is what convinced me that Chhau, however old it is, still has a place in our world.\n\nAs you read on, try not to stop at the terminologies and the 3D sandboxes. Practice the movements when you can. Listen to the drums. Watch the artists. Look for what the form is doing rather than only for what it looks like.",
    modelUrl: "/models/chhau-web-assets/traditional-dancer.glb",
    modelScale: 1,
    audioUrl: null,
    audioLoop: false,
    showFallbackScene: false,
    ...defaultPageAppearance,
  },
  {
    id: "how-to-use-this-interactive-ebook",
    pageNumber: 4,
    pageType: "content",
    title: "How to Use this Interactive eBook",
    body: "This book is not designed to be read straight through. It is built more like a small museum — there are rooms you can move between, and most of them stand on their own.\n\nThe first part, **The World of Chhau**, is the shared ground. It explains what Chhau is, where it comes from, what the body does, what the music sounds like, and what the costumes, masks, and props mean. If you are new to Chhau, start here.\n\nThe three middle sections — **Mayurbhanj**, **Seraikella**, and **Purulia** — are written as separate traditions. They do not repeat each other. Each one has its own short history, its own movement language, its own training context, and its own performance breakdown. You can read them in any order. I'd suggest reading whichever one your curiosity points to first.\n\nThe final section, **Glossary, Index, and Library**, is a reference. The Glossary explains terms in plain language. The Library lists every source I used so that you can read further on your own.\n\nAlong the way you will find several kinds of interactive elements:\n\n- **Video clips** — short, observational. The caption tells you what to watch for.\n- **Audio examples** — usually drum patterns or a complete musical phrase. The caption tells you what to listen for.\n- **Image galleries** — masks, costumes, training spaces, performance moments.\n- **3D sandboxes** — figures you can rotate and slow down. Each one has a small accompanying note that points you towards a detail you might otherwise miss.\n\nThe book is meant to feel like a long conversation, not a textbook. Read it that way. Stop when you want to. Re-read when something does not make sense the first time. And whenever possible, put the book down and actually try the movement, or play the drum pattern out loud. Chhau makes more sense in the body than on the page.\n\n### Try it here\n\nBelow is a live 3D sandbox — the same kind you will meet throughout the book. The labelled arrows point at each of its controls. Spin the figure, change the shading, move the camera; nothing you do here can break anything.\n\nUnder the sandbox is an audio player of the kind that accompanies the music chapters. Press play, and read the caption — it tells you what to listen for, the way every audio example in this book does.",
    modelUrl: null,
    modelScale: 1,
    audioUrl: null,
    audioLoop: false,
    interactive: "sandbox-guide",
    audioTracks: [
      {
        src: "/audio/dholki-1.mp3",
        title: "Dhol pattern — listening sample",
        caption:
          "Listen for the dhol's sharper voice on top of the steady pulse. In performance, the dancer enters on the dhol's accent — not on the low pulse underneath.",
      },
    ],
    showFallbackScene: false,
    ...defaultPageAppearance,
  },
  {
    id: "map-of-chhau-families-epicentres",
    pageNumber: 5,
    pageType: "content",
    title: "Map of Chhau: Families, Epicentres",
    embedUrl: "/map-of-chhau/index.html",
    embedTitle: "Map of Chhau — interactive atlas",
    embedCaption:
      "The three Chhau centres — Baripada (Odisha), Seraikella (Jharkhand), and Purulia (West Bengal) — sit within a short radius of each other in eastern India, across three state borders. Drag to spin the globe; select a marker to read about each site.",
    embedHeight: "72vh",
    body: "Chhau lives in a small but distinct geography in eastern India, where the borders of three states meet. The map below shows the three centres and the surrounding region they share.\n\n**Mayurbhanj Chhau** is centred in and around **Baripada**, the headquarters of Mayurbhanj district in northern Odisha. It is closely identified with the former princely state of Mayurbhanj and is performed widely across the district during the Chaitra Parva festival in April [1][2][4].\n\n**Seraikella Chhau** is centred in **Seraikella**, the historic capital of the former princely state of Seraikella, now part of Seraikella-Kharsawan district in Jharkhand. It is also identified with Chaitra Parva, performed during the same April festival period [1][2][5].\n\n**Purulia Chhau** is spread across the villages of **Purulia district** in southwestern West Bengal. There is no single town that stands for it in the way Baripada stands for Mayurbhanj or Seraikella for Seraikella; Purulia Chhau lives across many villages, with strong local troupes and family-run akharas [3][9].\n\nThese three regions sit close to each other on the map, and dancers, musicians, and mask makers have travelled between them for generations. That is part of why Chhau feels related across all three — the geography is shared, the festival calendar overlaps, and the rhythmic instruments are similar. But the way each region developed its own performance language is what makes them distinct.",
    modelUrl: null,
    modelScale: 1,
    audioUrl: null,
    audioLoop: false,
    showFallbackScene: false,
    ...defaultPageAppearance,
  },
  {
    id: "first-look-at-chhau",
    pageNumber: 6,
    pageType: "content",
    title: "First Look at Chhau",
    body: "Before reading further, watch this short opening clip. You don't need to analyse it. Just notice what your eye is drawn to first.\n\n> **Video caption:** A short montage moving between the three Chhau traditions. Watch the difference between the moments when the face is visible (Mayurbhanj) and the moments when a mask carries the character (Seraikella, Purulia). Notice that the drum almost never stops. Almost every change in the dancer's body happens on a cue from the music.\n\nIf you notice yourself paying attention to the jumps, the masks, or the colour of the costumes first, that is normal — those are the loudest parts of Chhau. The quieter parts come later: the pauses, the angles, the way a single drumbeat can change a dancer's intention. Keep this clip in mind as you read; the chapters that follow will give you a vocabulary for what you just saw.",
    modelUrl: "/models/chhau-web-assets/chhau-group-1.glb",
    modelScale: 1,
    modelOptions: [
      {
        label: "Chhau group",
        modelUrl: "/models/chhau-web-assets/chhau-group-1.glb",
      },
      {
        label: "Performing dancers",
        modelUrl: "/models/chhau-web-assets/performing-dancers.glb",
      },
    ],
    audioUrl: null,
    audioLoop: false,
    showFallbackScene: false,
    ...defaultPageAppearance,
  },
  {
    id: "part-one-the-world-of-chhau",
    pageNumber: 7,
    pageType: "section",
    title: "Part One — The World of Chhau",
    body: "",
    modelUrl: null,
    modelScale: 1,
    audioUrl: null,
    audioLoop: false,
    showFallbackScene: false,
    ...defaultPageAppearance,
  },
  {
    id: "what-is-chhau",
    pageNumber: 8,
    pageType: "content",
    title: "What is Chhau",
    body: "Chhau is a performance form from eastern India in which dancers tell stories through the body, the drum, and — in two of the three traditions — through carved masks. It is performed by trained dancers, often outdoors, almost always to live music, and it carries inside it a long memory of martial training, ritual practice, and community festival.\n\nThe simplest thing to say about Chhau is that it is *not one form*. It is three. They are related — they share a region, instruments, a festival calendar, and a common name — but each has its own grammar.\n\n- **Mayurbhanj Chhau** is performed without masks. The face is part of the performance, and the body is sculpted into clear, often statuesque positions. It is recognised today as one of the classical and folk forms of Odisha and trained inside an institutional system, while remaining alive in village performances.\n- **Seraikella Chhau** is performed with masks that are usually small, smooth, and gentle in expression. It is known for restraint — the dancer animates a fixed mask using the angle of the head, the line of the body, and the timing of movement, rather than facial change.\n- **Purulia Chhau** is also performed with masks, but the masks tend to be larger, more elaborate, and more vividly painted. The dance is more openly muscular and acrobatic, with leaps, spins, and combat sequences that play to a large outdoor audience.\n\nAll three were inscribed together by UNESCO on the Representative List of the Intangible Cultural Heritage of Humanity in 2010, under the single name *Chhau dance* [1]. That listing recognised them as a related family — but the dancers and gurus themselves are careful to point out that each tradition has its own training lineage, performance context, and aesthetic [2].\n\nIt also helps to know what Chhau is not.\n\nIt is not a \"tribal\" dance in the loose, dismissive sense — Chhau has been shaped by royal patronage, by community festivals, by martial schools, and by national stages. It is not a frozen tradition — it is still being taught, learned, performed, and adapted today by professional and amateur dancers across India and abroad. And it is not a single style that happens to have three names; the differences between Mayurbhanj, Seraikella, and Purulia are real, and a serious viewer learns to see them.\n\nThe rest of this section explains the shared ground — where Chhau comes from, what the body does, what the music does, and what the visual world looks like. The three regional sections that follow take each tradition on its own terms.",
    modelUrl: "/models/chhau-web-assets/dancer-character.glb",
    modelScale: 1,
    audioUrl: null,
    audioLoop: false,
    showFallbackScene: false,
    ...defaultPageAppearance,
  },
  {
    id: "origins-etymology-and-historical-layers",
    pageNumber: 9,
    pageType: "content",
    title: "Origins, Etymology, and Historical Layers",
    body: "Chhau's origins are not a single story. They are several stories layered on top of each other, and the honest version of its history admits that.\n\n### What does the word \"Chhau\" mean\n\nThere is no settled answer. Scholars and practitioners have offered different etymologies, and the most often cited are:\n\n- *Chhaya*, the Sanskrit word for shadow, shade, or image. Some writers have linked this to the use of masks, since a mask can be read as a *chhaya*, a visual stand-in for a character [9][2].\n- *Chhauni*, a term for a military encampment or barracks. This reading connects Chhau to the martial training of soldiers, since several accounts describe the dance as having grown out of exercises practiced by guards and warriors during peacetime [10][2].\n- *Chho* or *chhau*, regional words associated with attack, assault, or stealth, again connecting the form to martial movement.\n\nNo single etymology has been proven. It is reasonable to say that the word probably carries some of all three associations, and that different communities have understood it differently. The mask reading is more common in Seraikella and Purulia, where masks are central. The military reading is more often heard in Mayurbhanj, where the dance is unmasked and the body still carries clear martial signatures.\n\n### A martial root\n\nWhat most sources agree on is that Chhau in all three regions has some relationship with *paika akharas* — schools of martial exercise where men trained in stick fighting, sword work, and physical conditioning. Movements such as the wide low stance, the leap, the sudden change of direction, and the mock attack are all visible in surviving combat exercises in eastern India. Several gurus describe the early form of Chhau as a kind of demonstration of physical readiness that became a performance over time [9][10].\n\nThe link is not a one-line origin story; it is a recognisable inheritance. When you watch a Chhau dancer prepare to leap, you are looking at training that was first built for combat and then carried into theatre.\n\n### Ritual and festival\n\nAcross all three regions, Chhau has long been performed in connection with the **Chaitra Parva**, the festival held in the Indian lunar month of Chaitra, which usually falls in April. In Seraikella and Mayurbhanj, Chaitra Parva is the central festival for Chhau performance; in Purulia, Chhau is performed across a wider set of community festivals through the year, with Chaitra Parva remaining important [9][2].\n\nThe festival context matters. It tells us that Chhau is not only a stage form. It is also a community event, tied to a season, a calendar, and a place.\n\n### Royal and courtly patronage\n\nIn Seraikella and Mayurbhanj, the local princely states — the Singh Deo family of Seraikella and the Bhanj family of Mayurbhanj — were closely involved in the development of Chhau as a refined performance form. In Seraikella in particular, members of the royal family are widely credited with developing the masked, lyrical style for which the tradition is now known, and with patronising its presentation to wider audiences in the mid-twentieth century [2][1].\n\nPurulia, by contrast, did not develop under a single royal patron in the same way. Its evolution has been more closely tied to village communities and local troupes. The result is that Purulia Chhau has a different social biography from the other two — its history is told through villages, akharas, and individual masters rather than through a court.\n\n### From village and court to stage\n\nThe twentieth century is when Chhau began to reach wider audiences. The Seraikella tradition travelled abroad as early as the 1930s, when troupes performed in Europe under royal sponsorship [2]. Mayurbhanj Chhau gained national visibility through institutional teaching and recognition by bodies like the Sangeet Natak Akademi. Purulia Chhau was studied and documented in detail in the second half of the century, including by the scholar Ashutosh Bhattacharya, whose work helped bring the tradition into wider academic and cultural attention [9].\n\nThe 2010 UNESCO inscription was the formal international recognition of all three, but it did not create them. They had been alive in their regions for much longer.\n\n### What we should not say\n\nIt is tempting to give Chhau a clean, single origin — a date, a king, a founder. The honest position is that we don't have one. What we have is a layered history: martial roots, ritual contexts, festival calendars, royal patronage in two of the three centres, and community ownership across all three. Different writers emphasise different layers. Each layer is real. None of them is the whole story.",
    modelUrl: "/models/chhau-web-assets/martial-artist-copy.glb",
    modelScale: 1,
    audioUrl: null,
    audioLoop: false,
    showFallbackScene: false,
    ...defaultPageAppearance,
  },
  {
    id: "the-chhau-body",
    pageNumber: 10,
    pageType: "content",
    title: "The Chhau Body",
    body: "A Chhau dancer's body is trained for two things at once: stability and explosion. The dancer must be able to hold a wide, low stance long enough for a clean line to register, then explode upward into a leap, and then come back to the ground without losing the line. None of that is decorative — it is the dance's basic vocabulary.\n\n### Stance and weight\n\nMost movements in Chhau begin from a wide, grounded stance. The feet are apart, knees bent, and weight pushed slightly into the front of the foot. The torso is upright and the chest is open. From this position, the dancer can change direction quickly, can drop further into the ground for a low pose, or can push off into a jump.\n\nThis stance is what gives Chhau its low centre of gravity. A dancer who has been trained well looks heavier than they are. The weight is not in the body; it is in the way the body meets the floor.\n\n### The torso as engine\n\nA common mistake is to watch Chhau as a dance of arms and legs. It is not. The torso does most of the work. Many of the leaps begin with a sharp contraction or rotation in the centre of the body — the kind of movement that travels up through the chest, into the shoulders, and out through the arms. When you watch a Chhau dancer jump, the legs do not push first. The torso does, and the legs follow.\n\nThis is one of the harder things to learn. A student can copy the shape of a Chhau pose long before they learn where the movement actually originates inside the body.\n\n### Leaps and turns\n\nChhau is built around clearly readable leaps. They are not the high, vertical leaps of ballet; they are heavier, lower, and often horizontal. A leap in Chhau is often a unit of attack — the dancer travels through the air to cross distance, to mimic a strike, or to land in a new shape that completes a phrase.\n\nTurns are usually quick and shape-driven. The dancer turns into a clear position rather than spinning continuously. A finished turn in Chhau usually ends with a fixed line — a leg extended, an arm raised, a head tilted — that \"stamps\" the rhythm visually.\n\n### Animal and bird gaits\n\nChhau borrows heavily from the natural world. Across all three traditions, there are movements named after birds and animals: the peacock, the deer, the elephant, the snake, the fish, the crab, among others. Sometimes these become whole pieces (the Mayurbhanj solo *Mayur*, the peacock, is a famous example). Sometimes they sit inside a longer piece as a passing image.\n\nWhen learning these, the dancer is not asked to imitate the animal literally. They are asked to take the *quality* of the animal — the alertness of the deer, the proud spread of the peacock, the heavy power of the elephant — and place it inside a Chhau body. The result looks human and animal at the same time.\n\n### Attack and release\n\nA defining feature of Chhau is the way it cycles between attack and release. A movement explodes outward — a strike, a leap, a turn — and then the body settles into a held shape. The held shape is not a rest; it is the moment the audience reads what just happened. Without that release, the attack does not register. Good Chhau training spends a lot of time on the *stillness after the movement*, not only the movement itself.\n\nThis is also why the drum and the dancer cannot really be separated. The drum tells the dancer when to attack and when to release. The dancer answers with the body.\n\n### Stamina\n\nChhau is physically punishing. A full performance involves repeated low stances, leaps, turns, and held positions, often in heavy costume and, in two of the three traditions, with a mask covering the face. Training builds stamina the slow way: long hours of basic exercises, repetition of single phrases, and gradual extension of how long a dancer can hold a pose without breaking the line.\n\n> **3D sandbox caption:** Rotate the figure to view the low stance from the side. Notice that the spine is upright while the knees are deeply bent — the weight sinks into the ground without the chest collapsing forward. This is the position the dancer returns to between most movements.",
    modelUrl: "/models/chhau-web-assets/human-figure.glb",
    modelScale: 1,
    modelOptions: [
      {
        label: "Body figure",
        modelUrl: "/models/chhau-web-assets/human-figure.glb",
      },
      {
        label: "Stance figure",
        modelUrl: "/models/chhau-web-assets/human-figure-copy.glb",
      },
    ],
    audioUrl: null,
    audioLoop: false,
    showFallbackScene: false,
    ...defaultPageAppearance,
  },
  {
    id: "movement-vocabulary-and-formations",
    pageNumber: 11,
    pageType: "content",
    title: "Movement Vocabulary and Formations",
    body: "Chhau has a working vocabulary of named movements. The vocabulary is not fully standardised — different gurus and regions use slightly different names and groupings — but a few categories run across all three traditions.\n\nThis section introduces the main categories. Where specific Mayurbhanj, Seraikella, or Purulia variations exist, they are noted. The regional chapters go deeper into each tradition's full vocabulary.\n\n### Uflis (basic exercises)\n\nThe first thing a Chhau student learns is *uflis*, the foundational training exercises. Uflis are not performance movements. They are conditioning routines that build the stance, the leap, the torso work, and the rhythmic sense at the same time. They are typically performed in repetition, set to a basic drum cycle, and they are the closest thing Chhau has to the warm-up routines you might see in martial training [10][2].\n\n> **Sandbox caption (uflis):** Watch how the body returns to the same low stance after every movement. The uflis are not a sequence with a story — they are a way to make the body fluent in returning to its base position.\n\n### Chaalis (gaits / walks)\n\n*Chaalis* are stylised walks. Each chaali has a character: there are slow, dignified gaits associated with kings and gods; faster, lighter gaits used for younger characters; heavier, weighty gaits used for older or more powerful figures; and specific animal gaits used when the dancer is depicting an animal.\n\nA chaali is not just about how the feet move; it is about how the whole body carries itself through space. Reading a chaali correctly is a big part of how an audience identifies who is on stage before any storytelling has begun.\n\n### Topkas (combat motifs)\n\n*Topka* movements are short combat phrases — strikes, parries, lunges, and counters drawn from the martial heritage of Chhau. They often appear in battle scenes between two dancers, but a soloist can also perform them against an imagined opponent.\n\nA topka is satisfying to watch because it is so clearly readable. The dancer's body declares the attack, executes it, and lands cleanly. Many of the most photographed moments in Chhau performance — the dramatic raised weapon, the wide split-legged pose mid-air — sit inside this category.\n\n### Entries and exits\n\nChhau entries are an art in themselves. A character does not simply walk on stage. They arrive with a phrase: a specific drum cue, a chaali matched to their identity, often a leap or a turn that announces who they are and what their energy is. The audience usually knows the character within the first few seconds, before any story has happened.\n\nExits work the same way in reverse. A character does not just leave; they exit on a phrase that resolves their presence cleanly.\n\n### Group formations\n\nWhen several dancers are on stage together, Chhau uses simple, clearly readable formations: lines, circles, opposing groups in a battle scene, semi-circles around a central character. The formations are tied to the storytelling: a battle is staged as two facing lines; a court scene as a semi-circle; a hunt as a tight cluster moving as one body.\n\nThe cleanliness of the formations is part of the aesthetic. A messy formation reads as a mistake; a clean formation reads as part of the performance.\n\n### Character-based movement\n\nChhau characters are often archetypes — a king, a warrior, a god, a demon, a hermit, an animal, a personification of something abstract like night or storm. Each archetype has movement choices associated with it. A demon's gait, weight, and timing are different from a god's. A young hero's leap looks different from an older warrior's stride. The dancer chooses from the vocabulary above (chaalis, topkas, entries, formations) and assembles them into a body that matches the character.\n\n> **Sandbox caption (character-based):** Try rotating between the two figures labelled \"warrior\" and \"demon.\" Look at the difference in stance width, head tilt, and shoulder line. Same body, different intent — almost no facial work is needed when the body is doing this much.\n\nA note on naming: movement names vary. The same gait may be called slightly different things in Mayurbhanj, Seraikella, and Purulia. When a name is contested or region-specific, this book notes it rather than picking one version as the \"correct\" one.",
    modelUrl: "/models/chhau-web-assets/martial-artist.glb",
    modelScale: 1,
    modelOptions: [
      {
        label: "Uflis / base",
        modelUrl: "/models/chhau-web-assets/martial-artist.glb",
      },
      {
        label: "Chaali / gait",
        modelUrl: "/models/chhau-web-assets/martial-artist-copy-2.glb",
      },
      {
        label: "Topka / attack",
        modelUrl: "/models/chhau-web-assets/martial-artist-copy.glb",
      },
    ],
    audioUrl: null,
    audioLoop: false,
    showFallbackScene: false,
    ...defaultPageAppearance,
  },
  {
    id: "storytelling-and-archetypes",
    pageNumber: 12,
    pageType: "content",
    title: "Storytelling and Archetypes",
    body: "Chhau tells stories without words. There is no song-text the audience needs to follow, no narration explaining what is happening. The story is in the body, the mask, the rhythm, and the costume.\n\nThat sounds restrictive, but it is one of Chhau's strengths. A story without words has to be told with absolute clarity. The audience cannot afford to miss a beat, so the storytelling builds in big, readable strokes: who is on stage, what they want, what they fight, what they become.\n\n### Where the stories come from\n\nChhau stories are drawn from several sources:\n\n- **The epics** — the Ramayana and the Mahabharata. Battle episodes are especially popular because they suit Chhau's martial vocabulary. A confrontation between two characters, a chase, the killing of a demon, the victory of a hero — all of these have clear, dramatic shapes.\n- **The Puranas** and stories of gods. Episodes about Shiva, Durga, Krishna, Kali, Ganesh, and other deities are common across all three traditions. The mythological context allows for dramatic transformations: a god revealing their cosmic form, a goddess slaying a demon.\n- **Nature themes**. Solo pieces depicting peacocks, deer, hunting scenes, monsoons, and rivers are part of the repertoire, especially in Mayurbhanj.\n- **Local and folk stories**. Some pieces are drawn from regional folklore rather than pan-Indian myth. These differ from village to village and troupe to troupe, and they are part of why Purulia in particular has such variety.\n- **Abstract or thematic pieces**. Some compositions take an idea — night, sunrise, the wind, the changing seasons — and build a dance around it without a fixed narrative.\n\n### Archetypes\n\nChhau characters are usually archetypal rather than psychological. The audience reads them at a glance:\n\n- **The hero / warrior**: upright posture, wide stance, sharp leaps, alert eyes.\n- **The god**: poised, balanced, often slower in tempo, with held positions and a calm centre.\n- **The demon (asura)**: heavier, more aggressive, larger gestures, often given a mask with prominent eyes and teeth.\n- **The goddess in battle (Durga, Kali, Chamunda)**: powerful, often weapon-bearing, with movements that combine the grace of a god and the force of a warrior.\n- **The animal**: built from the gait and quality of a real animal but stylised inside a human body.\n- **The sage / hermit**: spare, restrained, quiet, often in a single white costume.\n\nThe archetype is the doorway. Once the audience knows who they are watching, the dance can go deeper into the specific moment of the story.\n\n### Expression in unmasked vs masked Chhau\n\nHere the three traditions split.\n\nIn **Mayurbhanj**, where the dancer's face is visible, the face plays a real role. The dancer can show fear, surprise, anger, devotion, longing, focus. The face is not over-acted — Mayurbhanj does not use the formalised set of facial expressions you might see in some classical Indian dance forms — but it is present, and it changes with the moment.\n\nIn **Seraikella** and **Purulia**, the dancer wears a mask, and the face is fixed. Expression is carried by the body. A tilt of the head can make a calm mask seem alert. A drop of the shoulder can make a fierce mask seem tired. A change in tempo can make the same mask read as joyful in one moment and grieving in the next. This is a different kind of acting — it is closer to puppetry in its mechanics — and it is one of the hardest skills in Chhau. The dancer must trust that the body alone can carry feeling, because the face cannot help.\n\nSeraikella and Purulia differ in how they use this. Seraikella tends to be quieter, more restrained, more about angles and pauses. Purulia tends to be larger, more openly emotional, with broader movements that read at distance to a village or festival audience.\n\nIt is worth saying clearly: none of these three is \"more expressive\" than the others. They are differently expressive. A Mayurbhanj dancer telling a story with the face, a Seraikella dancer telling the same story with body and pause, and a Purulia dancer telling it with mask and force are all doing serious expressive work.\n\n### A note on terminology\n\nReaders familiar with classical Indian dance forms may know the terms *abhinaya* (expression), *nava rasa* (the nine emotional states), and *hasta mudra* (codified hand gestures). These come from a broader Indian performance vocabulary, especially as systematised in the *Natya Shastra* [13], and they are foundational in forms like Bharatanatyam and Kathakali [12]. Chhau exists in the same broad cultural world but does not use these systems in the same way. There is no equivalent codified gesture system unique to Chhau. Some teachers may use the language loosely, but it would be wrong to force the Bharatanatyam abhinaya framework onto Chhau as if it were the same thing. Chhau tells its stories in its own way.",
    modelUrl: "/models/chhau-web-assets/dancer-character.glb",
    modelScale: 1,
    audioUrl: null,
    audioLoop: false,
    showFallbackScene: false,
    ...defaultPageAppearance,
  },
  {
    id: "expressions",
    pageNumber: 13,
    pageType: "content",
    title: "Expressions",
    body: "A short companion to the storytelling chapter. This page is about what expression looks like in Chhau performance.\n\n### Without the mask: Mayurbhanj\n\nIn Mayurbhanj, the face is part of the dancer's instrument. A Mayurbhanj dancer can use the eyes to look at, search for, recognise, or refuse something on stage. The eyebrows can lift or knit. The mouth can soften or set. These are not the formal codified expressions of some classical forms; they are closer to the natural expressions of a skilled actor working in stylised movement.\n\nWhat you should notice in a Mayurbhanj performance is how the face follows the body, not the other way around. A turn of the head is often the last beat of a phrase — the body settles, the eyes arrive, and the audience reads the character.\n\n> **Video caption (Mayurbhanj close-up):** Watch the dancer's eyes at the end of a phrase. The body finishes, then the eyes find their direction. That delay of a fraction of a second is part of what carries the meaning.\n\n### With the mask: Seraikella\n\nSeraikella masks are usually small in scale, smoothly carved, and gentle in expression. The colour is often pale or soft. A Seraikella mask gives the dancer almost nothing in terms of facial change — it is, deliberately, a quiet face.\n\nThe dancer makes up for that with the rest of the body. The head can tilt to one side and the mask suddenly looks shy. The chest can lift and the mask looks proud. The shoulders can drop and the mask looks sad. Watching Seraikella is partly about watching how the dancer keeps changing what the mask seems to be feeling.\n\n> **Video caption (Seraikella):** Watch the dancer's neck and upper chest, not the mask. The mask is fixed. The dancer's neck does the work of expression. The mask's \"mood\" comes from where the dancer points it.\n\n### With the mask: Purulia\n\nPurulia masks are usually larger, more brightly painted, and more openly expressive in their carved features. Many of them are designed to be read at a distance, in an open village space, against a bright sky.\n\nBecause the masks already do more visual work, the body in Purulia performs at a larger scale to match them. Leaps, spins, big stage crossings, and acrobatic moments are common. The expression of a Purulia character is partly in the mask's carved features and partly in the dancer's whole-body force.\n\nThis is not \"less subtle\" than Seraikella. It is a different expressive economy. A Seraikella dancer might use a tilt of the head; a Purulia dancer might use the entire body — leaping into a fierce pose to make the same emotional point land at the back of a festival crowd.",
    modelUrl: "/models/chhau-web-assets/traditional-dancer-copy.glb",
    modelScale: 1,
    audioUrl: null,
    audioLoop: false,
    showFallbackScene: false,
    ...defaultPageAppearance,
  },
  {
    id: "music-rhythm-and-instruments",
    pageNumber: 14,
    pageType: "content",
    title: "Music, Rhythm, and Instruments",
    body: "Chhau is unimaginable without its music. The dance does not happen on top of the music; it happens with it. The dancer and the drummer are reading each other in real time, and what looks like choreography is often a precise conversation.\n\n### The instruments\n\nThe instruments vary slightly between regions, but a typical Chhau ensemble is built around three families: large drums, smaller rhythm-keepers, and a melodic reed instrument.\n\n- **Dhol** — a double-headed drum slung across the shoulder, played with the hands and sometimes with a stick. The dhol carries the main rhythmic line and most of the cues the dancer follows.\n- **Dhamsa** — a large kettle drum with a deep, booming voice, often played with sticks. The dhamsa is the heavy beat under everything; it lays down the foundation against which the dhol's faster patterns sit.\n- **Mohuri** or **shehnai** — a double-reed wind instrument, somewhere between a shawm and an oboe in family. It carries the melodic line. In some Mayurbhanj contexts the instrument is referred to as the mohuri; in other contexts, especially Seraikella and parts of Purulia, the term *shehnai* is also used. The names are not perfectly interchangeable across the three regions, and which instrument is used can depend on the troupe.\n- **Nagara** — a smaller kettle drum used in some ensembles, especially in Purulia, where it supports the heavier rhythm of the dhamsa.\n\nSome troupes also use a **chad chadi** or smaller hand drum to add detail in the higher rhythmic register.\n\nThe exact line-up changes from troupe to troupe. There is no single \"correct\" Chhau orchestra. What is consistent is the architecture: heavy low drums, a fast lead drum, and a continuous melodic reed line.\n\n### Rhythm\n\nChhau rhythm is not built on the long compositional cycles you might find in some classical Indian music. It works in shorter, more punctuated patterns that signal what the dancer should do next: a build for a leap, a sharp accent for a landing, a steady walking pulse for an entry. The patterns repeat, but they also respond. A skilled dhol player watches the dancer constantly and can extend, shorten, or accent a phrase depending on how the dance is going.\n\nThe relationship is two-way. The dancer hits a position on a beat; the drummer accents that beat to make the position land. The dancer asks for more time on a held shape; the drummer stretches the pattern to give it.\n\n### Cues and tempo\n\nWithin a single performance, the tempo changes constantly. A piece might begin slow and steady, build into a faster middle section, climb into a peak with rapid drumming and large dance movements, then settle back into a calmer ending. The dancer follows the build; the drummer drives it. There is rarely silence — even the quietest moments usually have a soft pulse underneath.\n\nIf you watch a few Chhau performances back to back, you will start to recognise the cues. The change of tempo before a battle. The drum roll before a major leap. The single sharp strike that ends a phrase.\n\n> **Audio caption (slow entry pattern):** Listen for the steady, low pulse underneath. The dhamsa is doing the foundation work. Now notice how a sharper voice — the dhol — lays a quicker pattern on top. The dancer would enter on the dhol's accent, not on the dhamsa's pulse.\n\n> **Audio caption (battle build):** The tempo accelerates in two stages. The first stage is a moderate quickening that supports a phrase of attack. The second stage is a sudden push into a much faster rhythm — that is the moment when, in performance, the leaps and turns would be most dense.\n\n### A note on naming\n\nDrum patterns and rhythmic structures in Chhau music have local names, and not all troupes use the same ones. This book avoids listing specific pattern names unless they are widely agreed upon, because using one regional name as if it were universal would misrepresent the form.",
    modelUrl: null,
    modelScale: 1,
    audioUrl: null,
    audioLoop: false,
    showFallbackScene: false,
    ...defaultPageAppearance,
  },
  {
    id: "costumes-and-colour",
    pageNumber: 15,
    pageType: "content",
    title: "Costumes and Colour",
    body: "A Chhau costume does several things at once. It identifies the character, helps the dancer move, and reads clearly from a distance.\n\n### Common elements across the three traditions\n\nMost Chhau costumes share a few features:\n\n- A **dhoti** or wrapped lower garment, often pleated for movement, frequently in saffron, red, yellow, or other strong colours.\n- An **upper garment** that may be a simple vest, a wrapped cloth, or an ornamented top, depending on the character. In some traditions and characters the upper body is more bare and decorated with ornaments rather than cloth.\n- **Ornaments** — necklaces, armbands, anklets, headgear — that mark out gods, warriors, or other elevated characters.\n- **Bells** (*ghungroos*) on the ankles in some pieces and traditions, used to mark rhythm with footwork.\n\nThe colours used are usually bold — red, saffron, yellow, green, blue — so that the costume reads against the open-air settings where Chhau is often performed.\n\n### Mayurbhanj\n\nMayurbhanj costumes are clean and dance-oriented. Without a mask, the dancer's face and upper body are visible, and the costume's job is partly to frame the body's lines. A typical Mayurbhanj costume includes a fitted upper garment, a pleated lower wrap, ornaments at the wrists and neck, and a headpiece appropriate to the character. The overall design tends to be unfussy, so as not to obstruct the body's sculptural movement.\n\n### Seraikella\n\nSeraikella costumes are designed to work with the carved mask. The body's silhouette is kept clear and clean, so that when the dancer adopts a fixed pose, the line from headgear to ankle is unbroken. Colours tend to be balanced rather than overwhelming — strong, but in service of the mask, not competing with it.\n\n### Purulia\n\nPurulia costumes are designed for festival distance and big sound. They are usually more vivid in colour, more layered, and more dramatic in silhouette. The headgear can extend the height of the dancer significantly, especially in heroic and demonic characters; the upper body may carry several layers of decoration. Mirrors, sequins, and reflective trims are common, helping the costume catch light in outdoor settings.\n\nThe choice is aesthetic, not a sign of less refinement. A Purulia costume is designed to be seen — really seen — across a crowded festival ground at twilight, sometimes by hundreds of people standing on uneven ground. The scale of the costume answers the scale of the performance space.\n\n### Colour and character\n\nIn all three traditions, colour helps identify character. Gods are often shown in white, gold, or saffron. Goddess characters in battle are often in red. Demonic characters wear darker, heavier colours, with strong accents in the mask and headgear. Animal characters take colours associated with the animal — the peacock with blues and greens, the deer with browns and beiges. These conventions are flexible, not absolute, and individual troupes have their own variations.\n\n> **Image gallery caption:** Notice how the heroic character costumes tend to keep the body's silhouette clear, while demonic costumes deliberately expand it — wider headgear, broader shoulders, larger ornaments. Costume is part of the storytelling, not just decoration.",
    modelUrl: "/models/chhau-web-assets/traditional-dancer.glb",
    modelScale: 1,
    audioUrl: null,
    audioLoop: false,
    showFallbackScene: false,
    ...defaultPageAppearance,
  },
  {
    id: "masks",
    pageNumber: 16,
    pageType: "content",
    title: "Masks",
    body: "This section sits inside the shared \"Visual World\" of Chhau. Mayurbhanj does not use masks, so this chapter is mostly about Seraikella and Purulia. Notes on artisans and mask-making communities follow.\n\n### Why a mask\n\nA mask is a way of fixing a character. The carved face declares who is on stage — a god, a demon, an animal — and stays unchanging through the dance. That is not a limitation; it is a design choice. The mask says, \"This is the character,\" and frees the dancer to use the entire body for expression.\n\n### Seraikella masks\n\nSeraikella masks are usually small, smooth, and gentle. The features are carved with restraint. Even fierce characters in Seraikella tend to have masks that are calmer in expression than what you would see in some other Indian theatrical traditions. The colour palette is often light, with subtle gradations rather than strong contrasts.\n\nThe masks are typically made by hand from a base of cloth, mud or clay, and paper, layered and shaped over a mould before being painted and finished. The making is traditionally done by craft families in and around Seraikella; some of these families have been making masks for generations and are themselves part of the tradition's history [2][5].\n\n> **Image caption (Seraikella mask):** Note how the carved features are deliberately calm — almost neutral. The dancer's job is to animate this face through angle and pause, not to wear an \"angry mask\" for an angry moment.\n\n### Purulia masks\n\nPurulia masks are usually larger and more vivid. The features are pronounced — wide eyes, sometimes prominent teeth, sometimes elaborate headgear that extends well above the dancer's head. Colours are strong and contrasting: deep reds, yellows, greens, blacks, whites. Decorative elements — beads, foil, fabric flowers — are often added.\n\nThe making process is similar in principle to Seraikella's — layered mud and paper over a mould, then painted — but the scale and finish are different. A finished Purulia mask is a serious sculptural object. Some of the most respected Purulia masks come from the village of **Charida** (also spelled Choridda), in Baghmundi block of Purulia district, which is widely identified as the centre of Purulia mask-making [3][6].\n\n> **Image caption (Purulia mask):** The size, painted detail, and headgear are designed to read at distance. In open-air festival performance, the audience may be many metres away — the mask still has to land.\n\n### Mayurbhanj\n\nMayurbhanj does not use masks. The dancer's face is visible, and the makeup is usually understated — a clean look that lets the face do its own work. Headgear and costume carry the character identification that a mask would otherwise carry.\n\n### A note on the artisans\n\nMask-makers are part of the Chhau tradition, not its support staff. A Chhau performance depends on the mask as much as on the body. In Charida village in Purulia, in Seraikella town, and in associated villages and family workshops, mask-making is an inherited craft, and the recognition of these artisans through awards and cultural support has grown in recent decades. Specific artisan names should be checked against current sources before citing; some senior mask-makers have been recognised by the Sangeet Natak Akademi and by state cultural awards.",
    modelUrl: "/models/chhau-web-assets/chhau-figure-5a81ddf6.glb",
    modelScale: 1,
    audioUrl: null,
    audioLoop: false,
    showFallbackScene: false,
    ...defaultPageAppearance,
  },
  {
    id: "props",
    pageNumber: 17,
    pageType: "content",
    title: "Props",
    body: "Props in Chhau are usually weapon-like — swords, shields, bows, maces, tridents, lotuses, fans. They appear most often in heroic and divine roles, where the prop helps identify the character at a glance.\n\n### Use\n\nA weapon in Chhau is not used for realism. It is used as a graphic line in the body's silhouette. A raised sword changes the shape of the dancer. A held trident extends a god's identity. The prop becomes part of the pose. When the dancer takes a fixed position, the prop sits inside that position as if it had always been there.\n\nThis is why props in Chhau are often deliberately stylised. A sword may be longer or more curved than a realistic weapon. A trident may be enlarged. A bow may be carved more elaborately than a functional one. They are designed to be seen and to extend the body's line, not to be wielded literally.\n\n### Examples by character type\n\n- **Warrior / hero**: sword, shield, sometimes a bow.\n- **Demon (asura)**: heavy mace or club, sometimes a curved blade.\n- **God (Shiva)**: trident (*trishul*), drum (*damaru*), snake.\n- **Goddess (Durga, Kali)**: sword, trident, weapons in multiple hands (in stylised depictions).\n- **Krishna**: flute.\n- **Hunter / forester**: bow, arrow.\n- **Animal pieces**: usually no props; the body alone carries the role.\n\n### What to watch for\n\nA well-trained Chhau dancer treats a prop as part of the body. The prop is not waved separately; it moves with the line of the arm and the angle of the shoulder. In a leap, the prop arrives at the apex of the leap, not after. In a held pose, the prop is part of the silhouette, not an attachment to it.\n\n> **Sandbox caption (with prop):** Rotate to see how the line of the body and the line of the weapon meet at the centre. If you \"remove\" the weapon mentally, the body's pose still works — the prop completes the silhouette but doesn't carry it alone.",
    modelUrl: "/models/chhau-web-assets/martial-artist-with-sword.glb",
    modelScale: 1,
    modelOptions: [
      {
        label: "Warrior with sword",
        modelUrl: "/models/chhau-web-assets/martial-artist-with-sword.glb",
      },
      {
        label: "Longsword",
        modelUrl: "/models/chhau-web-assets/longsword.glb",
      },
      {
        label: "Round shield",
        modelUrl: "/models/chhau-web-assets/round-shield.glb",
      },
    ],
    audioUrl: null,
    audioLoop: false,
    showFallbackScene: false,
    ...defaultPageAppearance,
  },
  {
    id: "performance-space-training-and-community",
    pageNumber: 18,
    pageType: "content",
    title: "Performance Space, Training, and Community",
    body: "Chhau is not learned only in classrooms. It is learned in places with names — the *akhara*, the *asar*, the courtyard, the village ground, and now, increasingly, the institutional studio. Knowing where Chhau is taught helps explain why it looks the way it does.\n\n### The akhara\n\nThe *akhara* is, in its broadest sense, a training ground — a place where physical practice happens, traditionally for wrestling and martial training, and in the Chhau regions also for dance practice. Chhau akharas are often outdoors, with an open earth floor, sometimes covered, sometimes shaded by a roof. The community of dancers, drummers, and teachers gathers there regularly to train together.\n\nThe akhara is also a social structure, not only a place. A Chhau akhara has senior dancers who teach, junior dancers who learn, musicians who train alongside, and people of the community who watch, comment, and remember. This is not a formal hierarchy in the way a classroom is; it is more like an apprenticeship that runs through the rhythm of village life.\n\n### The asar\n\nThe *asar* is the performance space — the area where the dance is shown to an audience. Traditional Chhau performance is open-air: a clear earth ground with the audience seated or standing on three or four sides. The drums and reed instruments sit at one end. The dancers enter and exit through pathways left open in the audience.\n\nThis open-air setting shapes the form. Movements have to be readable at distance. Masks have to be large enough to be seen across a wide field. Costumes have to catch the light. The \"big\" feel of Chhau — its leaps, its sound, its colour — is partly a response to where it has historically been performed.\n\n### Institutions and academies\n\nAlongside the akhara, several institutions teach Chhau today. Among them:\n\n- The **Government Mayurbhanj Chhau Nritya Pratisthan** in Baripada, Odisha, which trains students and supports Mayurbhanj Chhau performance.\n- The **Government Chhau Dance Centre** in Seraikella, Jharkhand, associated with the development and continuation of Seraikella Chhau.\n- Centres and units associated with the Sangeet Natak Akademi and state cultural departments, which support Chhau through documentation, scholarships, and performance opportunities.\n- Smaller, locally run centres and individual gurus' schools across Purulia and the wider region.\n\nInstitutional teaching has changed Chhau in real ways — it has made formal training accessible to students who are not from traditional Chhau families, it has supported documentation, and it has carried Chhau onto national and international stages. It has also raised questions inside the community about how the institutional voice and the community voice fit together. Both exist now, alongside each other, and most senior practitioners have a foot in each.\n\n### The guru–shishya relationship\n\nThe teacher–student relationship in Chhau is close. A student does not learn primarily from books or written choreography; they learn by watching the teacher, copying, being corrected, and repeating. The teacher's body is the primary text. Many gurus speak of teaching Chhau as something passed not only through instruction but through long hours of shared practice — the student learns the dance partly by being inside the same training rhythm as the teacher, day after day.\n\nThis is not unique to Chhau; many Indian performance traditions share a similar transmission style. What is specific to Chhau is the physical cost of the practice. A serious Chhau student needs the kind of stamina that only sustained, repeated, embodied training builds — and that is what the guru–shishya relationship makes possible.\n\n### Community and continuity\n\nIt would be unfair to write about Chhau communities only in terms of struggle. Many Chhau dancers, musicians, and mask-makers come from backgrounds with limited economic resources, and the difficulty of making a sustainable living from the art form is real. But Chhau is not a \"vanishing tradition\" being kept alive on charity. It is being actively performed, taught, choreographed, and adapted by new generations. Festivals, school programmes, government schemes, and private patrons all play a part. So do the dancers and gurus who decide every day to keep training.\n\nThe honest picture is this: Chhau is alive, it has serious challenges, and it has serious people working to carry it forward. The work of this eBook is to make that ongoing life more visible, not to mourn a past one.",
    modelUrl: "/models/chhau-web-assets/performing-dancers.glb",
    modelScale: 1,
    modelOptions: [
      {
        label: "Performing dancers",
        modelUrl: "/models/chhau-web-assets/performing-dancers.glb",
      },
      {
        label: "Chhau group",
        modelUrl: "/models/chhau-web-assets/chhau-group-1.glb",
      },
      {
        label: "Dance troupe",
        modelUrl: "/models/chhau-web-assets/dance-troupe.glb",
      },
    ],
    audioUrl: null,
    audioLoop: false,
    showFallbackScene: false,
    ...defaultPageAppearance,
  },
  {
    id: "part-two-mayurbhanj",
    pageNumber: 19,
    pageType: "section",
    title: "Part Two — Mayurbhanj",
    body: "",
    modelUrl: null,
    modelScale: 1,
    audioUrl: null,
    audioLoop: false,
    showFallbackScene: false,
    ...defaultPageAppearance,
  },
  {
    id: "entering-mayurbhanj-chhau",
    pageNumber: 20,
    pageType: "content",
    title: "Entering Mayurbhanj Chhau",
    body: "Mayurbhanj Chhau is the Chhau of the **Mayurbhanj district** in northern Odisha, centred on the town of **Baripada**. It is the only one of the three Chhau traditions that is performed entirely without masks. That single fact reshapes everything else about it.\n\nWhen the face is part of the performance, the dancer's whole instrument changes. The eyes work. The mouth works. The way the head sits on the shoulders becomes visible in a way it cannot be when a mask is covering the face. Mayurbhanj uses all of that. At the same time, it has not lost the martial heritage of Chhau. The leaps, the wide low stances, the explosive turns, and the held positions are all there. What Mayurbhanj adds is the visible human face inside that martial body.\n\nThe result is a form that often looks sculptural. A Mayurbhanj dancer in a held position can resemble a temple sculpture come to life — clear lines, balanced weight, a calm face. Then, on the next drumbeat, the same body explodes into a leap, lands cleanly, and the face changes.\n\nMayurbhanj Chhau is recognised today as one of Odisha's major performance traditions, alongside Odissi. It is taught institutionally, performed across the state and beyond, and represented at festivals and on national stages. It also remains rooted in its own region — the Chaitra Parva festival in Baripada remains a central event in the Mayurbhanj Chhau calendar.\n\nThis section walks through Mayurbhanj specifically. The general history of Chhau is in the earlier chapters; here, the focus is on what makes Mayurbhanj its own tradition.",
    modelUrl: "/models/chhau-web-assets/human-figure-copy.glb",
    modelScale: 1,
    audioUrl: null,
    audioLoop: false,
    showFallbackScene: false,
    ...defaultPageAppearance,
  },
  {
    id: "mayurbhanj-patrons",
    pageNumber: 21,
    pageType: "content",
    title: "Mayurbhanj — Patrons",
    body: "The **Bhanj royal family** of Mayurbhanj is widely associated with the patronage of Mayurbhanj Chhau. The princely state of Mayurbhanj had Baripada as its seat, and the Bhanj rulers are commonly credited with supporting the form, both as a martial-derived court tradition and as a public performance during festival occasions [2][3].\n\nThe exact biographical details of which rulers did what, and when, are unevenly recorded in available public sources. What is clearer is that the royal household provided the conditions — a festival calendar, a regular audience, a system of support for musicians and dancers — under which Mayurbhanj Chhau matured as a stage form during the nineteenth and early twentieth centuries.\n\nAfter Indian independence and the merger of the princely states into the Republic in 1947–49, the patronage system shifted. The Government of Odisha and bodies like the Sangeet Natak Akademi took over much of the supporting role that royal households had previously played. Institutions like the **Government Mayurbhanj Chhau Nritya Pratisthan** in Baripada were set up to train students and continue the tradition under state cultural administration.\n\nThe continuity is real. The form did not disappear when the princely state did. It changed administrative homes, but the akharas, the families, and the festival calendar kept going.",
    modelUrl: null,
    modelScale: 1,
    audioUrl: null,
    audioLoop: false,
    showFallbackScene: false,
    ...defaultPageAppearance,
  },
  {
    id: "mayurbhanj-traditions",
    pageNumber: 22,
    pageType: "content",
    title: "Mayurbhanj — Traditions",
    body: "### Chaitra Parva\n\nThe central festival for Mayurbhanj Chhau is the **Chaitra Parva**, held in the Indian lunar month of Chaitra, usually in April. In Baripada the festival has historically been a major public event with multiple troupes performing over consecutive nights, with the community gathering to watch, comment, and celebrate. Chaitra Parva remains a key marker in the Mayurbhanj Chhau calendar today [2][1].\n\nThe festival context matters because it tells us how Mayurbhanj Chhau is meant to be encountered. It is not only a stage form for an indoor proscenium audience. It is also a community event for an open-air audience, performed over hours, in the rhythm of a town that has lived with this dance for generations.\n\n### Akharas\n\nMayurbhanj Chhau is traditionally trained in **akharas** — open-air practice grounds where senior dancers train younger ones in the foundational vocabulary of the form. Several akharas have existed in and around Baripada and the wider Mayurbhanj district, often associated with particular gurus or families. Some have continued for generations; others have come and gone. The institutional teaching at the Government Mayurbhanj Chhau Nritya Pratisthan today sits alongside the akhara system rather than replacing it.\n\n### Repertoire\n\nMayurbhanj Chhau has a wide repertoire that includes:\n\n- **Solo pieces** built on a single character or theme — a god, a goddess, a warrior, a peacock, a hunter.\n- **Battle pieces** between two characters, drawn from epic or mythological sources.\n- **Nature pieces** depicting animals, birds, hunters, or seasonal scenes.\n- **Group pieces** built around an episode from the Ramayana, the Mahabharata, or the Puranas.\n\nA famous repertoire piece often associated with Mayurbhanj is the solo *Mayur*, the peacock — a piece that uses the dancer's whole body to evoke the bird's alertness, its proud spread, and its sudden movements. There are many more, and different gurus emphasise different pieces from the inherited canon.",
    modelUrl: null,
    modelScale: 1,
    audioUrl: null,
    audioLoop: false,
    showFallbackScene: false,
    ...defaultPageAppearance,
  },
  {
    id: "mayurbhanj-movement-techniques",
    pageNumber: 23,
    pageType: "content",
    title: "Mayurbhanj — Movement Techniques",
    body: "This section adds detail to the general \"Movement Vocabulary\" chapter, focusing on what is specific to Mayurbhanj.\n\n### The body without a mask\n\nBecause the face is visible, Mayurbhanj training pays close attention to the carriage of the head and neck. A subtle tilt of the head is a real expressive event. The dancer learns to direct the gaze deliberately — to a person, a god, an imagined object, a memory. Eye direction is a part of the choreography, not an afterthought.\n\n### Uflis in Mayurbhanj\n\nMayurbhanj's uflis are recognised as one of the strongest training systems among the three Chhau traditions. The basic exercises build the wide low stance, the leap, the torso work, and the rhythmic responsiveness in long, repeated sequences. A student may spend months on these foundational exercises before progressing to repertoire work.\n\n### Chaalis\n\nThe walking gaits are named and codified to some extent inside Mayurbhanj training. Different gurus may use slightly different names, but the categories are recognisable: gaits for gods, gaits for warriors, gaits for animals, gaits for ordinary characters. Where this book uses a specific term, it is because that term is widely attested in publicly available Mayurbhanj documentation.\n\n### Topkas\n\nCombat phrases — *topkas* — are central to Mayurbhanj repertoire, especially in battle pieces. They are performed cleanly, with clear attack and release, and they often anchor the dramatic climax of a group piece.\n\n### Sculptural pose work\n\nA distinctive feature of Mayurbhanj is its love of sculptural pose. The dancer arrives at clear, balanced positions that hold for the length of a drum phrase before resolving into the next movement. These positions often echo temple sculpture and have a deliberate visual relationship with the broader Odishan sculptural tradition.\n\n> **Sandbox caption (Mayurbhanj sculptural pose):** Rotate to view the pose from the front, then from the side. Look at how the spine, the lifted arm, and the bent knee form a clear triangular line. This is not coincidence; the dancer is trained to find these shapes inside the body.",
    modelUrl: "/models/chhau-web-assets/martial-artist-2.glb",
    modelScale: 1,
    audioUrl: null,
    audioLoop: false,
    showFallbackScene: false,
    ...defaultPageAppearance,
  },
  {
    id: "mayurbhanj-evolution-and-pioneers",
    pageNumber: 24,
    pageType: "content",
    title: "Mayurbhanj — Evolution and Pioneers",
    body: "Mayurbhanj Chhau in the twentieth century moved from a royally supported festival form into an institutionally taught and nationally recognised tradition. That transition was carried by several generations of gurus and dancers.\n\nAmong the senior gurus widely associated with Mayurbhanj Chhau in the twentieth century are figures who have been recognised by the Sangeet Natak Akademi and through national honours such as the Padma Shri. This eBook avoids listing names without verification; readers who want a precise list of recipients and dates can consult the **Sangeet Natak Akademi Awards** archive and the **Padma Awards** archive maintained by the Government of India, both of which are publicly searchable.\n\nWhat can be said with confidence is that the form has been carried by a community of teachers and performers across Baripada, the wider Mayurbhanj district, and the cities where Mayurbhanj-trained dancers now teach and perform. The **Government Mayurbhanj Chhau Nritya Pratisthan** in Baripada has been one of the formal centres of this continuation. Several Mayurbhanj-trained dancers have also taken the form to wider audiences — performing at national festivals, choreographing new work using Mayurbhanj vocabulary, and teaching it in cities far from Mayurbhanj district.\n\nToday, Mayurbhanj Chhau is being practiced by younger dancers, including women — a notable shift, since Chhau performance was historically male-dominated. The form is also being adapted into contemporary choreographic work, with Mayurbhanj-trained dancers collaborating with practitioners of Odissi, contemporary dance, and theatre.\n\n(*A note: where this book later integrates specific interviews or named living-artist profiles, those will be verified, and the speaker's voice will be preserved. The author has chosen not to fabricate names or attributions in their absence.*)",
    modelUrl: null,
    modelScale: 1,
    audioUrl: null,
    audioLoop: false,
    showFallbackScene: false,
    ...defaultPageAppearance,
  },
  {
    id: "mayurbhanj-performance-lab",
    pageNumber: 25,
    pageType: "content",
    title: "Mayurbhanj — Performance Lab",
    body: "This is a worked walk-through of a Mayurbhanj solo piece, written so that the reader can follow along with a video or 3D sandbox of the dance. The example used here is a generic battle or warrior solo, of the kind that is common in Mayurbhanj repertoire. Where a specific piece is linked in the interactive layer, the same structure will guide the viewer.\n\n### Opening\n\nThe dancer enters the asar in a slow, deliberate walk — a warrior's *chaali*. The body is upright, the chest open, the steps wide and grounded. The drum holds a steady, low rhythm. The audience reads the character before any action has begun: this is a serious figure, alert, prepared.\n\n> **Watch:** The dancer's eyes scan the space during the entry. They are not blank. The warrior is looking — for an enemy, for the field, for what is about to happen.\n\n### First phrase: address\n\nThe dancer arrives at the centre of the space and takes a clear sculptural pose, holding the position for a full drum phrase. This is the \"address\" — the warrior presents themselves to the audience and to the imagined world. The drumming softens to make the silence around the pose readable.\n\n### Build\n\nThe drum picks up. The dancer begins a series of stronger movements — turning, opening the arms, shifting weight from one foot to the other in measured steps. The eye direction changes with each phrase, marking out invisible directions in the space. The character is now searching.\n\n### Combat phrases\n\nThe drum accelerates. The dancer launches into a sequence of *topkas* — combat phrases. Each one is short: an attack, a parry, a recovery. Between phrases, the dancer settles briefly into a low stance before the next phrase begins.\n\n> **Watch:** The leap that lands the second combat phrase begins in the torso. The chest contracts a fraction of a second before the feet leave the ground. If you slow the video, you will see the engine.\n\n### Climax\n\nThe drumming climbs to its fastest tempo. The dancer enters the most demanding sequence of the piece — quick turns, rapid changes of direction, a high leap, and a final landing in a strong fixed position. The drum hits a final accent that locks the pose.\n\n### Resolution\n\nThe drumming softens. The dancer holds the final pose for several beats, then resolves into a calm closing gait — a chaali that returns the warrior to a state of readiness rather than a state of victory. The piece does not end on a celebration; it ends on stillness.\n\n> **Watch:** Look at the dancer's face in the closing seconds. The body has done a great deal of work, but the face is set, calm. That control is part of what Mayurbhanj is asking the dancer to develop.",
    modelUrl: "/models/chhau-web-assets/martial-artist-with-sword.glb",
    modelScale: 1,
    modelOptions: [
      {
        label: "Warrior solo",
        modelUrl: "/models/chhau-web-assets/martial-artist-with-sword.glb",
      },
      {
        label: "Sword detail",
        modelUrl: "/models/chhau-web-assets/longsword.glb",
      },
    ],
    audioUrl: null,
    audioLoop: false,
    showFallbackScene: false,
    ...defaultPageAppearance,
  },
  {
    id: "part-three-seraikella",
    pageNumber: 26,
    pageType: "section",
    title: "Part Three — Seraikella",
    body: "",
    modelUrl: null,
    modelScale: 1,
    audioUrl: null,
    audioLoop: false,
    showFallbackScene: false,
    ...defaultPageAppearance,
  },
  {
    id: "entering-seraikella-chhau",
    pageNumber: 27,
    pageType: "content",
    title: "Entering Seraikella Chhau",
    body: "Seraikella Chhau comes from the town of **Seraikella**, the historic capital of the former princely state of Seraikella, now part of **Seraikella-Kharsawan district** in **Jharkhand**.\n\nIf Mayurbhanj asks the dancer to use the face, Seraikella asks the dancer to give the face up. The mask is fixed. It does not change. And the dancer's entire expressive work has to happen through the body — through angle, line, pause, and rhythm.\n\nThe first time you watch a great Seraikella dancer, you may not notice how much is happening. The movements are smaller than in Purulia, the tempo is often slower, and the masks are quiet in expression. What you have to learn to see is how the dancer is animating the mask. A tilt of the head. A slow turn of the chest. A hand placed against the body. Each of these is doing the work that a face would do in another form — and once you start watching for it, Seraikella reveals a level of detail that is easy to miss the first time.\n\nSeraikella Chhau is sometimes described as the most \"courtly\" of the three traditions, partly because of its close relationship with the **Singh Deo royal family** of Seraikella, who are widely credited with shaping the form into its present masked, lyrical style during the nineteenth and twentieth centuries [2][1]. That characterisation is not meant to imply a hierarchy — it is a description of the tradition's social history.",
    modelUrl: "/models/chhau-web-assets/dancer-character.glb",
    modelScale: 1,
    audioUrl: null,
    audioLoop: false,
    showFallbackScene: false,
    ...defaultPageAppearance,
  },
  {
    id: "seraikella-patrons",
    pageNumber: 28,
    pageType: "content",
    title: "Seraikella — Patrons",
    body: "The **Singh Deo royal family** of Seraikella is widely associated with the development of Seraikella Chhau. Members of the royal household are credited in public sources with patronising, choreographing, and personally performing the form during the late nineteenth and twentieth centuries, including in international tours that brought Seraikella Chhau to European audiences as early as the 1930s [2][1].\n\nThe royal patronage shaped Seraikella in real ways. The relative restraint of the form, its emphasis on lyrical movement and refined pose work, and its lighter, more delicately carved masks are all consistent with a form that developed within a courtly setting — where the audience was small, attentive, and close, and where subtlety could be read.\n\nAfter the merger of the princely state into the Indian Union, the Government of Jharkhand and bodies like the Sangeet Natak Akademi took over much of the institutional support for Seraikella Chhau. The **Government Chhau Dance Centre** in Seraikella is part of this institutional continuation, training students and supporting the tradition.\n\nSpecific names of royal patrons, choreographer-princes, and senior gurus from the twentieth century are documented in Sangeet Natak Akademi sources and biographical entries; readers who want precise dates and attributions should consult those records directly.",
    modelUrl: null,
    modelScale: 1,
    audioUrl: null,
    audioLoop: false,
    showFallbackScene: false,
    ...defaultPageAppearance,
  },
  {
    id: "seraikella-traditions",
    pageNumber: 29,
    pageType: "content",
    title: "Seraikella — Traditions",
    body: "### Chaitra Parva in Seraikella\n\nThe **Chaitra Parva** festival is central to Seraikella Chhau, as it is to Mayurbhanj. In Seraikella, the festival is closely linked to the worship of Ardhanarishvara (the half-male, half-female form of Shiva and Parvati) and to a calendar of rituals and processions associated with the local royal household and community. Chhau performances during Chaitra Parva have historically been a defining moment in the Seraikella performance year [2][1].\n\n### Repertoire\n\nSeraikella repertoire includes pieces drawn from mythology, nature, and abstract themes. Some pieces well-documented in public sources include depictions of the hunter and the deer, of Krishna and Radha, of nature themes such as the rainbow or the night, and of mythological episodes from Shiva, Parvati, and other deities. These are not the only Seraikella pieces — they are examples of the kinds of themes Seraikella favours.\n\nWhat is distinctive is the *register*. Seraikella often takes themes that could be performed loudly elsewhere and performs them quietly. A piece about night, or about longing, or about a god in contemplation suits Seraikella's expressive economy especially well.\n\n### Akhara and training\n\nSeraikella Chhau is trained in akharas in and around Seraikella town and at the Government Chhau Dance Centre. Senior gurus work with younger students over years, building the foundational vocabulary first and only later moving to the masked repertoire. A student typically learns to dance unmasked, with the face visible, for a long time before they put on the mask — because the body has to be capable of carrying expression on its own before the face is taken away.",
    modelUrl: null,
    modelScale: 1,
    audioUrl: null,
    audioLoop: false,
    showFallbackScene: false,
    ...defaultPageAppearance,
  },
  {
    id: "seraikella-movement-techniques",
    pageNumber: 30,
    pageType: "content",
    title: "Seraikella — Movement Techniques",
    body: "### Animating a fixed face\n\nThe first and most important Seraikella skill is learning to animate a mask. The mask cannot smile, cannot frown, cannot blink. Everything that would normally be communicated by the face has to be communicated by the body.\n\nSeraikella training pays close attention to:\n\n- **The head and neck** — small tilts and turns that change how the mask is positioned in space.\n- **The chest and shoulders** — lifts, drops, rotations that change the mask's emotional reading.\n- **The hand placement** — where the hand sits relative to the mask, and what that relationship suggests.\n- **Pauses** — held stillnesses that give the audience time to read the body's position.\n\n### Lyrical movement\n\nSeraikella movement is often described as lyrical — flowing, continuous, with smooth transitions between positions. Even in dramatic moments, Seraikella tends to choose a curved line over a sharp one. This is one of the features that distinguishes it from the more openly muscular Purulia style.\n\n### Restraint\n\nRestraint is itself a technique in Seraikella. A dancer learns *not* to do the obvious large movement. A piece about anger does not become an angry dance; it becomes a dance about controlling anger. A piece about love does not become an embrace; it becomes a longing.\n\nThis is not to say Seraikella is unemotional. It is to say that its emotions are read at a smaller scale, and the audience is expected to lean in to see them.\n\n> **Sandbox caption (Seraikella):** Notice how the silhouette stays clean even as the dancer changes \"feeling.\" The body's outer shape does not get wider or louder. The change is inside the silhouette — in the angle of the head, the placement of the hand.",
    modelUrl: "/models/chhau-web-assets/chhau-figure-5a81ddf6.glb",
    modelScale: 1,
    audioUrl: null,
    audioLoop: false,
    showFallbackScene: false,
    ...defaultPageAppearance,
  },
  {
    id: "seraikella-evolution-and-pioneers",
    pageNumber: 31,
    pageType: "content",
    title: "Seraikella — Evolution and Pioneers",
    body: "Seraikella Chhau's twentieth-century history is unusually well-documented for an eastern Indian performance tradition, in part because of its early international visibility. Members of the Seraikella royal household are credited with leading and performing in tours that brought the form to European audiences in the 1930s, including a documented presentation in Europe that is often cited as one of the earliest international showings of a Chhau tradition [2][1].\n\nIn the second half of the twentieth century, Seraikella Chhau was carried forward by gurus and dancers who taught at the Government Chhau Dance Centre, performed at national festivals, and trained students inside and outside Seraikella. Recipients of Sangeet Natak Akademi awards and Padma honours in Seraikella Chhau are listed in the public archives of those bodies; this eBook directs readers there for verified names and dates.\n\nToday, Seraikella Chhau continues to be taught and performed. The challenges are real — sustaining institutional support, drawing new students into a demanding form, and protecting the careful subtlety of the style against pressures to perform \"louder\" for festival markets. But the form is being actively carried by a community of teachers, students, mask-makers, and musicians who are still based in and around Seraikella.",
    modelUrl: null,
    modelScale: 1,
    audioUrl: null,
    audioLoop: false,
    showFallbackScene: false,
    ...defaultPageAppearance,
  },
  {
    id: "seraikella-performance-lab",
    pageNumber: 32,
    pageType: "content",
    title: "Seraikella — Performance Lab",
    body: "A worked walk-through of a Seraikella solo, in the style typical of the tradition. The example here is a god-character solo of the kind that Seraikella repertoire often features.\n\n### Opening\n\nThe dancer enters slowly. The mask is fixed, but the body's posture announces the character — a deity, calm, present. The drum is light, the reed instrument carries a long, sustained line. The audience does not need to be told who is on stage; the silhouette is enough.\n\n> **Watch:** Note how slowly the entry unfolds. Seraikella often does not rush its first phrase. The audience is meant to settle into the character before anything happens.\n\n### First phrase: presence\n\nThe dancer arrives at the centre and holds a still position. The mask faces the audience. One hand rests against the chest; the other extends out. The position holds for several beats. Nothing is happening except presence.\n\n### Build: gesture\n\nThe dancer begins a sequence of slow, lyrical movements. The hand moves through the air in a curved line. The chest lifts slightly. The mask tilts upward by a small degree — and suddenly the god seems to be looking at the sky. The audience can feel the change without any large movement having occurred.\n\n### A pause\n\nThe dancer settles into another held position. This time the mask is angled downward, the shoulders are softer. The character has changed mood — perhaps contemplation, perhaps tenderness — and the change has been made entirely through angle.\n\n### Movement phrase\n\nThe drum picks up slightly. The dancer moves through a curving sequence of steps and gestures, building intensity without ever entering the muscular register of Purulia. There may be a small turn, a small rise in the chest, a longer extension of the arm. The intensity is being managed inside a tight aesthetic frame.\n\n### Closing\n\nThe dancer returns to a held position close to the opening pose, but with a subtle difference — the angle of the mask, the placement of the hand. The audience can read the change. The piece has not \"told a story\" in a narrative sense; it has shown a character moving through a sequence of inner states. The closing pose holds. The drum softens. The reed line releases.\n\n> **Watch:** The piece ends in stillness. The temptation, for a contemporary audience, is to applaud as soon as the music stops. Seraikella often asks the audience to hold the silence for a moment. That silence is part of the form.",
    modelUrl: "/models/chhau-web-assets/dancer-character.glb",
    modelScale: 1,
    audioUrl: null,
    audioLoop: false,
    showFallbackScene: false,
    ...defaultPageAppearance,
  },
  {
    id: "part-four-purulia",
    pageNumber: 33,
    pageType: "section",
    title: "Part Four — Purulia",
    body: "",
    modelUrl: null,
    modelScale: 1,
    audioUrl: null,
    audioLoop: false,
    showFallbackScene: false,
    ...defaultPageAppearance,
  },
  {
    id: "entering-purulia-chhau",
    pageNumber: 34,
    pageType: "content",
    title: "Entering Purulia Chhau",
    body: "Purulia Chhau comes from the **Purulia district** of **southwestern West Bengal**, on the eastern side of the Chota Nagpur plateau. Unlike Mayurbhanj and Seraikella, it did not develop under the close patronage of a single royal household; it grew up in villages, in the akharas of small troupes, and in the festival calendar of the communities who lived in and around Purulia.\n\nThe result is a form with a different social biography. Purulia Chhau is community-rooted in a way that is visible in its performance: the troupes are family- or village-based, the audience is often a whole village or town, and the performance environment is usually outdoors, sometimes at night, with the audience surrounding the dancers on multiple sides.\n\nPurulia is the most openly muscular of the three Chhau traditions. The leaps are big. The masks are large. The drumming is heavy. The acrobatic elements — spins, jumps, in some cases somersaults — are more prominent than in Mayurbhanj or Seraikella. It is the Chhau that translates most directly to a festival crowd, and it has historically been the version of Chhau most associated, in popular media, with big spectacle and bold mask design.\n\nThat popular framing has not always served Purulia well. It is easy to read the spectacle as \"less refined\" and miss what is actually happening inside it. Purulia has its own grammar. Its leaps are not undisciplined; they are choreographed to specific drum patterns and combat motifs. Its masks are not just decorative; they are designed for a specific kind of seeing. Its emotional register is not \"louder than Seraikella\"; it is differently scaled, for a different audience.\n\nPurulia Chhau is alive. The village of **Charida** in Baghmundi block of Purulia is widely recognised as a centre of Chhau mask-making, and the surrounding region has many active troupes [3]. The form has reached national and international audiences and is supported by state and central government bodies, but its main social home remains the villages and festivals of Purulia.",
    modelUrl: "/models/chhau-web-assets/dance-troupe.glb",
    modelScale: 1,
    audioUrl: null,
    audioLoop: false,
    showFallbackScene: false,
    ...defaultPageAppearance,
  },
  {
    id: "purulia-patrons",
    pageNumber: 35,
    pageType: "content",
    title: "Purulia — Patrons",
    body: "Purulia Chhau did not develop under a single royal patron in the way Seraikella did. Its history is told more through villages, troupes, and individual masters than through a court.\n\nLocal landlords and zamindars in the Purulia region appear in some accounts as patrons of specific troupes [9]. More broadly, the patronage system for Purulia has been communal — village committees, festival organisers, temple trusts, and local audiences who support the form through attendance, sponsorship of performances during festivals, and informal patronage of particular families of dancers and mask-makers.\n\nFrom the mid-twentieth century onward, public institutions have played an increasing role. The Government of West Bengal's cultural departments, the Sangeet Natak Akademi, and central Ministry of Culture schemes have supported documentation, training centres, and the recognition of senior artists. The artisans of Charida village in particular have been the subject of state and central support, with mask-making recognised as a heritage craft [3][6].\n\nThe community character of Purulia patronage is one of the form's strengths. It means Purulia Chhau is not dependent on a single institutional source; it is held up by many small ones. It is also one of its vulnerabilities — when individual troupes lose patrons, when festivals decline, when younger dancers have to leave for other work, the form feels the loss directly.",
    modelUrl: null,
    modelScale: 1,
    audioUrl: null,
    audioLoop: false,
    showFallbackScene: false,
    ...defaultPageAppearance,
  },
  {
    id: "purulia-traditions",
    pageNumber: 36,
    pageType: "content",
    title: "Purulia — Traditions",
    body: "### Festival calendar\n\nPurulia Chhau is performed across multiple community festivals through the year. **Chaitra Parva** in April remains a major occasion, with all-night performances in some villages associated with the **Gajan** festival of Shiva and the broader spring ritual calendar [9][2]. Outside Chaitra Parva, Purulia performances also happen during other community gatherings, public events, and increasingly at urban festivals.\n\nThe relationship between Purulia Chhau and the Gajan festival of Shiva is one of the most distinctive features of the tradition. The form sits inside a broader ritual ecology — fasting, processions, all-night performance — that gives Purulia Chhau a character not just of a dance but of a community event.\n\n### Troupes\n\nPurulia Chhau is typically performed by **troupes** rather than by individual soloists. A troupe is usually a group of dancers, musicians, and a leader, often connected by family or village. The troupe is the basic unit of performance: it is hired together, it rehearses together, and it shares the income from performance.\n\nThis shapes the repertoire. Purulia pieces tend to be group-based, with multiple characters on stage at once, and battle and confrontation scenes that need several bodies to read properly. Solos exist but are less central than in Seraikella or Mayurbhanj.\n\n### Stories\n\nPurulia repertoire draws heavily on the epics and Puranas — episodes from the Mahabharata, the Ramayana, and stories of Durga, Kali, Mahishasura, Shiva, and various demons and heroes. Battle pieces and goddess pieces are especially popular, partly because they suit the form's combat vocabulary and its larger, more spectacular masks.",
    modelUrl: null,
    modelScale: 1,
    audioUrl: null,
    audioLoop: false,
    showFallbackScene: false,
    ...defaultPageAppearance,
  },
  {
    id: "purulia-movement-techniques",
    pageNumber: 37,
    pageType: "content",
    title: "Purulia — Movement Techniques",
    body: "### Scale\n\nThe first thing to understand about Purulia movement is its scale. Purulia leaps are larger, its turns are quicker, and its body language is broader than in the other two Chhau traditions. This is not a matter of energy alone; it is a matter of *design*. Purulia is built to read at distance, in an open-air space, often at night with limited light, to an audience that may be standing across a wide festival ground.\n\nA movement that looks \"too big\" in a small studio space is the right size in the field where Purulia actually lives.\n\n### Acrobatics\n\nPurulia uses acrobatic elements — somersaults, ground spins, dramatic falls — that are less common in Mayurbhanj or Seraikella. These are not gymnastic tricks. They are part of the storytelling. A somersault might depict a demon being thrown to the ground; a sudden ground spin might depict a fall in combat. The acrobatics serve the narrative.\n\n### Combat phrases\n\nPurulia is unusually rich in combat motifs. Battle scenes can run for many minutes, with two or more dancers performing alternating attack and defence phrases. The drum drives these phrases with a particular intensity, building tempo into a climactic resolution.\n\n> **Sandbox caption (Purulia combat):** Use the two-figure sandbox. Notice that the two dancers are not just trading hits — they are reading each other. A strike from one is answered by a parry from the other on the next drum accent. The whole exchange is timed by the music.\n\n### The mask in motion\n\nA Purulia dancer carries a large, often heavy mask, sometimes with extended headgear. Performing inside that mask — with restricted vision, with the additional weight, and with the need to keep the mask facing the audience for visual readability — is itself a skill. Senior Purulia gurus often speak about the discipline of dancing inside a mask: how to find the audience without seeing them clearly, how to keep the mask's face turned outward even during a turn, how to land safely from a leap when sightlines are reduced.\n\nThis is a particular kind of training that does not translate to a casual reading of the form.\n\n### Stamina\n\nA Purulia performance can run for hours, especially in a traditional festival context. The dancers, drummers, and reed players are all under sustained physical demand. The training reflects this — long, repetitive practice that builds endurance for the actual length of performance.",
    modelUrl: "/models/chhau-web-assets/martial-artist-duo.glb",
    modelScale: 1,
    audioUrl: null,
    audioLoop: false,
    showFallbackScene: false,
    ...defaultPageAppearance,
  },
  {
    id: "purulia-evolution-and-pioneers",
    pageNumber: 38,
    pageType: "content",
    title: "Purulia — Evolution and Pioneers",
    body: "Purulia Chhau was studied and documented in detail by the scholar **Ashutosh Bhattacharya**, whose book *Chhau Dance of Purulia* (1972) remains one of the foundational academic references for the form [9]. Bhattacharya's documentation, and the wider critical attention that followed, played a significant role in bringing Purulia Chhau into national and academic visibility from the 1960s onward.\n\nSenior Purulia dancers and troupe leaders from the twentieth century who have been recognised through Sangeet Natak Akademi awards and national honours such as the Padma Shri are listed in the public archives of those bodies. As elsewhere in this eBook, the author has chosen to direct readers to those verified archives rather than reproduce specific names and dates without independent verification.\n\nThe artisans of **Charida** village have, in recent decades, received increasing recognition for their role as the makers of Purulia Chhau masks [3][6]. Several Charida mask-makers have been honoured by state and central cultural bodies; readers can consult the Indian Culture Portal and Government of West Bengal cultural resources for current listings.\n\nToday, Purulia Chhau is being performed by both established troupes and newer groups, including some that include women performers — a more recent development in a historically male-dominated form. The form has also become a recognised cultural emblem of the Purulia region, with festivals, tourism programmes, and international performances supporting its visibility.\n\nThe challenges are real. Younger members of Chhau families have, in some cases, moved away from performance because of the economic difficulty of sustaining it. Mask-making is similarly under pressure. State support has helped, but the form's continuation depends on a delicate combination of public funding, community patronage, and the personal commitment of the families who continue to teach and perform.",
    modelUrl: null,
    modelScale: 1,
    audioUrl: null,
    audioLoop: false,
    showFallbackScene: false,
    ...defaultPageAppearance,
  },
  {
    id: "purulia-performance-lab",
    pageNumber: 39,
    pageType: "content",
    title: "Purulia — Performance Lab",
    body: "A worked walk-through of a Purulia group piece, of the kind common in festival performance. The example used here is a goddess-and-demon battle piece — one of the signature kinds of Purulia repertoire.\n\n### Opening\n\nThe drums begin first. The dhamsa lays a heavy low pulse; the dhol layers a faster pattern on top; the mohuri or shehnai carries a long melodic line. The audience hears the music before they see anyone. The drumming continues for some minutes — an extended musical entry that builds anticipation.\n\n> **Listen:** This is one of the ways Purulia begins. The music has time to settle the audience. By the time the first dancer enters, the rhythmic environment is already established.\n\n### Entry of the demon\n\nThe demon character enters first. The mask is large, vividly painted, often with prominent features. The headgear extends above the dancer's head. The walk is wide, the chest is forward, the shoulders are open. The character announces itself.\n\n> **Watch:** A Purulia demon's entry is not a sneak. It is a declaration. The character is supposed to be visible from across the field.\n\n### Entry of the goddess\n\nThe goddess character enters from the opposite side. Her mask is also large but balanced differently — usually with a calmer expression, framed by an elaborate headgear. She carries weapons in stylised hands. Her chaali is wide and deliberate.\n\n### Confrontation\n\nThe two characters approach each other in measured phrases. There is a moment of address — both characters arrived at the centre of the asar, each in a clear pose, the drums softening. The audience reads the meeting.\n\n### Battle\n\nThe drums accelerate. The two dancers begin a combat sequence, trading attack and parry phrases. Leaps, turns, and combat motifs are layered in. There may be a moment when one dancer is brought to the ground and the other stands over them. The rhythm climbs continuously.\n\n> **Watch:** Look at the bodies, not just the masks. The dancers' shoulders, hips, and stances are doing the storytelling; the masks are the headlines, the body is the article.\n\n### Climax\n\nThe drums reach their fastest tempo. The goddess launches the final attack — usually a large leap or a strike — and the demon falls. The fall is choreographed; the dancer drops in a controlled manner that reads as defeat without injury.\n\n### Resolution\n\nThe drums soften. The goddess takes a victorious pose over the fallen demon. The pose holds for several beats. The audience reads the resolution. Then the dancers exit, often together, leaving the asar to the musicians, who close the piece with a final rhythmic cadence.\n\n> **Watch:** The piece does not end with the killing. It ends with the held pose afterwards. That stillness is the climax, not the strike. Purulia, for all its energy, knows the value of the held moment as well.",
    modelUrl: "/models/chhau-web-assets/dance-troupe.glb",
    modelScale: 1,
    modelOptions: [
      {
        label: "Dance troupe",
        modelUrl: "/models/chhau-web-assets/dance-troupe.glb",
      },
      {
        label: "Combat duo",
        modelUrl: "/models/chhau-web-assets/martial-artist-duo.glb",
      },
      {
        label: "Chhau group",
        modelUrl: "/models/chhau-web-assets/chhau-group-1.glb",
      },
    ],
    audioUrl: null,
    audioLoop: false,
    showFallbackScene: false,
    ...defaultPageAppearance,
  },
  {
    id: "part-five-glossary-index-and-library",
    pageNumber: 40,
    pageType: "section",
    title: "Part Five — Glossary, Index, and Library",
    body: "",
    modelUrl: null,
    modelScale: 1,
    audioUrl: null,
    audioLoop: false,
    showFallbackScene: false,
    ...defaultPageAppearance,
  },
  {
    id: "glossary",
    pageNumber: 41,
    pageType: "content",
    title: "Glossary",
    body: "These are short, plain-language definitions of terms used in this eBook. They are working definitions for the reader, not full encyclopedia entries.\n\n**Abhinaya** — The Indian performance vocabulary for expression and acting in dance and theatre. Used here only as broader Indian context, not as a Chhau-specific system.\n\n**Akhara** — A traditional training ground for martial practice and, in the Chhau regions, for Chhau practice. Also the social structure of teachers, students, and musicians who train together.\n\n**Asar** — The performance space in Chhau, traditionally an open-air ground with the audience surrounding the dancers.\n\n**Chaali** — A stylised walk or gait. Different chaalis identify different characters: gods, warriors, animals, ordinary characters.\n\n**Chaitra Parva** — The festival in the Indian lunar month of Chaitra (usually April) during which Chhau is traditionally performed in Mayurbhanj and Seraikella, and across many parts of Purulia.\n\n**Charida** — Village in Baghmundi block of Purulia district, West Bengal, widely recognised as a centre of Purulia Chhau mask-making.\n\n**Chhau** — The performance form covered by this eBook. Etymology is debated; possible roots include *chhaya* (shadow / image), *chhauni* (military camp), and regional words for attack.\n\n**Dhamsa** — A large kettle drum with a deep, booming voice, played with sticks; one of the central instruments of Chhau music.\n\n**Dhol** — A double-headed drum carried across the shoulder, played with hands and sticks; carries the main rhythmic line in Chhau ensembles.\n\n**Gajan** — A spring festival of Shiva celebrated in parts of eastern India; in Purulia, Chhau performances are sometimes associated with the Gajan and Chaitra Parva ritual calendar.\n\n**Guru–shishya** — The teacher–student relationship in Indian performance traditions, in which transmission happens primarily through embodied teaching and long-term apprenticeship.\n\n**Mohuri** — A double-reed wind instrument used in Chhau music, especially in Mayurbhanj. Sometimes also referred to as *shehnai* in other regional contexts.\n\n**Nagara** — A smaller kettle drum used in some Chhau ensembles, especially in Purulia.\n\n**Paika akhara** — A traditional school of martial training in eastern India; widely cited as one of the historical roots of Chhau's combat vocabulary.\n\n**Shehnai** — A double-reed wind instrument with a long history in Indian music; used in some Chhau ensembles, especially in Seraikella and parts of Purulia.\n\n**Topka** — A short combat phrase in Chhau, drawn from the form's martial heritage; typically involves attack and recovery in a clear, readable shape.\n\n**Uflis** — The foundational training exercises of Chhau, especially well-developed in Mayurbhanj. Uflis build stance, leap, torso work, and rhythmic responsiveness.",
    modelUrl: null,
    modelScale: 1,
    audioUrl: null,
    audioLoop: false,
    showFallbackScene: false,
    ...defaultPageAppearance,
  },
  {
    id: "index-of-people-places-and-institutions",
    pageNumber: 42,
    pageType: "content",
    title: "Index of People, Places, and Institutions",
    body: "This is a reading index, not an exhaustive list. Spellings can vary in English transliteration; the most common forms are used here.\n\n**Baripada** — Town in Mayurbhanj district, Odisha; the historic seat of the Bhanj royal family and the institutional centre of Mayurbhanj Chhau.\n\n**Bhanj royal family** — The ruling family of the former princely state of Mayurbhanj; widely associated with the patronage of Mayurbhanj Chhau.\n\n**Charida** — Village in Purulia district, West Bengal; centre of Purulia Chhau mask-making.\n\n**Government Chhau Dance Centre, Seraikella** — A government-supported training centre for Seraikella Chhau.\n\n**Government Mayurbhanj Chhau Nritya Pratisthan, Baripada** — A government training and performance institution for Mayurbhanj Chhau.\n\n**Mayurbhanj** — District in northern Odisha, home of the Mayurbhanj Chhau tradition.\n\n**Purulia** — District in southwestern West Bengal, home of the Purulia Chhau tradition.\n\n**Sangeet Natak Akademi (SNA)** — The national academy for music, dance, and drama in India; one of the major sources of documentation and award recognition for Chhau artists.\n\n**Seraikella** — Town in Seraikella-Kharsawan district, Jharkhand; the historic seat of the Seraikella royal family and the centre of Seraikella Chhau.\n\n**Singh Deo royal family** — The ruling family of the former princely state of Seraikella; widely associated with the development and patronage of Seraikella Chhau.\n\n**UNESCO** — The United Nations body whose 2010 Representative List inscription of Chhau dance gave international recognition to the three traditions.",
    modelUrl: null,
    modelScale: 1,
    audioUrl: null,
    audioLoop: false,
    showFallbackScene: false,
    ...defaultPageAppearance,
  },
  {
    id: "library",
    pageNumber: 43,
    pageType: "content",
    title: "Library",
    body: "Every numbered citation in this eBook keys to one of the entries below. Tap a number in any chapter — say the [9] next to a claim about Purulia history — and it scrolls you straight to entry 9 here. This is the actual short shelf I returned to most often, not a complete Chhau bibliography.\n\n### Primary and official sources\n\n**[1]** UNESCO. *Chhau dance.* Representative List of the Intangible Cultural Heritage of Humanity. Inscription file, 2010. Available at the UNESCO ICH website.\n\n**[2]** Sangeet Natak Akademi. *Chhau* — published documentation, monographs, articles, and audio-visual archives. New Delhi.\n\n**[3]** Indian Culture Portal. Ministry of Culture, Government of India. Chhau dance and Charida mask-making entries.\n\n**[4]** Government of Odisha, Department of Culture. Resources on Mayurbhanj Chhau and the Government Mayurbhanj Chhau Nritya Pratisthan, Baripada.\n\n**[5]** Government of Jharkhand, cultural department resources on Seraikella Chhau.\n\n**[6]** Government of West Bengal, cultural resources on Purulia Chhau and Charida mask-making.\n\n**[7]** Padma Awards archive, Government of India.\n\n**[8]** Sangeet Natak Akademi Awards archive.\n\n### Scholarly and book sources\n\n**[9]** Bhattacharya, Ashutosh. *Chhau Dance of Purulia.* Indian Publications, 1972.\n\n**[10]** Pani, Jiwan. Essays and articles on Mayurbhanj Chhau and Indian dance, published in *Sangeet Natak* journal and Sangeet Natak Akademi publications.\n\n**[11]** Articles in *Sangeet Natak*, the journal of the Sangeet Natak Akademi, on Chhau performance, history, and pedagogy.\n\n**[12]** Citaristi, Ileana. *The Making of a Guru: Kelucharan Mohapatra, His Life and Times.* Background reading for adjacent eastern Indian dance traditions, not Chhau-specific.\n\n**[13]** *Natya Shastra.* Referenced only as broader Indian performance vocabulary, not as a direct Chhau source.\n\n### Practitioner sources\n\n**[14]** Lessons, observations, and conversations with the author's Chhau mentor (trained in Mayurbhanj Chhau), 2024–2025.\n\n**[15]** Public lecture-demonstrations and performance videos by senior Chhau gurus and troupes, accessed via Sangeet Natak Akademi archives, Doordarshan archives, and publicly available recordings.\n\n**[16]** Field observation of performances and training sessions by the author, 2024–2025.\n\n### Sources Referred, Chapter by Chapter\n\nEach chapter of this eBook drew on the numbered sources below. Tap any number to jump to its full entry above.\n\n**Map of Chhau: Families, Epicentres** — [1] [2] [3]\n\n**What is Chhau** — [1] [2] [3]\n\n**Origins, Etymology, and Historical Layers** — [1] [9] [2] [10] [3]\n\n**The Chhau Body** — [2] [9] [10] [14] [16]\n\n**Movement Vocabulary and Formations** — [2] [9] [10] [4]\n\n**Storytelling and Archetypes** — [2] [9] [12] [10] [13]\n\n**Expressions** — [2] [9] [1] [16]\n\n**Music, Rhythm, and Instruments** — [2] [9] [1] [15] [3]\n\n**Costumes and Colour** — [2] [9] [1] [16]\n\n**Masks** — [2] [9] [3] [1]\n\n**Props** — [2] [9] [16]\n\n**Performance Space, Training, and Community** — [1] [2] [4] [5] [3]\n\n**Entering Mayurbhanj Chhau** — [2] [10] [1] [4]\n\n**Mayurbhanj — Patrons** — [2] [3] [4]\n\n**Mayurbhanj — Traditions** — [2] [10] [1]\n\n**Mayurbhanj — Movement Techniques** — [2] [10] [4]\n\n**Mayurbhanj — Evolution and Pioneers** — [8] [7] [4] [1]\n\n**Mayurbhanj — Performance Lab** — [2] [15] [16]\n\n**Entering Seraikella Chhau** — [1] [2] [3] [5]\n\n**Seraikella — Patrons** — [2] [1] [5] [3]\n\n**Seraikella — Traditions** — [2] [1] [5]\n\n**Seraikella — Movement Techniques** — [2] [1] [16]\n\n**Seraikella — Evolution and Pioneers** — [8] [7] [2] [1]\n\n**Seraikella — Performance Lab** — [2] [15] [16]\n\n**Entering Purulia Chhau** — [1] [9] [2] [3]\n\n**Purulia — Patrons** — [9] [2] [3] [6]\n\n**Purulia — Traditions** — [9] [2] [3]\n\n**Purulia — Movement Techniques** — [9] [2] [3]\n\n**Purulia — Evolution and Pioneers** — [9] [8] [7] [3] [6]\n\n**Purulia — Performance Lab** — [9] [2] [15] [16]\n\nA note on naming and verification: throughout this book, I have chosen not to list specific living artists, gurus, mask-makers, or troupe leaders without independent verification of their names, regions, and contributions. Where this eBook later integrates direct interviews, those will appear in a future edition, with the speaker's voice preserved and lightly edited. For verified lists of award recipients, readers are directed to the Sangeet Natak Akademi Awards archive [8] and the Padma Awards archive [7] of the Government of India.\n\n\n*— end —*",
    modelUrl: null,
    modelScale: 1,
    audioUrl: null,
    audioLoop: false,
    showFallbackScene: false,
    ...defaultPageAppearance,
  },
];
