/**
 * All UI copy, English and Spanish. Edit both languages together. The landing and privacy
 * pages live at `/` and `/es`; the mode picker and game read the `diesis_lang` cookie,
 * which the switcher sets through `/lang/[code]`.
 */
import type { Style } from "./core/backing-tracks";

export type Lang = "en" | "es";
export const LANGS: Lang[] = ["en", "es"];
export const LANG_COOKIE = "diesis_lang";

export type When = "now" | "next" | "later";

export interface Menu {
  title: string;
  lede: string;
  modes: { title: string; body: string }[];
}

export interface Strings {
  code: Lang;
  base: string; // "" for en, "/es" for es
  otherLang: Lang;
  otherLabel: string;
  otherName: string;
  meta: { title: string; description: string; privacyTitle: string; privacyDescription: string };
  nav: {
    how: string; learn: string; faq: string; cta: string; privacy: string; about: string;
    /** The two sides of the app, and their tools in the order of the hrefs in components/site-nav.tsx. */
    areas: { learn: string; practice: string; setup: string };
    learnTools: string[];
    practiceTools: string[];
    setupTools: string[];
  };
  hero: { eyebrow: string; h1: string; lede: string; cta: string; secondary: string; trust: string[] };
  how: { eyebrow: string; h2: string; lede: string; steps: { title: string; body: string }[] };
  learn: {
    eyebrow: string;
    h2: string;
    lede: string;
    when: Record<When, string>;
    tracks: { title: string; lede: string; items: { title: string; body: string; when: When }[] }[];
  };
  name: { eyebrow: string; p: string[] };
  pricing: { eyebrow: string; h2: string; price: string; sub: string; list: string[]; contactTitle: string; contact: string; contactAfter: string };
  faq: { eyebrow: string; h2: string; items: { q: string; a: string }[] };
  maker: { eyebrow: string; h2: string; p: string[]; site: string; instagram: string; photoAlt: string };
  closing: { h2: string; lede: string };
  /** /practice/strings (components/strings-setup.tsx). {n} a string number, {type} a guitar type. */
  setup: {
    title: string; lede: string; guitar: string; guitarLede: string; type: string; types: Record<string, string>; scale: string; profileNote: string;
    tension: string; tensionLede: string; nylon: string; sets: string; suggest: string; gaugeOf: string; plain: string; wound: string;
    feel: Record<"slack" | "balanced" | "tight", string>; total: string; estimate: string;
    setupTitle: string; setupLede: string; actionBass: string; actionTreble: string; relief: string; radius: string; flat: string;
    pickupBass: string; pickupTreble: string; setupNote: string; stepsTitle: string; stepsLede: string; steps: { title: string; body: string }[];
  };
  /** The feedback form (components/feedback.tsx). */
  feedback: {
    open: string; title: string; lede: string; name: string; message: string; messageHint: string; contact: string; optional: string;
    send: string; sending: string; privacy: string; sentTitle: string; sent: string; error: string; empty: string; close: string;
  };
  /** The playable Name the note in the landing's hero (components/try-it.tsx). {n} in streak. */
  tryIt: { prompt: string; hint: string; streak: string; doneTitle: string; doneBody: string; doneCta: string; again: string };
  /** The landing's tool cards (components/tool-showcase.tsx), in the order of its HREFS. */
  tools: { eyebrow: string; h2: string; lede: string; open: string; items: { side: string; title: string; body: string }[] };
  footer: { tagline: string; made: string };
  /** /start: "What do you want to do today?", Learn or Practice. */
  home: { title: string; h1: string; lede: string; about: string; start: string; next: string; later: string; learn: string; practice: string; setup: string };
  /** The menus of the two sides, cards in the order of their hrefs in components/tool-menu.tsx. */
  learnMenu: Menu;
  practiceMenu: Menu;
  setupMenu: Menu;
  game: {
    title: string;
    back: string;
    /** Uses {r} and {w}. */
    score: string;
    start: string;
    startSub: string;
    loading: string;
    correct: string;
    wrong: string;
    hearAgain: string;
    keys: string;
    rotate: string;
    rotateSub: string;
    board: string;
    notes: string;
    /** The twelve pitch classes from C, sharps as ♯, as the language shows them by default (letters in
     *  English, solfège in Spanish). The landing uses these; inside the game the player's own setting wins. */
    noteNames: string[];
  };
  find: {
    title: string;
    startSub: string;
    /** Uses {n}, the note name. */
    prompt: string;
    /** Uses {f} found and {t} total. */
    progress: string;
    done: string;
    showRest: string;
    keys: string;
  };
  challenge: {
    heading: string;
    practice: string;
    practiceSub: string;
    timed: string;
    timedSub: string;
    streak: string;
    streakSub: string;
    /** Uses {m}. */
    minutes: string;
    start: string;
    timeUp: string;
    broken: string;
    /** Uses {n}. */
    result: string;
    /** Uses {n}. */
    best: string;
    newBest: string;
    again: string;
    change: string;
    /** Uses {n}. */
    streakNow: string;
    /** Uses {r}. */
    rightNow: string;
    clock: string;
    stop: string;
  };
  /** The start card's settings. */
  metronome: {
    title: string;
    speed: string;
    speedHint: string;
    tempo: string;
    meter: string;
    subdivision: string;
    accent: string;
    accentOn: string;
    accentOff: string;
    start: string;
    stop: string;
    tap: string;
    slower: string;
    faster: string;
    keys: string;
  };
  profile: {
    title: string;
    guitar: string;
    guitarLede: string;
    strings: string;
    tuning: string;
    /** Display name per tuning id in lib/core/notes.ts. */
    tunings: Record<string, string>;
    names: string;
    namesLede: string;
    language: string;
    records: string;
    recordsEmpty: string;
    /** Uses {n}. */
    stringsCount: string;
    achievements: string;
    /** Uses {e} earned and {t} total. */
    achievementsCount: string;
    achievementList: Record<string, { title: string; body: string }>;
    data: string;
    dataBody: string;
    erase: string;
    eraseConfirm: string;
  };
  /** /practice/backing-tracks. {n} a note name, {root}/{scale} names, {t} a video title, {c} a channel. */
  backing: {
    title: string; lede: string; style: string; all: string;
    styles: Record<Style, string>;
    major: string; minor: string; playOver: string; scaleOn: string; play: string; by: string; onNeck: string; note: string;
  };
  neck: {
    title: string;
    root: string;
    scale: string;
    names: string;
    degrees: string;
    /** Uses {n}, the highest fret. */
    frets: string;
    hint: string;
    /** Display name per scale id in lib/core/scales.ts. */
    scales: Record<string, string>;
  };
  speed: {
    title: string;
    from: string;
    to: string;
    step: string;
    every: string;
    atTarget: string;
    hold: string;
    restart: string;
    /** Uses {b} and {e}. */
    barOf: string;
    reached: string;
    keys: string;
  };
  settings: { challenge: string; time: string; notes: string; all: string; naturals: string; names: string; solfege: string; letters: string };
  consent: { text: string; accept: string; decline: string; more: string };
  privacy: { eyebrow: string; h1: string; updated: string; summary: string; sections: { h: string; p: string[] }[]; contactHeading: string; contact: string };
}

const en: Strings = {
  code: "en",
  base: "",
  otherLang: "es",
  otherLabel: "ES",
  otherName: "Español",
  meta: {
    title: "Diesis — everything you need to master the guitar",
    description:
      "Everything you need to master the guitar, in one place. See every note and scale on the neck, learn the notes and build speed with the metronome today; scale exercises, reading music and tools for your own guitar come next. Free while in preview, in the browser.",
    privacyTitle: "Privacy",
    privacyDescription: "What Diesis does with your data: no account, no ads, nothing you do in Diesis leaves your browser. Visit counting with Google Analytics only if you allow it.",
  },
  nav: { how: "How it works", learn: "What you learn", faq: "FAQ", cta: "Open the app", privacy: "Privacy", about: "About Diesis", areas: { learn: "Learn", practice: "Practice", setup: "Setup" }, learnTools: ["Name the note", "Find the note"], practiceTools: ["The neck", "Metronome", "Backing tracks"], setupTools: ["Strings"] },
  hero: {
    eyebrow: "The guitar learning tool",
    h1: "Everything you need to master the guitar.",
    lede: "Become the best guitarist you can be. Try it now on the neck: name the note that lights up. In the app, the whole fretboard, every scale, a metronome that builds your speed and backing tracks to jam over.",
    cta: "Open the app",
    secondary: "See the tools",
    trust: ["Free in preview", "No account", "Phone or laptop, in the browser"],
  },
  how: {
    eyebrow: "How it works",
    h2: "See the note. Name it. Know at once.",
    lede: "One thing at a time, the way a teacher would do it across the table. Nothing to set up. Practice for as long as you like, against the clock, or without a single mistake.",
    steps: [
      { title: "A position lights up", body: "One spot on the neck turns amber and the note plays. Frets 0 to 12, all six strings, every one of the twelve notes." },
      { title: "Name it", body: "Twelve buttons beside the neck, C to B, each sharp next to its note, written as ♯. On a laptop, just press the letter." },
      { title: "Green or red, then the next one", body: "Right: the spot turns green with the name written on it and the next note lights a moment later. Wrong: the button flashes red and the same note waits for you." },
    ],
  },
  learn: {
    eyebrow: "What you learn",
    h2: "From the first note to mastering the neck.",
    lede: "Diesis has three sides. Learn: exercises for where the notes are, the scales built from them and reading them off a score. Practice: the tools you keep open every day. Setup: the guitar itself, its strings and its setup.",
    when: { now: "Available now", next: "Coming next", later: "Later" },
    tracks: [
      {
        title: "Notes",
        lede: "Where every note lives on the neck, until you stop having to think about it.",
        items: [
          { title: "Name the note", body: "A position lights, you say which note it is.", when: "now" },
          { title: "Find the note", body: "You get a name. Tap every place it lives within the fret range, until you have them all.", when: "now" },
          { title: "Hear the note", body: "A note plays with nothing lit. Tap a place on the neck where it could be.", when: "next" },
          { title: "Challenges", body: "Practice with no end, race the clock for one, two or five minutes, or see how far you get without a single mistake. Your best score is kept.", when: "now" },
          { title: "Settings", body: "On the start card: naturals only or all twelve, and note names as C D E or Do Re Mi. Fret range and one string at a time come next.", when: "now" },
        ],
      },
      {
        title: "Scales",
        lede: "Any scale on the whole neck, then the shapes inside it.",
        items: [
          { title: "Explore a scale", body: "Every note on the neck, or pick a root and a scale and see every position lit, the root in amber, named by note or by degree. Tap one to hear it. Pentatonics, blues, major, the minors and the modes.", when: "now" },
          { title: "Build the scale", body: "Given a root and a scale name, tap every note of it within the range. Same exercise as Find the note, bigger target.", when: "later" },
          { title: "Name the scale, name the degree", body: "A shape lights and you say which scale or mode it is. A note lights inside a scale and you say which degree. Major and its modes, pentatonics, blues, the minors.", when: "later" },
        ],
      },
      {
        title: "Reading music",
        lede: "For classical guitar: the note on the staff, the place on the neck, the same thing.",
        items: [
          { title: "Read the note", body: "A note appears on the treble staff. Name it, or find it on the neck. Guitar clef, guitar range, ledger lines included.", when: "later" },
          { title: "Read the position", body: "A spot lights on the neck and you place it on the staff. The other direction, so both stick.", when: "later" },
          { title: "Rhythm and reading practice", body: "Short passages to read at a click, the way a teacher would hand you a line. Later, once the notes are solid.", when: "later" },
        ],
      },
      {
        title: "Tools",
        lede: "What you keep open while you practice, set up for your own guitar.",
        items: [
          { title: "Metronome and speed trainer", body: "Tempo from 20 to 300, 2/4 to 7/8 with the accents where they belong, subdivisions up to sextuplets, tap tempo. Turn on Speed up and it climbs on its own: pick the start, the target, the step and the bars at each tempo.", when: "now" },
          { title: "Backing tracks", body: "Tracks to jam over: blues, rock, metal, funk, bossa, modal jams, flamenco and more. Each shows its key and a scale that fits, and opens that scale on the neck.", when: "now" },
        ],
      },
      {
        title: "Setup",
        lede: "The guitar itself: set up for the way you tune it and play it.",
        items: [
          { title: "Your guitar", body: "In your profile: six, seven or eight strings and your tuning (standard, drop D, E♭, DADGAD, open G, drop A…). The exercises and the neck draw and play that guitar.", when: "now" },
          { title: "Strings and setup", body: "Each string’s tension for your tuning and scale length, common sets or a balanced one worked out for you, and the setup numbers for your type of guitar: action, relief, radius, pickup height, then intonation step by step.", when: "now" },
        ],
      },
    ],
  },
  name: {
    eyebrow: "The name",
    p: [
      "Diesis is the old Greek word for the smallest step in the scale: the semitone. On a guitar that is one fret. In Italian and Spanish the same word still means the sharp sign, ♯.",
      "That is the whole idea. Learn the neck one fret at a time, and the rest follows.",
    ],
  },
  pricing: {
    eyebrow: "Pricing",
    h2: "Free while it is in preview.",
    price: "Free",
    sub: "For now the browser version costs nothing and asks for nothing. Open it and start.",
    list: ["Every mode that exists", "No account, no sign-up", "Phone or laptop", "No ads"],
    contactTitle: "Tell me what you play",
    contact: "I build Diesis on my own, and what players tell me decides what comes first. Message me on Instagram at",
    contactAfter: "and tell me what you play, or what you would like to see next. A paid plan will come later; while Diesis is in preview, everything is free.",
  },
  faq: {
    eyebrow: "FAQ",
    h2: "Questions",
    items: [
      { q: "Do I need an account?", a: "No. Open the app and start. Scores live in your browser and nowhere else." },
      { q: "Is there sound?", a: "Yes. Tap once to start (browsers require it) and each position plays as it lights. “Hear again” repeats it. The sound is a synthesised nylon pluck for now; recordings of a real guitar will replace it." },
      { q: "Sharps or flats?", a: "Sharps, written as ♯. F♯ and G♭ are the same place on the neck, and Diesis never asks which spelling you prefer. A flats setting is planned." },
      { q: "Which frets?", a: "Frets 0 to 12 on every string of your guitar: six, seven or eight, in the tuning you pick in your profile. A range picker (say, frets 5 to 9 only) is one of the next things to arrive." },
      { q: "Phone or laptop?", a: "Either, in a browser. The neck is long and thin, so on a phone Diesis asks you to turn it sideways. On a laptop it fills the window and the letter keys pick the note." },
      { q: "Left-handed?", a: "Not yet. The board is drawn the way chord books draw it, nut on the left, high E on top. A mirrored board is on the list." },
      { q: "Will there be a mobile app?", a: "The web version comes first and works on a phone today. A native app comes if enough people want one." },
    ],
  },
  maker: {
    eyebrow: "Who makes it",
    h2: "Built by one guitarist in Cáceres.",
    p: [
      "I’m Will. As WILLDAFER I write, record and produce punk and modern metal from home, mostly on seven-string guitars in low tunings.",
      "Diesis is the tool I wanted for myself: one place with everything I need to keep getting better on the guitar. It starts with the neck, one fret at a time, and grows every week, in the open.",
    ],
    site: "My music at willdafer.es",
    instagram: "@willdafer.es on Instagram",
    photoAlt: "Will playing a black electric guitar",
  },
  closing: { h2: "Guitar on your lap?", lede: "Start with the neck. A few minutes a day is enough." },
  setup: {
    title: "Strings and setup",
    lede: "How tight each string is on your guitar, in your tuning, and the numbers to set it up after a string change.",
    guitar: "Your guitar",
    guitarLede: "The type sets the scale length and the setup numbers; change the scale if yours is different.",
    type: "Type of guitar",
    types: { strat: "Strat style", tele: "Tele style", lesPaul: "Les Paul / SG style", prs: "PRS style (25″)", superstrat: "Superstrat (Ibanez, Jackson…)", baritone: "Baritone (27″)", seven: "Seven strings (25.5″)", sevenLong: "Seven strings (26.5″)", eight: "Eight strings (27″)", acoustic: "Steel-string acoustic", classical: "Classical (nylon)" },
    scale: "Scale length",
    profileNote: "Strings and tuning are the ones in your profile; changing them here changes them everywhere.",
    tension: "String tension",
    tensionLede: "Load a common set, or let Diesis work out a balanced one for your tuning and scale. Green is comfortable, amber is slack, red is tight.",
    nylon: "Nylon strings are sold by tension (normal, high, extra high) rather than by gauge, so there is nothing to calculate here: pick the tension on the packet. The setup numbers below still apply.",
    sets: "Sets",
    suggest: "Suggest a balanced set",
    gaugeOf: "Gauge of string {n}",
    plain: "Plain",
    wound: "Wound",
    feel: { slack: "slack", balanced: "balanced", tight: "tight" },
    total: "Total on the neck:",
    estimate: "Worked out from physics for nickel roundwound strings: within about 5% of the makers' own tables.",
    setupTitle: "Setup numbers",
    setupLede: "Starting points ({type}), measured with the strings at pitch.",
    actionBass: "Action, low string (12th fret)",
    actionTreble: "Action, high string (12th fret)",
    relief: "Neck relief",
    radius: "Fretboard radius",
    flat: "Flat",
    pickupBass: "Pickup height, bass side",
    pickupTreble: "Pickup height, treble side",
    setupNote: "Typical factory numbers, not rules: lower plays easier and buzzes sooner, higher rings clearer. Adjust to how you play.",
    stepsTitle: "After a string change",
    stepsLede: "In this order: each step changes the ones after it.",
    steps: [
      { title: "Stretch the new strings", body: "Tune up, pull each string gently along its length, retune. Repeat until they hold pitch." },
      { title: "Check the relief", body: "Fret the low string at the 1st fret and at the last; the gap at the 7th–8th fret is the relief. Turn the truss rod a little at a time (a quarter turn at most) and let the neck settle." },
      { title: "Set the action", body: "At the 12th fret, from the top of the fret to the bottom of the string. Raise or lower the bridge or the saddles, then play where you play most: no buzz." },
      { title: "Set the pickup height", body: "Fret at the last fret and measure from the pickup to the bottom of the string. Closer is louder; too close pulls the string and sours the notes." },
      { title: "Set the intonation", body: "Tune the open string, then play it at the 12th fret. Sharp: move the saddle away from the neck. Flat: towards it. Retune after every move, string by string." },
      { title: "Tune and play", body: "A new setup settles over a day or two. Check the tuning and the relief again after that." },
    ],
  },
  feedback: {
    open: "Feedback",
    title: "What do you need?",
    lede: "Something missing, something broken, a tool you would use every day. It comes straight to me, Will, and I read all of it.",
    name: "Your name",
    message: "What do you need?",
    messageHint: "A tuner, drop C, the note names in German…",
    contact: "Your email",
    optional: "(optional, if you want an answer)",
    send: "Send",
    sending: "Sending…",
    privacy: "Emailed to me, stored nowhere else.",
    sentTitle: "Thanks!",
    sent: "It is on its way to me. If you left an email, I will answer there.",
    error: "It did not go through. Try again in a moment, or message @diesis.app on Instagram.",
    empty: "Write what you need first.",
    close: "Close",
  },
  tryIt: {
    prompt: "Which note is lit?",
    hint: "Sound on, tap a note.",
    streak: "{n} in a row",
    doneTitle: "Five in a row.",
    doneBody: "That was Name the note, in first position. The app has the whole neck, the sharps, the clock and your best scores.",
    doneCta: "The full exercise",
    again: "Another five",
  },
  tools: {
    eyebrow: "Inside",
    h2: "Open a tool and start playing.",
    lede: "No sign-up, nothing to install. Every card takes you straight into the tool.",
    open: "Open",
    items: [
      { side: "Learn", title: "Name the note", body: "A position lights and plays. Say which note it is, against the clock if you dare." },
      { side: "Learn", title: "Find the note", body: "You get a name. Tap every place it lives on the neck." },
      { side: "Practice", title: "The neck", body: "Any scale on any root, across the whole fretboard. Here, A minor pentatonic." },
      { side: "Practice", title: "Metronome", body: "20 to 300 BPM, odd meters, tap tempo, and a Speed up mode that climbs to your target." },
      { side: "Practice", title: "Backing tracks", body: "Jam over tracks in every style, with the key and the scale to play shown on each." },
      { side: "Setup", title: "Strings and setup", body: "Every string's tension for your tuning, a balanced set worked out for you, and the setup numbers for your guitar." },
    ],
  },
  footer: { tagline: "Everything you need to master the guitar.", made: "Made in Cáceres, Spain. “Diesis” is Greek for the semitone: one fret." },
  home: {
    title: "Learn, practice, set up",
    h1: "What do you want to do today?",
    lede: "Guitar on your lap, screen sideways if it is a phone.",
    about: "About Diesis",
    start: "Start",
    next: "Coming next",
    later: "Later",
    learn: "Exercises that teach you the guitar: every note on the neck first, then scales and reading music.",
    practice: "The tools you play with: the neck with any scale on it, a metronome that builds your speed and backing tracks.",
    setup: "Your guitar itself: the right strings for your tuning, and the numbers to set it up after a string change.",
  },
  learnMenu: {
    title: "Learn",
    lede: "Short exercises that tell you at once if you got it right. A few minutes a day is enough.",
    modes: [
      { title: "Name the note", body: "A position lights and plays. Say which note it is." },
      { title: "Find the note", body: "You get a name. Tap every place it lives." },
      { title: "Hear the note", body: "A note plays with nothing lit. Find it on the neck." },
      { title: "Scale exercises", body: "Build the scale, name the scale, name the degree." },
      { title: "Reading music", body: "The note on the staff, the place on the neck." },
      { title: "Glossary and technique", body: "What down picking, a hammer-on or a rest stroke is, and how to do it. Electric and classical." },
    ],
  },
  practiceMenu: {
    title: "Practice",
    lede: "What you keep open while you play.",
    modes: [
      { title: "The neck", body: "Every note on the fretboard, or a scale on the root you pick: pentatonics, blues, major, the minors, the modes." },
      { title: "Metronome", body: "A steady tempo, or one that climbs a step every few bars up to your target. Time signatures, accents, subdivisions, tap tempo." },
      { title: "Backing tracks", body: "Jam over a band in any style, with the key and a scale that fits, shown on the neck in one tap." },
      { title: "Tuner", body: "Tune through the microphone, in your guitar's own tuning." },
    ],
  },
  setupMenu: {
    title: "Setup",
    lede: "Look after the guitar itself: strings, tension and setup.",
    modes: [
      { title: "Strings and setup", body: "Each string's tension, the gauges that suit your guitar and tuning, and the setup numbers for your type of guitar." },
    ],
  },
  game: {
    title: "Name the note",
    back: "Modes",
    score: "{r} right · {w} wrong",
    start: "Tap to start",
    startSub: "A note lights up and plays. Name it.",
    loading: "Loading…",
    correct: "Correct",
    wrong: "Wrong",
    hearAgain: "Hear again",
    keys: "Keys: C D E F G A B pick a note, Shift for ♯, Space to hear again.",
    rotate: "Make the window wider",
    rotateSub: "Diesis works in landscape, like a guitar neck.",
    board: "Guitar fretboard",
    notes: "Note names",
    noteNames: ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"],
  },
  find: {
    title: "Find the note",
    startSub: "A note name appears. Tap every place it lives on the neck.",
    prompt: "Find every {n}",
    progress: "{f} of {t}",
    done: "All found",
    showRest: "Show me",
    keys: "Click every place on the neck that sounds the note. Each spot plays as you click it.",
  },
  challenge: {
    heading: "How do you want to practice?",
    practice: "Practice",
    practiceSub: "No clock, no end. Stop when you like.",
    timed: "Against the clock",
    timedSub: "How many can you get right before time runs out?",
    streak: "No mistakes",
    streakSub: "How many in a row before your first miss?",
    minutes: "{m} min",
    start: "Start",
    timeUp: "Time's up",
    broken: "That one was wrong",
    result: "{n} right",
    best: "Your best: {n}",
    newBest: "New personal best",
    again: "Again",
    change: "Change",
    streakNow: "{n} in a row",
    rightNow: "{r} right",
    clock: "Time left",
    stop: "Stop",
  },
  metronome: {
    title: "Metronome",
    speed: "Speed up",
    speedHint: "Raise the tempo a step every few bars, up to a target.",
    tempo: "Tempo",
    meter: "Time signature",
    subdivision: "Subdivision",
    accent: "Accent",
    accentOn: "On the one",
    accentOff: "None",
    start: "Start",
    stop: "Stop",
    tap: "Tap",
    slower: "Slower",
    faster: "Faster",
    keys: "Keys: Space starts and stops, ← → change the tempo (Shift for 5 at a time), T taps it.",
  },
  profile: {
    title: "Profile",
    guitar: "Your guitar",
    guitarLede: "The exercises and the neck draw and play this guitar: its strings and the notes they give.",
    strings: "Strings",
    tuning: "Tuning",
    tunings: { standard6: "Standard", dropD: "Drop D", eFlat: "E♭ standard", dStandard: "D standard", dropC: "Drop C", dadgad: "DADGAD", openG: "Open G", openD: "Open D", standard7: "Standard (low B)", dropA7: "Drop A", standard8: "Standard (low F♯)", dropE8: "Drop E" },
    names: "Note names",
    namesLede: "How notes are written on the buttons and on the neck, everywhere in the app.",
    language: "Language",
    records: "Records",
    recordsEmpty: "No records yet. Play Name the note or Find the note against the clock or without mistakes, and your bests appear here.",
    stringsCount: "{n} strings",
    achievements: "Achievements",
    achievementsCount: "{e} of {t}",
    achievementList: {
      firstBest: { title: "First record", body: "Set a best in any challenge." },
      streak10: { title: "Ten in a row", body: "Ten right without a mistake." },
      minute20: { title: "Twenty in a minute", body: "Name 20 notes in one minute." },
      allTwelve: { title: "All twelve", body: "A record with the sharps in, not naturals only." },
      finder: { title: "Finder", body: "Find 30 positions against the clock." },
      streak25: { title: "Twenty-five in a row", body: "25 in a row with all twelve notes." },
      minute40: { title: "Forty in a minute", body: "Name 40 notes in one minute, all twelve." },
      extended: { title: "Extended range", body: "A record on a seven- or eight-string guitar." },
      streak50: { title: "Fifty in a row", body: "50 in a row with all twelve notes." },
    },
    data: "Your data",
    dataBody: "Everything on this page lives in this browser only: there is no account and nothing is sent. Erasing it cannot be undone.",
    erase: "Erase my data",
    eraseConfirm: "Erase your records, achievements and settings from this browser?",
  },
  backing: {
    title: "Backing tracks",
    lede: "Put one on and play over it. Each track says its key and a scale that fits; open that scale on the neck if you need a map.",
    style: "Style",
    all: "All",
    styles: { blues: "Blues", rock: "Rock", metal: "Metal", funk: "Funk", jazz: "Jazz and bossa", modal: "Modal", spanish: "Flamenco", country: "Country", ballad: "Ballad", neosoul: "Neo-soul" },
    major: "{n} major",
    minor: "{n} minor",
    playOver: "Play:",
    scaleOn: "{root} {scale}",
    play: "Play {t}",
    by: "By {c}, on YouTube",
    onNeck: "Show on the neck",
    note: "The videos are YouTube's and their makers'. The player loads from YouTube only when you press play.",
  },
  neck: {
    title: "The neck",
    root: "Root",
    scale: "Scale",
    names: "Notes",
    degrees: "Degrees",
    frets: "0–{n}",
    hint: "Tap a note to hear it.",
    scales: { all: "All notes", pentaMinor: "Minor pentatonic", pentaMajor: "Major pentatonic", blues: "Blues", major: "Major", minor: "Natural minor", harmonicMinor: "Harmonic minor", melodicMinor: "Melodic minor", dorian: "Dorian", phrygian: "Phrygian", lydian: "Lydian", mixolydian: "Mixolydian", locrian: "Locrian" },
  },
  speed: {
    title: "Speed trainer",
    from: "Start",
    to: "Target",
    step: "Step (BPM)",
    every: "Every (bars)",
    atTarget: "At the target",
    hold: "Stay there",
    restart: "Start over",
    barOf: "Bar {b} of {e}",
    reached: "At the target",
    keys: "Keys: Space starts and stops.",
  },
  settings: { challenge: "Challenge", time: "Time", notes: "Notes", all: "All twelve", naturals: "Naturals only", names: "Note names", solfege: "Do Re Mi", letters: "C D E" },
  consent: {
    text: "Diesis uses Google Analytics to count visits, only if you say yes. No ads, nothing sold.",
    accept: "Allow",
    decline: "No thanks",
    more: "Privacy",
  },
  privacy: {
    eyebrow: "Privacy",
    h1: "Privacy policy",
    updated: "Last updated 26 September 2026",
    summary: "Diesis has no account and no advertising. Nothing you do in Diesis leaves your browser. The only thing we measure is visits to the site, with Google Analytics, and only if you allow it.",
    sections: [
      { h: "The app", p: ["Diesis runs entirely in your browser. It does not ask who you are, does not create an account, and does not send anything you do in it to us or to anyone else.", "Your score for a session is held in memory and disappears when you close the tab. Everything else you choose or earn stays in your browser's local storage, on your device only: your guitar (strings and tuning), how notes are named, your personal bests and the challenge you last picked, the metronome's settings (including a speed-up plan), what you last picked on the neck and your guitar type, scale length and string gauges. None of it is ever sent anywhere. The Erase my data button in your profile removes it, and so does clearing the site's data."] },
      { h: "Cookies", p: ["Diesis sets two cookies. One remembers the language you picked; the other remembers your answer to the analytics banner. Neither holds anything about you."] },
      { h: "This website", p: ["diesis.app is hosted by Vercel, which keeps standard server logs (IP address, browser, pages requested) for a short time to run the service and keep it safe.", "If you allow it in the banner, the site loads Google Analytics 4 to count visits and see which pages are read. Google sets its own cookies for that and processes the data under its own privacy policy. If you decline, nothing from Google is loaded, and you can change your mind by clearing the site's cookies."] },
      { h: "Backing tracks", p: ["The backing tracks page shows thumbnails served by YouTube (i.ytimg.com), so YouTube sees your IP address when the page loads. The video player comes from youtube-nocookie.com and loads only when you press play on a track; from then on YouTube's privacy policy applies to that video. Diesis sends YouTube nothing about you."] },
      { h: "Feedback", p: ["If you send the feedback form, what you write (your name, your message and your email if you give one) is emailed to me through Resend, together with the page you sent it from, the language, your guitar setting and your browser. It is not kept anywhere else: it stays in my inbox and I use it only to improve Diesis and to answer you."] },
      { h: "Children", p: ["Diesis collects no personal data from anyone, of any age."] },
      { h: "Changes", p: ["If this policy changes, the new version is published here with a new date. It will never quietly start collecting data."] },
    ],
    contactHeading: "Contact",
    contact: "Questions about privacy, or about Diesis in general: message me on Instagram at",
  },
};

const es: Strings = {
  code: "es",
  base: "/es",
  otherLang: "en",
  otherLabel: "EN",
  otherName: "English",
  meta: {
    title: "Diesis — todo lo que necesitas para dominar la guitarra",
    description:
      "Todo lo que necesitas para dominar la guitarra, en un solo sitio. Hoy, todas las notas y escalas del mástil y un metrónomo que te hace ganar velocidad; después, ejercicios de escalas, lectura de partituras y herramientas para tu propia guitarra. Gratis durante la beta y en el navegador.",
    privacyTitle: "Privacidad",
    privacyDescription: "Qué hace Diesis con tus datos: sin cuenta, sin anuncios y sin que nada de lo que haces en Diesis salga de tu navegador. Contamos visitas con Google Analytics solo si tú lo permites.",
  },
  nav: { how: "Cómo funciona", learn: "Qué aprendes", faq: "Preguntas", cta: "Abrir la app", privacy: "Privacidad", about: "Sobre Diesis", areas: { learn: "Aprender", practice: "Practicar", setup: "Ajuste" }, learnTools: ["Nombra la nota", "Encuentra la nota"], practiceTools: ["El mástil", "Metrónomo", "Backing tracks"], setupTools: ["Cuerdas"] },
  hero: {
    eyebrow: "La herramienta para aprender guitarra",
    h1: "Todo lo que necesitas para dominar la guitarra.",
    lede: "Llega a ser el mejor guitarrista que puedas ser. Pruébalo ya en el mástil: di qué nota se ilumina. En la app tienes el mástil entero, todas las escalas, un metrónomo que te hace ganar velocidad y bases para improvisar encima.",
    cta: "Abrir la app",
    secondary: "Ver las herramientas",
    trust: ["Gratis durante la beta", "Sin registro", "En el navegador, móvil u ordenador"],
  },
  how: {
    eyebrow: "Cómo funciona",
    h2: "Ves la nota. Dices cuál es. Sabes al instante si has acertado.",
    lede: "De una en una, como haría un profesor sentado enfrente. No hay nada que configurar. Practica sin límite, contrarreloj o sin permitirte ni un fallo.",
    steps: [
      { title: "Se ilumina una posición", body: "Un punto del mástil se enciende en ámbar y suena la nota. Del traste 0 al 12, las seis cuerdas, las doce notas." },
      { title: "Di cuál es", body: "Doce botones al lado del mástil, de Do a Si, cada sostenido junto a su nota y escrito como ♯. En el ordenador basta con pulsar la tecla de la nota." },
      { title: "Verde o rojo, y a por la siguiente", body: "Si aciertas, el punto se pone verde con el nombre encima y enseguida se enciende la siguiente nota. Si fallas, el botón parpadea en rojo y la nota se queda esperando." },
    ],
  },
  learn: {
    eyebrow: "Qué aprendes",
    h2: "De la primera nota a dominar el mástil.",
    lede: "Diesis tiene tres partes. Aprender: ejercicios para saber dónde está cada nota, las escalas que se construyen con ellas y cómo leerlas en una partitura. Practicar: las herramientas que tienes abiertas cada día. Ajuste: la guitarra en sí, sus cuerdas y su puesta a punto.",
    when: { now: "Ya disponible", next: "Próximamente", later: "Más adelante" },
    tracks: [
      {
        title: "Notas",
        lede: "Dónde está cada nota del mástil, hasta que no tengas que pensarlo.",
        items: [
          { title: "Nombra la nota", body: "Se ilumina una posición y tú dices qué nota es.", when: "now" },
          { title: "Encuentra la nota", body: "Te dan una nota y tienes que tocarla en todos los sitios del mástil donde esté, dentro del rango de trastes que hayas elegido.", when: "now" },
          { title: "Escucha la nota", body: "Suena una nota sin que se ilumine nada. Tócala en algún sitio del mástil donde pueda estar.", when: "next" },
          { title: "Retos", body: "Práctica libre sin final, contrarreloj de uno, dos o cinco minutos, o a ver cuántas encadenas sin fallar ni una. Tu mejor marca se queda guardada.", when: "now" },
          { title: "Ajustes", body: "Antes de empezar: solo naturales o las doce notas, y los nombres como Do Re Mi o C D E. El rango de trastes y practicar cuerda a cuerda llegarán después.", when: "now" },
        ],
      },
      {
        title: "Escalas",
        lede: "Cualquier escala a lo largo de todo el mástil, y después las posiciones.",
        items: [
          { title: "Explora una escala", body: "Todas las notas del mástil, o elige tónica y escala y verás cada posición iluminada, la tónica en ámbar, con el nombre de la nota o el grado. Toca una para oírla. Pentatónicas, blues, mayor, las menores y los modos.", when: "now" },
          { title: "Construye la escala", body: "Te dan una tónica y una escala; toca todas sus notas dentro del rango. Como Encuentra la nota, pero con más notas que buscar.", when: "later" },
          { title: "Nombra la escala, nombra el grado", body: "Se ilumina una forma y dices qué escala o modo es. O se ilumina una nota dentro de una escala y dices qué grado es. Mayor y sus modos, pentatónicas, blues y las menores.", when: "later" },
        ],
      },
      {
        title: "Leer partituras",
        lede: "Para guitarra clásica: que la nota en el pentagrama y la posición en el mástil sean lo mismo.",
        items: [
          { title: "Lee la nota", body: "Aparece una nota en el pentagrama. Di cuál es o tócala en el mástil. Clave de sol, el registro de la guitarra y líneas adicionales incluidas.", when: "later" },
          { title: "Lee la posición", body: "Se ilumina un punto del mástil y tú lo colocas en el pentagrama. El camino inverso, para que se fijen los dos.", when: "later" },
          { title: "Ritmo y lectura", body: "Pasajes cortos para leer a primera vista, como cuando un profesor te pone una línea delante. Más adelante, cuando las notas estén bien asentadas.", when: "later" },
        ],
      },
      {
        title: "Herramientas",
        lede: "Lo que tienes abierto mientras practicas, pensado para tu guitarra.",
        items: [
          { title: "Metrónomo y entrenador de velocidad", body: "Tempo de 20 a 300, compases de 2/4 a 7/8 con los acentos donde tocan, subdivisiones hasta seisillos y tap tempo. Activa la subida de tempo y sube solo: eliges inicio, objetivo, cuánto sube y cuántos compases en cada tempo.", when: "now" },
          { title: "Backing tracks", body: "Bases para improvisar encima: blues, rock, metal, funk, bossa, jams modales, flamenco y más. Cada una dice su tonalidad y una escala que encaja, y te la abre en el mástil.", when: "now" },
        ],
      },
      {
        title: "Ajuste",
        lede: "La guitarra en sí: preparada para cómo la afinas y cómo tocas.",
        items: [
          { title: "Tu guitarra", body: "En tu perfil: seis, siete u ocho cuerdas y tu afinación (estándar, drop D, Mi♭, DADGAD, Sol abierta, drop A…). Los ejercicios y el mástil dibujan y suenan con esa guitarra.", when: "now" },
          { title: "Cuerdas y ajuste", body: "La tensión de cada cuerda con tu afinación y tu tiro, juegos habituales o uno equilibrado calculado para ti, y las medidas de ajuste de tu tipo de guitarra: altura de cuerdas, curvatura del mástil, radio, altura de pastillas y, paso a paso, la octavación.", when: "now" },
        ],
      },
    ],
  },
  name: {
    eyebrow: "El nombre",
    p: [
      "Diesis es la palabra griega antigua para el paso más pequeño de la escala: el semitono. En la guitarra, un traste. En italiano, y en castellano como «diesi», la misma palabra sigue nombrando el sostenido, ♯.",
      "Esa es toda la idea: aprender el mástil traste a traste. El resto viene solo.",
    ],
  },
  pricing: {
    eyebrow: "Precio",
    h2: "Gratis mientras dure la beta.",
    price: "Gratis",
    sub: "Por ahora la versión web no cuesta nada y no pide nada. Entras y empiezas.",
    list: ["Todos los modos disponibles", "Sin cuenta ni registro", "Móvil u ordenador", "Sin anuncios"],
    contactTitle: "Cuéntame qué tocas",
    contact: "Diesis lo hago yo solo, y lo que me contáis los que tocáis decide qué llega antes. Escríbeme por Instagram a",
    contactAfter: "y dime qué tocas o qué te gustaría ver. Más adelante habrá un plan de pago; mientras dure la beta, todo es gratis.",
  },
  faq: {
    eyebrow: "Preguntas",
    h2: "Preguntas frecuentes",
    items: [
      { q: "¿Hace falta registrarse?", a: "No. Entras y empiezas. Las puntuaciones se quedan en tu navegador y no salen de ahí." },
      { q: "¿Tiene sonido?", a: "Sí. Toca una vez para empezar (el navegador lo exige) y cada posición suena al iluminarse. «Oír otra vez» la repite. De momento el sonido es una cuerda de nailon sintetizada; más adelante lo sustituirán grabaciones de una guitarra de verdad." },
      { q: "¿Sostenidos o bemoles?", a: "Sostenidos, escritos con ♯. Fa♯ y Sol♭ están en el mismo sitio del mástil, y Diesis nunca te pregunta cómo prefieres escribirlo. Un ajuste para bemoles está previsto." },
      { q: "¿Qué trastes entran?", a: "Del 0 al 12 en todas las cuerdas de tu guitarra: seis, siete u ocho, con la afinación que elijas en tu perfil. Poder elegir un rango (por ejemplo, solo del 5 al 9) es de lo próximo que llegará." },
      { q: "¿Móvil u ordenador?", a: "Los dos, desde el navegador. El mástil es largo y estrecho, así que en el móvil Diesis te pide que lo pongas en horizontal. En el ordenador ocupa toda la ventana y puedes responder con el teclado." },
      { q: "¿Y si soy zurdo?", a: "Todavía no hay opción. El mástil se dibuja como en los libros de acordes: cejuela a la izquierda y la cuerda aguda arriba. Un mástil en espejo está en la lista." },
      { q: "¿Habrá app para el móvil?", a: "Primero la versión web, que ya funciona en el móvil. Si la pide bastante gente, haremos una app nativa." },
    ],
  },
  maker: {
    eyebrow: "Quién está detrás",
    h2: "Lo hace un guitarrista desde Cáceres.",
    p: [
      "Soy Will. Como WILLDAFER escribo, grabo y produzco punk y metal moderno desde casa, casi siempre con guitarras de siete cuerdas y afinaciones graves.",
      "Diesis es la herramienta que me hacía falta a mí: un solo sitio con todo lo que necesito para seguir mejorando con la guitarra. Empieza por el mástil, traste a traste, y crece cada semana, a la vista de todos.",
    ],
    site: "Mi música en willdafer.es",
    instagram: "@willdafer.es en Instagram",
    photoAlt: "Will tocando una guitarra eléctrica negra",
  },
  closing: { h2: "¿Tienes la guitarra a mano?", lede: "Empieza por el mástil. Con unos minutos al día basta." },
  setup: {
    title: "Cuerdas y ajuste",
    lede: "Cuánta tensión tiene cada cuerda en tu guitarra y con tu afinación, y las medidas para ajustarla después de cambiar cuerdas.",
    guitar: "Tu guitarra",
    guitarLede: "El tipo fija el tiro y las medidas de ajuste; cambia el tiro si el de la tuya es distinto.",
    type: "Tipo de guitarra",
    types: { strat: "Tipo Strat", tele: "Tipo Tele", lesPaul: "Tipo Les Paul / SG", prs: "Tipo PRS (25″)", superstrat: "Superstrat (Ibanez, Jackson…)", baritone: "Barítona (27″)", seven: "Siete cuerdas (25,5″)", sevenLong: "Siete cuerdas (26,5″)", eight: "Ocho cuerdas (27″)", acoustic: "Acústica de acero", classical: "Clásica (nailon)" },
    scale: "Tiro (escala)",
    profileNote: "Las cuerdas y la afinación son las de tu perfil; si las cambias aquí, cambian en todas partes.",
    tension: "Tensión de las cuerdas",
    tensionLede: "Carga un juego habitual o deja que Diesis calcule uno equilibrado para tu afinación y tu tiro. Verde es cómodo, ámbar queda flojo y rojo, duro.",
    nylon: "Las cuerdas de nailon se venden por tensión (normal, alta, extra alta), no por calibre, así que aquí no hay nada que calcular: elige la tensión que pone el paquete. Las medidas de ajuste de abajo sí sirven.",
    sets: "Juegos",
    suggest: "Calcular un juego equilibrado",
    gaugeOf: "Calibre de la cuerda {n}",
    plain: "Lisas",
    wound: "Entorchadas",
    feel: { slack: "floja", balanced: "equilibrada", tight: "dura" },
    total: "Total sobre el mástil:",
    estimate: "Calculado con la física de las cuerdas entorchadas en níquel: se desvía como mucho un 5 % de las tablas de los fabricantes.",
    setupTitle: "Medidas de ajuste",
    setupLede: "Puntos de partida ({type}), medidos con las cuerdas afinadas.",
    actionBass: "Altura, cuerda grave (traste 12)",
    actionTreble: "Altura, cuerda aguda (traste 12)",
    relief: "Curvatura del mástil",
    radius: "Radio del diapasón",
    flat: "Plano",
    pickupBass: "Altura de pastillas, lado grave",
    pickupTreble: "Altura de pastillas, lado agudo",
    setupNote: "Son medidas habituales de fábrica, no reglas: más baja se toca más fácil y trastea antes; más alta suena más limpia. Ajústalas a cómo tocas.",
    stepsTitle: "Después de cambiar cuerdas",
    stepsLede: "En este orden: cada paso cambia los siguientes.",
    steps: [
      { title: "Estira las cuerdas nuevas", body: "Afina, tira con suavidad de cada cuerda a lo largo y vuelve a afinar. Repite hasta que no se desafinen." },
      { title: "Mira la curvatura", body: "Pisa la cuerda grave en el traste 1 y en el último; el hueco en el traste 7 u 8 es la curvatura. Gira el alma poco a poco (un cuarto de vuelta como mucho) y dale tiempo al mástil." },
      { title: "Ajusta la altura de las cuerdas", body: "En el traste 12, desde lo alto del traste hasta la parte de abajo de la cuerda. Sube o baja el puente o las selletas y toca donde más tocas: sin trastear." },
      { title: "Ajusta la altura de las pastillas", body: "Pisa en el último traste y mide de la pastilla a la parte de abajo de la cuerda. Más cerca suena más fuerte; demasiado cerca tira de la cuerda y desafina." },
      { title: "Ajusta la octavación", body: "Afina la cuerda al aire y tócala en el traste 12. Si sale alta, aleja la selleta del mástil; si sale baja, acércala. Vuelve a afinar después de cada cambio, cuerda a cuerda." },
      { title: "Afina y toca", body: "Un ajuste nuevo se asienta en un día o dos. Revisa después la afinación y la curvatura." },
    ],
  },
  feedback: {
    open: "Sugerencias",
    title: "¿Qué necesitas?",
    lede: "Algo que falta, algo que falla, una herramienta que usarías cada día. Me llega directamente a mí, Will, y lo leo todo.",
    name: "Tu nombre",
    message: "¿Qué necesitas?",
    messageHint: "Un afinador, drop C, que suene más como una eléctrica…",
    contact: "Tu email",
    optional: "(opcional, si quieres respuesta)",
    send: "Enviar",
    sending: "Enviando…",
    privacy: "Me llega por email y no se guarda en ningún otro sitio.",
    sentTitle: "¡Gracias!",
    sent: "Ya me ha llegado. Si has dejado tu email, te contesto por ahí.",
    error: "No se ha podido enviar. Prueba otra vez en un momento o escríbeme por Instagram a @diesis.app.",
    empty: "Escribe primero qué necesitas.",
    close: "Cerrar",
  },
  tryIt: {
    prompt: "¿Qué nota es?",
    hint: "Sube el volumen y elige.",
    streak: "{n} seguidas",
    doneTitle: "Cinco seguidas.",
    doneBody: "Eso era «Nombra la nota» en primera posición. En la app tienes el mástil entero, los sostenidos, el cronómetro y tus récords.",
    doneCta: "El ejercicio completo",
    again: "Otras cinco",
  },
  tools: {
    eyebrow: "Dentro",
    h2: "Abre una herramienta y ponte a tocar.",
    lede: "Sin registro y sin instalar nada. Cada tarjeta te lleva directo a la herramienta.",
    open: "Abrir",
    items: [
      { side: "Aprender", title: "Nombra la nota", body: "Se ilumina una posición y suena. Di qué nota es, y contrarreloj si te atreves." },
      { side: "Aprender", title: "Encuentra la nota", body: "Te dan una nota. Tócala en todos los sitios del mástil donde esté." },
      { side: "Practicar", title: "El mástil", body: "Cualquier escala sobre cualquier tónica, por todo el mástil. Aquí, la pentatónica menor de La." },
      { side: "Practicar", title: "Metrónomo", body: "De 20 a 300 BPM, compases de amalgama, tap tempo y una subida de tempo que te lleva hasta tu objetivo." },
      { side: "Practicar", title: "Backing tracks", body: "Bases de todos los estilos para improvisar encima, cada una con su tonalidad y la escala que encaja." },
      { side: "Ajuste", title: "Cuerdas y ajuste", body: "La tensión de cada cuerda con tu afinación, un juego equilibrado calculado para ti y las medidas de ajuste de tu guitarra." },
    ],
  },
  footer: { tagline: "Todo lo que necesitas para dominar la guitarra.", made: "Hecho en Cáceres. «Diesis» es semitono en griego: un traste." },
  home: {
    title: "Aprender, practicar, ajustar",
    h1: "¿Qué quieres hacer hoy?",
    lede: "Con la guitarra encima y, si es un móvil, en horizontal.",
    about: "Sobre Diesis",
    start: "Empezar",
    next: "Próximamente",
    later: "Más adelante",
    learn: "Ejercicios que te enseñan la guitarra: primero todas las notas del mástil, luego las escalas y la lectura de partituras.",
    practice: "Las herramientas con las que tocas: el mástil con la escala que quieras, un metrónomo que te va subiendo la velocidad y backing tracks.",
    setup: "Tu guitarra en sí: las cuerdas que le van a tu afinación y las medidas para ajustarla después de cambiarlas.",
  },
  learnMenu: {
    title: "Aprender",
    lede: "Ejercicios cortos que te dicen al momento si has acertado. Con unos minutos al día basta.",
    modes: [
      { title: "Nombra la nota", body: "Se ilumina una posición y suena. Di qué nota es." },
      { title: "Encuentra la nota", body: "Te dan una nota. Tócala en todos los sitios donde esté." },
      { title: "Escucha la nota", body: "Suena una nota sin iluminar nada. Encuéntrala en el mástil." },
      { title: "Ejercicios de escalas", body: "Constrúyelas, reconócelas y di el grado." },
      { title: "Leer partituras", body: "De la nota en el pentagrama a la posición en el mástil." },
      { title: "Glosario y técnica", body: "Qué es el down picking, un hammer-on o el apoyando, y cómo se hacen. Guitarra eléctrica y clásica." },
    ],
  },
  practiceMenu: {
    title: "Practicar",
    lede: "Lo que tienes abierto mientras tocas.",
    modes: [
      { title: "El mástil", body: "Todas las notas del mástil, o una escala sobre la tónica que elijas: pentatónicas, blues, mayor, las menores y los modos." },
      { title: "Metrónomo", body: "Tempo fijo, o uno que sube solo cada pocos compases hasta tu objetivo. Compases, acentos, subdivisiones y tap tempo." },
      { title: "Backing tracks", body: "Improvisa con una banda detrás, del estilo que quieras, con su tonalidad y una escala que encaja, que ves en el mástil con un toque." },
      { title: "Afinador", body: "Afina con el micrófono, en la afinación de tu guitarra." },
    ],
  },
  setupMenu: {
    title: "Ajuste",
    lede: "Cuida la guitarra en sí: cuerdas, tensión y ajuste.",
    modes: [
      { title: "Cuerdas y ajuste", body: "La tensión de cada cuerda, los calibres que le van a tu guitarra y tu afinación, y las medidas de ajuste para tu tipo de guitarra." },
    ],
  },
  game: {
    title: "Nombra la nota",
    back: "Modos",
    score: "{r} aciertos · {w} fallos",
    start: "Toca para empezar",
    startSub: "Se ilumina una nota y suena. Di cuál es.",
    loading: "Cargando…",
    correct: "¡Correcto!",
    wrong: "No es esa",
    hearAgain: "Oír otra vez",
    keys: "Teclado: C D E F G A B para Do Re Mi Fa Sol La Si, Mayús para el sostenido, espacio para repetir la nota.",
    rotate: "Ensancha la ventana",
    rotateSub: "Diesis se usa en horizontal, como el mástil de una guitarra.",
    board: "Mástil de guitarra",
    notes: "Nombres de las notas",
    noteNames: ["Do", "Do♯", "Re", "Re♯", "Mi", "Fa", "Fa♯", "Sol", "Sol♯", "La", "La♯", "Si"],
  },
  find: {
    title: "Encuentra la nota",
    startSub: "Te sale el nombre de una nota. Tócala en todos los sitios del mástil donde esté.",
    prompt: "Busca todos los {n}",
    progress: "{f} de {t}",
    done: "¡Todos!",
    showRest: "Enséñamelos",
    keys: "Haz clic en cada sitio del mástil donde suene esa nota. Cada punto suena al tocarlo.",
  },
  challenge: {
    heading: "¿Cómo quieres practicar?",
    practice: "Libre",
    practiceSub: "Sin reloj y sin final. Paras cuando quieras.",
    timed: "Contrarreloj",
    timedSub: "¿Cuántas aciertas antes de que se acabe el tiempo?",
    streak: "Sin fallos",
    streakSub: "¿Cuántas seguidas antes del primer fallo?",
    minutes: "{m} min",
    start: "Empezar",
    timeUp: "¡Tiempo!",
    broken: "Esa no era",
    result: "{n} aciertos",
    best: "Tu mejor marca: {n}",
    newBest: "¡Nueva mejor marca!",
    again: "Otra vez",
    change: "Cambiar",
    streakNow: "{n} seguidas",
    rightNow: "{r} aciertos",
    clock: "Tiempo restante",
    stop: "Parar",
  },
  metronome: {
    title: "Metrónomo",
    speed: "Subida de tempo",
    speedHint: "Sube el tempo cada pocos compases, hasta un objetivo.",
    tempo: "Tempo",
    meter: "Compás",
    subdivision: "Subdivisión",
    accent: "Acento",
    accentOn: "En el uno",
    accentOff: "Sin acento",
    start: "Empezar",
    stop: "Parar",
    tap: "Tap",
    slower: "Más lento",
    faster: "Más rápido",
    keys: "Teclado: espacio para empezar o parar, ← → cambian el tempo (con Mayús, de 5 en 5), T para marcarlo.",
  },
  profile: {
    title: "Perfil",
    guitar: "Tu guitarra",
    guitarLede: "Los ejercicios y el mástil dibujan y suenan con esta guitarra: sus cuerdas y las notas que dan.",
    strings: "Cuerdas",
    tuning: "Afinación",
    tunings: { standard6: "Estándar", dropD: "Drop D", eFlat: "Mi♭ estándar", dStandard: "Re estándar", dropC: "Drop C", dadgad: "DADGAD", openG: "Sol abierta", openD: "Re abierta", standard7: "Estándar (Si grave)", dropA7: "Drop A", standard8: "Estándar (Fa♯ grave)", dropE8: "Drop E" },
    names: "Nombres de las notas",
    namesLede: "Cómo se escriben las notas en los botones y en el mástil, en toda la app.",
    language: "Idioma",
    records: "Récords",
    recordsEmpty: "Aún no hay récords. Juega a Nombra la nota o Encuentra la nota contrarreloj o sin fallos y aquí aparecerán tus mejores marcas.",
    stringsCount: "{n} cuerdas",
    achievements: "Logros",
    achievementsCount: "{e} de {t}",
    achievementList: {
      firstBest: { title: "Primer récord", body: "Consigue una marca en cualquier reto." },
      streak10: { title: "Diez seguidas", body: "Diez aciertos sin fallar ni una." },
      minute20: { title: "Veinte en un minuto", body: "Nombra 20 notas en un minuto." },
      allTwelve: { title: "Las doce", body: "Una marca con los sostenidos, no solo naturales." },
      finder: { title: "Buscador", body: "Encuentra 30 posiciones contrarreloj." },
      streak25: { title: "Veinticinco seguidas", body: "25 seguidas con las doce notas." },
      minute40: { title: "Cuarenta en un minuto", body: "Nombra 40 notas en un minuto, con las doce." },
      extended: { title: "Rango extendido", body: "Una marca con guitarra de siete u ocho cuerdas." },
      streak50: { title: "Cincuenta seguidas", body: "50 seguidas con las doce notas." },
    },
    data: "Tus datos",
    dataBody: "Todo lo de esta página se guarda solo en este navegador: no hay cuenta y no se envía nada. Borrarlo no tiene vuelta atrás.",
    erase: "Borrar mis datos",
    eraseConfirm: "¿Borrar tus récords, logros y ajustes de este navegador?",
  },
  backing: {
    title: "Backing tracks",
    lede: "Pon una y toca encima. Cada base dice su tonalidad y una escala que encaja; si te hace falta el mapa, ábrela en el mástil.",
    style: "Estilo",
    all: "Todas",
    styles: { blues: "Blues", rock: "Rock", metal: "Metal", funk: "Funk", jazz: "Jazz y bossa", modal: "Modal", spanish: "Flamenco", country: "Country", ballad: "Balada", neosoul: "Neo-soul" },
    major: "{n} mayor",
    minor: "{n} menor",
    playOver: "Toca:",
    scaleOn: "{scale} de {root}",
    play: "Reproducir {t}",
    by: "De {c}, en YouTube",
    onNeck: "Ver en el mástil",
    note: "Los vídeos son de YouTube y de quienes los hicieron. El reproductor de YouTube solo se carga cuando pulsas play.",
  },
  neck: {
    title: "El mástil",
    root: "Tónica",
    scale: "Escala",
    names: "Notas",
    degrees: "Grados",
    frets: "0–{n}",
    hint: "Toca una nota para oírla.",
    scales: { all: "Todas las notas", pentaMinor: "Pentatónica menor", pentaMajor: "Pentatónica mayor", blues: "Blues", major: "Mayor", minor: "Menor natural", harmonicMinor: "Menor armónica", melodicMinor: "Menor melódica", dorian: "Dórico", phrygian: "Frigio", lydian: "Lidio", mixolydian: "Mixolidio", locrian: "Locrio" },
  },
  speed: {
    title: "Entrenador de velocidad",
    from: "Inicio",
    to: "Objetivo",
    step: "Subida (BPM)",
    every: "Cada (compases)",
    atTarget: "Al llegar",
    hold: "Mantener",
    restart: "Volver a empezar",
    barOf: "Compás {b} de {e}",
    reached: "En el objetivo",
    keys: "Teclado: espacio para empezar o parar.",
  },
  settings: { challenge: "Reto", time: "Tiempo", notes: "Notas", all: "Todas", naturals: "Solo naturales", names: "Nombres", solfege: "Do Re Mi", letters: "C D E" },
  consent: {
    text: "Diesis usa Google Analytics para contar visitas, solo si tú lo permites. Sin anuncios y sin vender nada.",
    accept: "Permitir",
    decline: "No, gracias",
    more: "Privacidad",
  },
  privacy: {
    eyebrow: "Privacidad",
    h1: "Política de privacidad",
    updated: "Última actualización: 26 de septiembre de 2026",
    summary: "Diesis no tiene cuentas ni publicidad. Nada de lo que haces en Diesis sale de tu navegador. Lo único que medimos son las visitas a la web, con Google Analytics, y solo si tú lo permites.",
    sections: [
      { h: "La app", p: ["Diesis funciona por completo en tu navegador. No te pregunta quién eres, no crea ninguna cuenta y no envía nada de lo que haces a nadie, ni a nosotros ni a terceros.", "La puntuación de cada sesión se guarda en memoria y desaparece al cerrar la pestaña. Todo lo demás que eliges o consigues se queda en el almacenamiento local de tu navegador, solo en tu dispositivo: tu guitarra (cuerdas y afinación), cómo se nombran las notas, tus mejores marcas y el último reto que elegiste, los ajustes del metrónomo (con el plan de subida de tempo), lo último que elegiste en el mástil y tu tipo de guitarra, tiro y calibres de cuerda. Nada de eso se envía nunca a ningún sitio. El botón «Borrar mis datos» de tu perfil lo elimina, y también borrar los datos de la web."] },
      { h: "Cookies", p: ["Diesis guarda dos cookies: una recuerda el idioma que has elegido y la otra, lo que respondiste al aviso de analítica. Ninguna contiene datos sobre ti."] },
      { h: "Esta web", p: ["diesis.app está alojada en Vercel, que conserva durante poco tiempo los registros habituales de cualquier servidor (dirección IP, navegador, páginas solicitadas) para que el servicio funcione y esté protegido.", "Si lo permites en el aviso, la web carga Google Analytics 4 para contar visitas y ver qué páginas se leen. Google instala sus propias cookies para ello y trata los datos según su política de privacidad. Si dices que no, no se carga nada de Google; puedes cambiar de opinión borrando las cookies de la web."] },
      { h: "Backing tracks", p: ["La página de backing tracks muestra miniaturas que sirve YouTube (i.ytimg.com), así que YouTube ve tu dirección IP al cargarla. El reproductor viene de youtube-nocookie.com y solo se carga cuando pulsas play en una base; a partir de ahí, a ese vídeo se le aplica la política de privacidad de YouTube. Diesis no le envía a YouTube nada sobre ti."] },
      { h: "Sugerencias", p: ["Si envías el formulario de sugerencias, lo que escribes (tu nombre, tu mensaje y tu email si lo dejas) me llega por email a través de Resend, junto con la página desde la que lo envías, el idioma, la guitarra de tu perfil y tu navegador. No se guarda en ningún otro sitio: se queda en mi correo y solo lo uso para mejorar Diesis y contestarte."] },
      { h: "Menores", p: ["Diesis no recoge datos personales de nadie, tenga la edad que tenga."] },
      { h: "Cambios", p: ["Si esta política cambia, la nueva versión se publicará aquí con su fecha. Nunca empezará a recoger datos sin avisar."] },
    ],
    contactHeading: "Contacto",
    contact: "Para cualquier duda sobre privacidad, o sobre Diesis en general, escríbeme por Instagram a",
  },
};

export const strings: Record<Lang, Strings> = { en, es };

export function isLang(x: unknown): x is Lang {
  return x === "en" || x === "es";
}
