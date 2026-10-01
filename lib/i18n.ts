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

export type FeatureId = "name" | "find" | "neck" | "metronome" | "backing" | "fingers" | "strings";

export interface FeaturePage {
  slug: string;
  metaTitle: string;
  description: string;
  h1: string;
  lede: string;
  cta: string;
  points: { title: string; body: string }[];
  steps: { title: string; body: string }[];
  faq: { q: string; a: string }[];
}

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
    tools: string; faq: string; cta: string; privacy: string; about: string;
    /** The three sides of the app and their tools, in the order of `SIDES` in components/app-nav.tsx; the `Soon` lists are the tools shown dimmed as coming next. */
    areas: { learn: string; practice: string; setup: string };
    learnTools: string[];
    practiceTools: string[];
    setupTools: string[];
    learnSoon: string[];
    setupSoon: string[];
    soon: string;
    /** The sidebar's toggle. */
    collapse: string;
    expand: string;
  };
  /** `h1`: one short line per side of the app (Learn, Practice, Setup), each on its own line. */
  hero: { eyebrow: string; h1: string[]; lede: string; cta: string; secondary: string; trust: string[] };
  /** The hero's video (components/stage-video.tsx): what its one button says. */
  reel: { pause: string; play: string };
  /** The playable exercise under the hero (components/try-it.tsx holds the exercise's own words, `tryIt`). */
  taste: { eyebrow: string; h2: string; body: string };
  name: { eyebrow: string; p: string[] };
  pricing: { eyebrow: string; h2: string; price: string; sub: string; list: string[]; contactTitle: string; contact: string; contactAfter: string };
  faq: { eyebrow: string; h2: string; items: { q: string; a: string }[] };
  maker: { eyebrow: string; h2: string; p: string[]; site: string; instagram: string; photoAlt: string };
  closing: { h2: string; lede: string };
  /** /practice/strings (components/strings-setup.tsx). {n} a string number, {type} a guitar type. */
  setup: {
    title: string; lede: string; guitar: string; guitarLede: string; type: string; types: Record<string, string>; decimal: string; scale: string; profileNote: string;
    tension: string; tensionLede: string; nylon: string; sets: string; suggest: string; gaugeOf: string; plain: string; wound: string;
    feel: Record<"slack" | "balanced" | "tight", string>; total: string; estimate: string;
    setupTitle: string; setupLede: string; actionBass: string; actionTreble: string; relief: string; radius: string; flat: string;
    pickupBass: string; pickupTreble: string; setupNote: string; stepsTitle: string; stepsLede: string; steps: { title: string; body: string }[];
    /** Steps that differ on a steel-string acoustic (no pickups, a fixed saddle) and on a nylon-string classical (no truss rod either), by step index in `steps`; null drops the step. */
    stepVariants: { acoustic: Record<number, { title: string; body: string } | null>; nylon: Record<number, { title: string; body: string } | null> };
    /** Amazon.es links (lib/core/shop.ts). {set} a set name like "10-46", {n} a string count. */
    /** Target chips on steps 2–4: {v} is filled with the number for the chosen guitar. */
    aim: { relief: string; action: string; pickups: string };
    picksTitle: string; picksNote: string; picks: Record<"nickel" | "coated" | "bronze" | "normal" | "hard", string>;
    buy: string; buyNylon: string; query: { electric: string; acoustic: string; baritone: string; nylon: string; extended: string };
    gearTitle: string; gear: { label: string; query: string }[]; affiliate: string;
  };
  /** The feedback form (components/feedback.tsx). */
  feedback: {
    open: string; title: string; lede: string; name: string; message: string; messageHint: string; contact: string; optional: string;
    send: string; sending: string; privacy: string; sentTitle: string; sent: string; error: string; empty: string; close: string;
  };
  /** The playable Name the note in the landing's hero (components/try-it.tsx). {n} in streak. */
  tryIt: { prompt: string; hint: string; streak: string; doneTitle: string; doneBody: string; doneCta: string; again: string };
  /** The landing's tool cards (components/feature-cards.tsx), in the order of `FEATURES` in lib/features.ts. */
  tools: { eyebrow: string; h2: string; lede: string; open: string; items: { side: string; title: string; body: string }[] };
  /** The public page of each tool (components/feature-page.tsx): what it does, how to use it, the
   *  questions people search, and the link into the tool. `slug` is the page's address in this language. */
  features: {
    more: string; what: string; how: string; faq: string; others: string; all: string; closing: string;
    pages: Record<FeatureId, FeaturePage>;
  };
  footer: { tagline: string; made: string; affiliate: string };
  /** The page for an address that does not exist (app/global-not-found.tsx shows both languages). */
  notFound: { title: string; body: string; home: string };
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
    /** The short lines on the setup screen's challenge cards. */
    practiceCard: string;
    streakCard: string;
    noScore: string;
    noBest: string;
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
    meterHint: string;
    accentFirst: string;
    accentHint: string;
    subdivision: string;
    subHint: string;
    subNone: string;
    subOne: string;
    /** Uses {n}. */
    perBeat: string;
    /** What a split beat is called, by how it is written. */
    noteValues: { eighth: string; sixteenth: string; thirtySecond: string; triplet: string; sextuplet: string };
    /** Speed up when it is switched off. */
    off: string;
    done: string;
    start: string;
    stop: string;
    /** Speed up only: hold the climb where it is, and pick it up again. */
    pause: string;
    resume: string;
    paused: string;
    /** Under the countdown, the bar before the tempo begins. */
    countIn: string;
    /** The Speed up card's edge button, which opens its panel (the card itself is the switch). */
    speedSettings: string;
    tapTempo: string;
    slower: string;
    faster: string;
    keys: string;
  };
  /** /practice/fingers (components/fingers.tsx). {ms}, {g}, {n}, {k}, {p}, {bpm}, {w}, {m} as named. */
  fingers: {
    title: string; lede: string; tempo: string; pattern: string; random: string; notes: string; hand: string; left: string; right: string;
    /** Index, middle, ring, pinky: fingers 1 to 4. */
    fingerNames: string[];
    start: string; stop: string; again: string; change: string; ready: string; howTo: string; progress: string; onTimeNow: string;
    verdict: { good: string; early: string; late: string; wrong: string; missed: string };
    result: string; resultSub: string; lean: { early: string; late: string; on: string }; spread: string; mistakes: string;
    best: string; noBest: string; newBest: string; tip: string; keysLeft: string; keysRight: string;
    /** The key right of L: ; on an English keyboard, Ñ on a Spanish one. */
    semicolonKey: string;
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
  /** /log, the practice log (components/practice-log.tsx). {n} a number of days, {date} a date. */
  log: {
    title: string;
    /** Its short name in the app's navigation. */
    tab: string;
    /** What a shared link to it says. */
    blurb: string;
    /** Uses {n}, the week's number. */
    week: string;
    today: string;
    prev: string;
    next: string;
    /** Monday to Sunday, short. */
    days: string[];
    /** Said after a day's date to a screen reader: it has something written; it is the goal's date. */
    hasEntry: string;
    goalDay: string;
    setGoal: string;
    setGoalSub: string;
    /** After the goal's name: {n} days left (two or more), one, today, gone by. */
    left: string;
    leftOne: string;
    dueToday: string;
    overdue: string;
    editGoal: string;
    goalTitle: string;
    goalName: string;
    goalNameHint: string;
    goalDate: string;
    /** In one week, in two, in a month (30 days). */
    quick: string[];
    /** Under the date field: {n} days from today (two or more), tomorrow, today; each with {date}. */
    fromToday: string;
    tomorrow: string;
    onToday: string;
    pickDate: string;
    errors: { name: string; date: string; past: string };
    save: string;
    remove: string;
    close: string;
    /** The page's prompt, today and on a past day, and the hint that follows either. */
    askToday: string;
    askPast: string;
    dictate: string;
    future: string;
    /** Under the page: before anything is written, and once it is. */
    stays: string;
    saved: string;
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
    bar: string;
    /** Uses {n}. */
    bars: string;
    atTarget: string;
    hold: string;
    restart: string;
    /** Uses {b} and {e}. */
    barOf: string;
    reached: string;
    /** Uses {to}, the target tempo, and {time}, like "1 min 30 s". */
    eta: string;
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
    title: "Guitar practice app: fretboard trainer, scales, metronome · Diesis",
    description:
      "A guitar practice app in your browser: learn the notes on the fretboard, see every scale on the neck, build speed with a metronome and speed trainer, jam over backing tracks, train finger independence and work out the string tension for your guitar. Free while in preview.",
    privacyTitle: "Privacy",
    privacyDescription: "What Diesis does with your data: no account, no ads, and your settings and scores never leave your browser. Visits are counted with Google Analytics and PostHog only if you allow it.",
  },
  nav: { tools: "Tools", faq: "FAQ", cta: "Open the app", privacy: "Privacy", about: "About Diesis", areas: { learn: "Learn", practice: "Practice", setup: "Setup" }, learnTools: ["Name the note", "Find the note"], practiceTools: ["The neck", "Metronome", "Backing tracks", "Fingers"], setupTools: ["Strings"], learnSoon: ["Hear the note"], setupSoon: ["Tuner", "My guitars"], soon: "Soon", collapse: "Collapse the sidebar", expand: "Open the sidebar" },
  hero: {
    eyebrow: "The guitar practice app",
    h1: ["Know the neck.", "Lock in the tempo.", "Dial in your guitar."],
    lede: "Become the best guitarist you can be.",
    cta: "Open the app",
    secondary: "See the tools",
    trust: ["Free in preview", "No account", "Phone or laptop, in the browser"],
  },
  reel: { pause: "Pause the video", play: "Play the video" },
  taste: { eyebrow: "Try it", h2: "Name the note that lights up.", body: "The first exercise, right here on the page. Five in a row and you have the idea." },
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
    list: ["Every tool that exists", "No account, no sign-up", "Phone or laptop", "No ads"],
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
    decimal: ".",
    types: { strat: "Strat style", tele: "Tele style", lesPaul: "Les Paul / SG style", prs: "PRS style", superstrat: "Superstrat (Ibanez, Jackson…)", baritone: "Baritone", seven: "Seven strings", sevenLong: "Seven strings, long scale", eight: "Eight strings", acoustic: "Steel-string acoustic", classical: "Classical (nylon)" },
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
    setupNote: "Typical factory numbers, adjusted to the tension of the strings you chose. Starting points, not rules: lower plays easier and buzzes sooner, higher rings clearer. Adjust to how you play.",
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
    stepVariants: {
      acoustic: {
        2: { title: "Set the action", body: "At the 12th fret, from the top of the fret to the bottom of the string. Too high: sand the underside of the saddle, twice what you want to lose at the 12th fret. Too low: a shim under the saddle. Then play where you play most: no buzz." },
        3: null,
        4: { title: "Check the intonation", body: "Tune the open string, then play it at the 12th fret. The saddle is compensated at the factory and there is nothing to move; if a string plays clearly sharp or flat with fresh strings, the saddle needs reshaping, a job for a luthier." },
      },
      nylon: {
        0: { title: "Stretch the new strings", body: "Nylon stretches for days. Tune up, pull each string gently along its length, retune, and do it again each time you pick the guitar up until it holds pitch." },
        1: { title: "Check the relief", body: "Fret the low string at the 1st fret and at the 12th; the gap at the 6th–7th fret is the relief. Most classical guitars have no truss rod, so the relief is built in: if it is far off, that is a luthier's job." },
        2: { title: "Set the action", body: "At the 12th fret, from the top of the fret to the bottom of the string. Too high: sand the underside of the saddle, twice what you want to lose at the 12th fret. Too low: a shim under the saddle. Then play where you play most: no buzz." },
        3: null,
        4: { title: "Check the intonation", body: "Tune the open string, then play it at the 12th fret. The saddle is fixed; if a string plays clearly sharp or flat once the strings have settled, the saddle needs reshaping, a job for a luthier." },
        5: { title: "Tune and play", body: "New nylon strings settle over a week. Check the tuning often, and the relief again after that." },
      },
    },
    aim: { relief: "Aim for {v}", action: "Aim for {bass} on the low strings, {treble} on the high", pickups: "Aim for {bass} on the bass side, {treble} on the treble side" },
    picksTitle: "Strings to try",
    picksNote: "Real sets at exactly these gauges. Check the gauges on the pack before you buy; the pictures are illustrations, not the makers' packs.",
    picks: { nickel: "Nickel-plated steel: the usual choice", coated: "Coated: lasts longer, costs more", bronze: "Phosphor bronze: the usual acoustic sound", normal: "Normal tension", hard: "Hard tension" },
    buy: "Find {set} strings on Amazon.es",
    buyNylon: "Find classical strings on Amazon.es",
    query: { electric: "electric guitar strings {set}", acoustic: "acoustic guitar strings {set}", baritone: "baritone guitar strings {set}", nylon: "classical guitar strings normal tension", extended: " {n} string" },
    gearTitle: "What you need for a setup",
    gear: [
      { label: "String action ruler", query: "guitar string action ruler" },
      { label: "Feeler gauges", query: "feeler gauges set" },
      { label: "String winder and cutter", query: "guitar string winder cutter" },
      { label: "Clip-on tuner", query: "clip on guitar tuner" },
    ],
    affiliate: "As an Amazon Associate I earn from qualifying purchases. It costs you nothing and helps keep Diesis going.",
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
    h2: "Everything you need to master the guitar.",
    lede: "Each one has its own page: what it does, how to use it and the way in. No sign-up, nothing to install.",
    open: "Open",
    items: [
      { side: "Learn", title: "Name the note", body: "A position lights and plays. Say which note it is, against the clock if you dare." },
      { side: "Learn", title: "Find the note", body: "You get a name. Tap every place it lives on the neck." },
      { side: "Practice", title: "The neck", body: "Any scale on any root, across the whole fretboard. Here, A minor pentatonic." },
      { side: "Practice", title: "Metronome", body: "20 to 300 BPM, odd meters, tap tempo, and a Speed up mode that climbs to your target." },
      { side: "Practice", title: "Backing tracks", body: "Jam over tracks in every style, with the key and the scale to play shown on each." },
      { side: "Practice", title: "Finger independence", body: "Four pads, one per finger, and notes falling onto them on the click. Hit each one as it lands and see how close you were." },
      { side: "Setup", title: "Strings and setup", body: "Every string's tension for your tuning, a balanced set worked out for you, and the setup numbers for your guitar." },
    ],
  },
  features: {
    more: "How it works",
    what: "What it does",
    how: "How to use it",
    faq: "Questions",
    others: "More in Diesis",
    all: "All the tools",
    closing: "It opens in your browser. Free while in preview, no account.",
    pages: {
      name: {
        slug: "name-the-note",
        metaTitle: "Learn the notes on the guitar fretboard · Diesis",
        description: "A position on the neck lights up and plays: you say which note it is. Practice freely, against the clock or without a single mistake, on six, seven or eight strings. Free in the browser.",
        h1: "Learn every note on the guitar neck.",
        lede: "A position lights up and plays. You say which note it is, and know at once if you were right. A few minutes a day, until you stop having to think.",
        cta: "Open Name the note",
        points: [
          { title: "The whole neck, one note at a time", body: "Frets 0 to 12 on every string. Start with the seven naturals, then switch on all twelve." },
          { title: "Three ways to practice", body: "With no clock and no end, against the clock for one, two or five minutes, or to see how many you get before your first mistake. Your best score is kept." },
          { title: "Your guitar, your note names", body: "Six, seven or eight strings in the tuning you pick, and the notes written as C D E or Do Re Mi." },
          { title: "You hear every note", body: "Each position plays as it lights, so the name, the place and the sound stick together." },
        ],
        steps: [
          { title: "A position lights up", body: "One spot on the neck turns amber and the note plays. Frets 0 to 12, all six strings, every one of the twelve notes." },
          { title: "Name it", body: "Twelve buttons beside the neck, C to B, each sharp next to its note, written as ♯. On a laptop, just press the letter." },
          { title: "Green or red, then the next one", body: "Right: the spot turns green with the name written on it and the next note lights a moment later. Wrong: the button flashes red and the same note waits for you." },
        ],
        faq: [
          { q: "What is the fastest way to learn the notes on the fretboard?", a: "Little and often. Start with the naturals only, a few minutes a day, and add the sharps when those come without thinking. Going against the clock shows you which notes still make you stop." },
          { q: "Do I have to learn the sharps and flats separately?", a: "No. A sharp is one fret above its natural note, so once the naturals are solid the rest falls into place. Diesis writes them as sharps, ♯: F♯ and G♭ are the same place on the neck." },
          { q: "Does it work with seven strings or another tuning?", a: "Yes. Set your guitar in the profile: six, seven or eight strings, standard, drop D, DADGAD, open tunings and the low ones. The exercise then asks about that neck." },
        ],
      },
      find: {
        slug: "find-the-note",
        metaTitle: "Find any note everywhere on the guitar neck · Diesis",
        description: "You get a note name and tap every place it lives on the fretboard. The exercise that turns knowing the notes into finding them. Free in the browser.",
        h1: "Find every place a note lives on the neck.",
        lede: "You get a note. Tap every position of it between the nut and the 12th fret, until you have them all. The other half of knowing the fretboard.",
        cta: "Open Find the note",
        points: [
          { title: "Every position, not just one", body: "In the first twelve frets of a six-string guitar each note lives in six, seven or eight places. The exercise ends when you have found them all." },
          { title: "Right stays, wrong tells you", body: "A right tap stays green with the note's name. A wrong one flashes red and shows you which note that fret really is." },
          { title: "Every tap sounds", body: "You hear the note you touched, right or wrong, so your ear learns along with your eyes." },
          { title: "With time, or with a challenge", body: "Take your time and ask to be shown the ones you are missing, or go against the clock or without mistakes and keep your best." },
        ],
        steps: [
          { title: "Read the note", body: "A note name appears under the neck." },
          { title: "Tap every place it lives", body: "All the strings, frets 0 to 12. Each one you find stays lit." },
          { title: "Finish it, then the next", body: "When the last one is found another note comes up, never the same twice in a row." },
        ],
        faq: [
          { q: "How many times does each note appear on the fretboard?", a: "In frets 0 to 12 of a six-string guitar in standard tuning, six to eight times: once on each string, plus the 12th fret of every string tuned to that note. E has the most, eight." },
          { q: "How is it different from Name the note?", a: "It runs the other way. Name the note goes from a place to its name; this one goes from a name to its places. You need both to move around the neck freely." },
          { q: "What if I get stuck?", a: "In Practice there is a Show me button: it lights the ones you are missing and moves on. Nothing counts against you there." },
        ],
      },
      neck: {
        slug: "fretboard",
        metaTitle: "Guitar fretboard notes and scales in any key · Diesis",
        description: "See every note on the guitar neck, or any scale on any root: pentatonics, blues, major, the minors and the modes, by note name or by degree. Six, seven or eight strings. Free in the browser.",
        h1: "Every note and every scale, across the whole neck.",
        lede: "See all the notes on the fretboard, or pick a root and a scale and watch it light up from the nut to the 24th fret. Tap any note to hear it.",
        cta: "Open the neck",
        points: [
          { title: "Twelve scales on any root", body: "Minor and major pentatonic, blues, major, natural, harmonic and melodic minor, and the modes: Dorian, Phrygian, Lydian, Mixolydian and Locrian." },
          { title: "Notes or degrees", body: "Read each position as a note name, or as its degree in the scale: 1, ♭3, 5. The root is always amber." },
          { title: "Twelve frets or twenty-four", body: "The first octave to learn the shapes, the full neck to join them up." },
          { title: "Drawn for your guitar", body: "Six, seven or eight strings, in the tuning you set in your profile. Tune down and the notes move; the neck moves with them." },
        ],
        steps: [
          { title: "Pick a root", body: "Twelve buttons under the neck, C to B." },
          { title: "Pick a scale", body: "The neck lights every note of it, the root in amber." },
          { title: "Tap and listen", body: "Every lit note plays. Switch to degrees to see how the scale is built." },
        ],
        faq: [
          { q: "Which scale should I learn first on guitar?", a: "The minor pentatonic. It has five notes, it sits under most rock and blues solos, and the blues scale and the natural minor are the same shape with notes added." },
          { q: "What do the numbers mean?", a: "They are degrees: each note counted from the root. 1 is the root, ♭3 a minor third, 5 the fifth. The same numbers describe the scale in any key, which is why players think in them." },
          { q: "Does it show scale positions or boxes?", a: "Not yet. It shows the scale over the whole neck; positions are on the list." },
        ],
      },
      metronome: {
        slug: "metronome",
        metaTitle: "Online metronome with a speed trainer · Diesis",
        description: "A free online metronome for guitar practice: 20 to 300 BPM, odd time signatures, subdivisions, tap tempo, and a speed trainer that raises the tempo every few bars up to your target.",
        h1: "A metronome that builds your speed.",
        lede: "Set a tempo and it keeps it. Or give it a start, a target and a step, and it climbs a little every few bars while you play.",
        cta: "Open the metronome",
        points: [
          { title: "20 to 300 BPM, set three ways", body: "Slide the tempo ruler, type the number, or tap the tempo you have in your head." },
          { title: "Time signatures with their accents", body: "2/4, 3/4, 4/4, 5/4, 6/8 and 7/8, accented where each bar is felt." },
          { title: "Subdivisions", body: "Eighth notes, triplets, sixteenths or sextuplets between the beats, quieter than the beat itself." },
          { title: "Speed up", body: "Pick the start, the target, the step and how many bars each tempo lasts. Pause it and pick the climb up where you left it; at the target it stays there or starts over." },
        ],
        steps: [
          { title: "Set the tempo", body: "Slow enough to play the passage clean and relaxed." },
          { title: "Press Start", body: "On a computer, the space bar. It counts one bar in, then the beats light up as they sound." },
          { title: "Turn on Speed up", body: "One tap on its card. Set your target and let it climb a few BPM every few bars." },
        ],
        faq: [
          { q: "What tempo should I practice at?", a: "The fastest one at which the passage comes out clean and relaxed. If you tense up or miss notes it is too fast: come down ten and build again." },
          { q: "How does a speed trainer work?", a: "It raises the tempo by a small step after a set number of bars, so you go from comfortable to fast without stopping to touch anything. Small steps work best: two to five BPM." },
          { q: "Does it keep going if I switch tabs?", a: "Yes. It keeps time with the tab in the background, and while it runs it keeps your screen awake." },
        ],
      },
      backing: {
        slug: "backing-tracks",
        metaTitle: "Guitar backing tracks with the key and scale to play · Diesis",
        description: "Backing tracks to jam over in blues, rock, metal, funk, jazz, flamenco and more. Each one shows its key and a scale that fits, and opens that scale on the fretboard.",
        h1: "Backing tracks that tell you what to play.",
        lede: "Put a track on and play over it. Each one shows its key and a scale that fits, and one tap draws that scale on the neck.",
        cta: "Open backing tracks",
        points: [
          { title: "Ten styles", body: "Blues, rock, metal, funk, jazz and bossa, modal jams, flamenco, country, ballads and neo-soul." },
          { title: "Key and scale on every track", body: "No working out the key by ear before you can start. The track says it, with a scale that works over it." },
          { title: "From the track to the neck", body: "Show on the neck opens that scale on that root, across the whole fretboard." },
          { title: "Tracks by their makers", body: "The videos are their makers', on YouTube, and each one is credited. The player loads only when you press play." },
        ],
        steps: [
          { title: "Pick a style", body: "Filter the tracks by style." },
          { title: "Press play", body: "The track starts; its key and its scale are on the card." },
          { title: "Open the scale", body: "One tap shows it on the neck. Start on the root and go from there." },
        ],
        faq: [
          { q: "What scale do I play over a backing track?", a: "The one on the card. As a rule of thumb, over a track in a minor key the minor pentatonic on the same root always works, and over a major key, the major pentatonic." },
          { q: "Are the tracks made by Diesis?", a: "No. They are YouTube videos by the musicians who made them, credited on each card. Diesis adds the key, the scale and the link to the neck." },
        ],
      },
      fingers: {
        slug: "finger-independence",
        metaTitle: "Finger independence exercise for guitar, timed to the millisecond · Diesis",
        description: "A finger independence drill for guitarists: four pads, one per finger, and notes falling onto them to a metronome. See how close to the click each finger lands, in milliseconds.",
        h1: "Train each finger to move on its own, in time.",
        lede: "Four pads, one per finger. Notes fall onto them to a metronome: hit each pad the moment its note lands, and see how close to the click you were.",
        cta: "Open finger independence",
        points: [
          { title: "Measured in milliseconds", body: "Every hit is green or red, with how early or late it was. At the end, your average: ahead of the click, behind it, or right on it." },
          { title: "Orders that untangle the fingers", body: "Random, 1234, 4321, 1324, 2413 or 1423, over 16, 32 or 64 notes." },
          { title: "Either hand", body: "Phone flat on the table with your fingers on the pads, or the keyboard on a computer: A S D F for the left hand, J K L ; for the right." },
          { title: "A record worth chasing", body: "Your fastest clean run, with 90% of the notes on time or better, kept for each order and length." },
        ],
        steps: [
          { title: "Set a slow tempo", body: "60 BPM is a good place to start." },
          { title: "Hit each pad as its note lands", body: "One bar of count-in, then one note per click." },
          { title: "Clean? Go up five", body: "When a run comes out clean, raise the tempo five BPM and go again." },
        ],
        faq: [
          { q: "What is finger independence?", a: "Being able to move one finger without the others moving with it. On the guitar it is what lets the ring finger and the pinky land cleanly and on time." },
          { q: "Does it replace practicing on the guitar?", a: "No. It trains timing and control away from the neck. Take the same orders to the guitar afterwards, one finger per fret, with the metronome." },
          { q: "Can I use wireless headphones?", a: "Better not. Bluetooth delays the click, so your hits will read as late. Use the speaker or wired headphones." },
        ],
      },
      strings: {
        slug: "strings",
        metaTitle: "Guitar string tension calculator and setup guide · Diesis",
        description: "Work out the tension of every string for your tuning and scale length, find a balanced set, and get the setup numbers for your type of guitar: action, relief, pickup height and intonation.",
        h1: "The right strings for your tuning, and the numbers to set it up.",
        lede: "See how tight each string is on your guitar, in your tuning. Load a common set or let Diesis work out a balanced one, then follow the setup steps after the string change.",
        cta: "Open strings and setup",
        points: [
          { title: "Tension for every string", body: "Worked out from your gauges, tuning and scale length, within about 5% of the makers' own tables. Green is comfortable, amber slack, red tight." },
          { title: "A balanced set, worked out", body: "Pick a common set, or ask for one balanced for your tuning. It also names real sets at those gauges." },
          { title: "Setup numbers for your guitar", body: "Action, neck relief, fretboard radius and pickup height for eleven types of guitar, from Strat and Les Paul styles to eight strings, acoustics and classicals." },
          { title: "What to do after a string change", body: "Stretch, relief, action, pickups, intonation, in the order that works. The steps change for acoustic and classical guitars." },
        ],
        steps: [
          { title: "Pick your type of guitar", body: "It sets the scale length; change it if yours is different." },
          { title: "Set strings and tuning", body: "Six, seven or eight, in the tuning you play in." },
          { title: "Read the bars", body: "Try sets until every string is in the green, then follow the setup steps." },
        ],
        faq: [
          { q: "What string gauge do I need for a lower tuning?", a: "A heavier one. Tune down and the same set goes slack: it buzzes and feels loose. Enter your tuning and go up in gauge until the bars turn green, or let Diesis suggest a balanced set." },
          { q: "What is a good string tension?", a: "Diesis marks each string as slack, balanced or tight. What matters most is that the strings are close to each other, so none feels loose next to its neighbours." },
          { q: "Do I have to adjust the guitar after changing gauge?", a: "Usually. Heavier strings pull harder on the neck, so check the relief first, then the action, then the intonation. Diesis lists the steps in that order." },
        ],
      },
    },
  },
  notFound: { title: "This page does not exist.", body: "The address may be mistyped, or the page has moved.", home: "Go to Diesis" },
  footer: { tagline: "Everything you need to master the guitar.", made: "Made in Cáceres, Spain. “Diesis” is Greek for the semitone: one fret.", affiliate: "As an Amazon Associate I earn from qualifying purchases." },
  home: {
    title: "Learn, practice, set up",
    h1: "What do you want to do today?",
    lede: "Guitar on your lap, screen sideways if it is a phone.",
    about: "About Diesis",
    start: "Start",
    next: "Coming next",
    later: "Later",
    learn: "Exercises that teach you the guitar: every note on the neck first, then scales and reading music.",
    practice: "The tools you play with: the neck with any scale on it, a metronome that builds your speed, backing tracks and a finger independence drill.",
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
      { title: "Finger independence", body: "Four pads, one per finger, and notes falling onto them to a click. Train each finger to move on its own, in time." },
    ],
  },
  setupMenu: {
    title: "Setup",
    lede: "Look after the guitar itself: strings, tension and setup.",
    modes: [
      { title: "Strings and setup", body: "Each string's tension, the gauges that suit your guitar and tuning, and the setup numbers for your type of guitar." },
      { title: "Tuner and intonation", body: "Tune through the microphone in your guitar's own tuning. Then play each string open and at the 12th fret, and it tells you which way to move the saddle, and how far." },
      { title: "My guitars", body: "More than one guitar, each with its type, scale, tuning, strings and the setup you last gave it. Pick the one in your hands and the whole of Diesis uses it." },
      { title: "Changing tuning", body: "Going from standard to drop C? What each string's tension does, whether your set still works, and what to check after: the truss rod and the intonation." },
      { title: "Why does it buzz?", body: "Pick what is wrong (buzz on the low frets, buzz up the neck, notes going sharp up the neck, a string catching in the nut) and get the likely cause and the order to fix it." },
      { title: "String log", body: "When you last changed strings and which set. Diesis knows how much you practice, so it tells you when they are due." },
      { title: "Care and humidity", body: "Cleaning the fretboard (oil on rosewood and ebony, never on maple), the frets, humidity for acoustics and classicals (45–55%), travel and changes of season." },
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
    practiceCard: "No clock, no end.",
    streakCard: "Until the first slip.",
    noScore: "No score kept",
    noBest: "No best yet",
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
    meterHint: "How many beats in each bar.",
    accentFirst: "Accent the first beat",
    accentHint: "A higher click on the one.",
    subdivision: "Subdivision",
    subHint: "How each beat is split: extra, quieter clicks between the beats.",
    subNone: "None",
    subOne: "One click per beat",
    perBeat: "{n} per beat",
    noteValues: { eighth: "Eighth notes", sixteenth: "Sixteenth notes", thirtySecond: "Thirty-second notes", triplet: "Triplets", sextuplet: "Sextuplets" },
    off: "Off",
    done: "Done",
    start: "Start",
    stop: "Stop",
    pause: "Pause",
    resume: "Resume",
    paused: "Paused",
    countIn: "Count-in",
    speedSettings: "Speed up settings",
    tapTempo: "Tap tempo",
    slower: "Slower",
    faster: "Faster",
    keys: "Keys: Space starts and stops, ← → change the tempo (Shift for 5 at a time), T taps it.",
  },
  fingers: {
    title: "Finger independence",
    lede: "Four pads, one per finger. Notes fall down each pad's column to a metronome: hit the pad the moment its note lands on it, right on the click. Phone flat on the table and your fingers on the pads, or the keyboard on a computer.",
    tempo: "Tempo",
    pattern: "Order",
    random: "Random",
    notes: "Notes",
    hand: "Hand",
    left: "Left",
    right: "Right",
    fingerNames: ["Index", "Middle", "Ring", "Pinky"],
    start: "Start",
    stop: "Stop",
    again: "Again",
    change: "Change settings",
    ready: "Get ready",
    howTo: "Hit each pad as its note lands on it.",
    progress: "{k} of {n}",
    onTimeNow: "{g} on time",
    verdict: { good: "{ms} ms", early: "{ms} ms early", late: "{ms} ms late", wrong: "Wrong finger", missed: "Missed" },
    result: "{p}% on time",
    resultSub: "{g} of {n} notes on time, at {bpm} BPM.",
    lean: { early: "You play {ms} ms ahead of the click on average.", late: "You play {ms} ms behind the click on average.", on: "Right on the click, on average." },
    spread: "Average distance from the click: {ms} ms.",
    mistakes: "Wrong finger: {w}. Missed: {m}.",
    best: "Fastest clean run: {bpm} BPM",
    noBest: "No clean run yet with this order and length. A run is clean at 90% on time or better.",
    newBest: "New record: your fastest clean run.",
    tip: "Start slow. When a run comes out clean, go up five.",
    keysLeft: "Keys: A S D F, pinky to index. Space starts and stops.",
    keysRight: "Keys: J K L ;, index to pinky. Space starts and stops.",
    semicolonKey: ";",
  },
  profile: {
    title: "Profile",
    guitar: "Your guitar",
    guitarLede: "The exercises and the neck draw and play this guitar: its strings and the notes they give.",
    strings: "Strings",
    tuning: "Tuning",
    tunings: { standard6: "Standard", dropD: "Drop D", eFlat: "E♭ standard", dStandard: "D standard", dropC: "Drop C", dadgad: "DADGAD", openG: "Open G", openD: "Open D", bStandard: "B standard (baritone)", dropA: "Drop A (baritone)", standard7: "Standard (low B)", eFlat7: "E♭ standard (low B♭)", dStandard7: "D standard (low A)", dropA7: "Drop A", dropG7: "Drop G", dropFs7: "Drop F♯", standard8: "Standard (low F♯)", eFlat8: "E♭ standard (low F)", dStandard8: "D standard (low E)", dropE8: "Drop E" },
    names: "Note names",
    namesLede: "How notes are written on the buttons and on the neck, everywhere in the app.",
    language: "Language",
    records: "Records",
    recordsEmpty: "No records yet. Try Name the note or Find the note against the clock or with no mistakes, and your bests appear here.",
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
    dataBody: "Everything on this page, and your practice log, lives in this browser only: there is no account and nothing is sent. Erasing it cannot be undone.",
    erase: "Erase my data",
    eraseConfirm: "Erase your records, achievements, settings and practice log from this browser?",
  },
  log: {
    title: "Practice log",
    tab: "Log",
    blurb: "Set a goal with a date and write down what you did each day to get there. A week at a glance, a page per day, and it all stays in your browser.",
    week: "Week {n}",
    today: "Today",
    prev: "Previous week",
    next: "Next week",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    hasEntry: "something written",
    goalDay: "the date of your goal",
    setGoal: "Set a goal",
    setGoalSub: "A piece, a solo, a date to be ready by",
    left: "{n} days left",
    leftOne: "1 day left",
    dueToday: "it's today",
    overdue: "the date has passed",
    editGoal: "Change your goal",
    goalTitle: "Your goal",
    goalName: "What are you working towards?",
    goalNameHint: "The solo for the gig",
    goalDate: "By when?",
    quick: ["In 1 week", "In 2 weeks", "In a month"],
    fromToday: "{n} days from today · {date}",
    tomorrow: "Tomorrow · {date}",
    onToday: "Today · {date}",
    pickDate: "Pick a date, or one of the three above.",
    errors: { name: "Give the goal a name.", date: "Pick the date you want it ready by.", past: "Pick a date from today on." },
    save: "Save goal",
    remove: "Remove goal",
    close: "Close",
    askToday: "What did you do today?",
    askPast: "What did you do this day?",
    dictate: "Write it, or dictate it with the microphone on your keyboard.",
    future: "Still to come.",
    stays: "Stays in this browser",
    saved: "Saved in this browser",
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
    step: "Go up by",
    every: "Every",
    bar: "1 bar",
    bars: "{n} bars",
    atTarget: "At the target",
    hold: "Stay there",
    restart: "Start over",
    barOf: "Bar {b} of {e}",
    reached: "At the target",
    eta: "Reaches {to} in about {time}",
    keys: "Keys: Space starts, pauses and resumes, Esc stops, ← → change the start tempo (Shift for 5 at a time).",
  },
  settings: { challenge: "Challenge", time: "Time", notes: "Notes", all: "All twelve", naturals: "Naturals only", names: "Note names", solfege: "Do Re Mi", letters: "C D E" },
  consent: {
    text: "Diesis counts visits and which tools get used, with Google Analytics and PostHog, only if you say yes. No ads, nothing sold.",
    accept: "Allow",
    decline: "No thanks",
    more: "Privacy",
  },
  privacy: {
    eyebrow: "Privacy",
    h1: "Privacy policy",
    updated: "Last updated 1 October 2026",
    summary: "Diesis has no account and no advertising. What you choose, score and write in Diesis stays in your browser. The only thing measured is visits: which pages and tools are opened, with Google Analytics and PostHog, and only if you allow it.",
    sections: [
      { h: "The app", p: ["Diesis runs entirely in your browser. It does not ask who you are, does not create an account, and does not send your answers, scores or settings to me or to anyone else.", "Your score for a session is held in memory and disappears when you close the tab. Everything else you choose or earn stays in your browser's local storage, on your device only: your guitar (strings and tuning), how notes are named, your personal bests and the challenge you last picked, the metronome's settings (including a speed-up plan), the finger exercise's settings and your fastest clean runs in it, what you last picked on the neck, your guitar type, scale length and string gauges, and your practice log (your goal and what you write each day). None of it is ever sent anywhere. The Erase my data button in your profile removes it, and so does clearing the site's data."] },
      { h: "Cookies", p: ["Diesis sets two cookies. One remembers the language you picked; the other remembers your answer to the analytics banner. Neither holds anything about you."] },
      { h: "This website", p: ["diesis.app is hosted by Vercel, which keeps standard server logs (IP address, browser, pages requested) for a short time to run the service and keep it safe.", "If you allow it in the banner, the site loads Google Analytics 4 and PostHog to count visits and see which pages and tools are opened, for how long, how fast they load and from what kind of device. Google sets its own cookies for that; PostHog keeps a random identifier in your browser's local storage, does not record your screen or your clicks, and stores its data in the European Union. Each processes the data under its own privacy policy. If you decline, nothing from Google or PostHog is loaded, and you can change your mind by clearing the site's cookies."] },
      { h: "Backing tracks", p: ["The backing tracks page shows thumbnails served by YouTube (i.ytimg.com), so YouTube sees your IP address when the page loads. The video player comes from youtube-nocookie.com and loads only when you press play on a track; from then on YouTube's privacy policy applies to that video. Diesis sends YouTube nothing about you."] },
      { h: "Links to Amazon", p: ["Some pages link to searches on Amazon.es with my Associates store id, so Amazon can tell the visit came from Diesis. Nothing is loaded from Amazon until you click, and Diesis sends Amazon nothing about you; once you are on Amazon, its own privacy policy and cookies apply. As an Amazon Associate I earn from qualifying purchases."] },
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
    title: "App para practicar guitarra: notas del mástil, escalas, metrónomo · Diesis",
    description:
      "Una app para practicar guitarra en el navegador: apréndete las notas del mástil, mira todas las escalas, gana velocidad con el metrónomo y la subida de tempo, improvisa sobre backing tracks, trabaja la independencia de dedos y calcula la tensión de las cuerdas de tu guitarra. Gratis durante la beta.",
    privacyTitle: "Privacidad",
    privacyDescription: "Qué hace Diesis con tus datos: sin cuenta, sin anuncios, y tus ajustes y tus marcas no salen de tu navegador. Las visitas se cuentan con Google Analytics y PostHog solo si tú lo permites.",
  },
  nav: { tools: "Herramientas", faq: "Preguntas", cta: "Abrir la app", privacy: "Privacidad", about: "Sobre Diesis", areas: { learn: "Aprender", practice: "Practicar", setup: "Ajuste" }, learnTools: ["Nombra la nota", "Encuentra la nota"], practiceTools: ["El mástil", "Metrónomo", "Backing tracks", "Dedos"], setupTools: ["Cuerdas"], learnSoon: ["Escucha la nota"], setupSoon: ["Afinador", "Mis guitarras"], soon: "Pronto", collapse: "Plegar la barra lateral", expand: "Desplegar la barra lateral" },
  hero: {
    eyebrow: "La app para practicar guitarra",
    h1: ["Domina el mástil.", "Clava el tempo.", "Pon a punto tu guitarra."],
    lede: "Llega a ser el mejor guitarrista que puedas ser.",
    cta: "Abrir la app",
    secondary: "Ver las herramientas",
    trust: ["Gratis durante la beta", "Sin registro", "En el navegador, móvil u ordenador"],
  },
  reel: { pause: "Pausar el vídeo", play: "Reproducir el vídeo" },
  taste: { eyebrow: "Pruébalo", h2: "Di qué nota se ilumina.", body: "El primer ejercicio, aquí mismo. Cinco seguidas y ya le has cogido el truco." },
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
    list: ["Todas las herramientas disponibles", "Sin cuenta ni registro", "Móvil u ordenador", "Sin anuncios"],
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
      { q: "¿Habrá app para el móvil?", a: "Primero la versión web, que ya funciona en el móvil. Si la pide bastante gente, haré una app nativa." },
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
    decimal: ",",
    types: { strat: "Tipo Strat", tele: "Tipo Tele", lesPaul: "Tipo Les Paul / SG", prs: "Tipo PRS", superstrat: "Superstrat (Ibanez, Jackson…)", baritone: "Barítona", seven: "Siete cuerdas", sevenLong: "Siete cuerdas, tiro largo", eight: "Ocho cuerdas", acoustic: "Acústica de acero", classical: "Clásica (nailon)" },
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
    setupNote: "Medidas habituales de fábrica, ajustadas a la tensión de las cuerdas que has elegido. Son puntos de partida, no reglas: más baja se toca más fácil y trastea antes; más alta suena más limpia. Ajústalas a cómo tocas.",
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
    stepVariants: {
      acoustic: {
        2: { title: "Ajusta la altura de las cuerdas", body: "En el traste 12, desde lo alto del traste hasta la parte de abajo de la cuerda. Si está alta, lija la base de la selleta el doble de lo que quieras bajar en el traste 12; si está baja, pon una lámina debajo. Luego toca donde más tocas: sin trastear." },
        3: null,
        4: { title: "Comprueba la octavación", body: "Afina la cuerda al aire y tócala en el traste 12. La selleta viene compensada de fábrica y no hay nada que mover; si con cuerdas nuevas una cuerda sale claramente alta o baja, hay que retocar la selleta: trabajo de luthier." },
      },
      nylon: {
        0: { title: "Estira las cuerdas nuevas", body: "El nailon se estira durante días. Afina, tira con suavidad de cada cuerda a lo largo, vuelve a afinar y repítelo cada vez que cojas la guitarra hasta que aguante la afinación." },
        1: { title: "Mira la curvatura", body: "Pisa la cuerda grave en el traste 1 y en el 12; el hueco en el traste 6 o 7 es la curvatura. Casi ninguna clásica tiene alma, así que la curvatura viene de fábrica: si está muy lejos, es cosa de un luthier." },
        2: { title: "Ajusta la altura de las cuerdas", body: "En el traste 12, desde lo alto del traste hasta la parte de abajo de la cuerda. Si está alta, lija la base de la selleta el doble de lo que quieras bajar en el traste 12; si está baja, pon una lámina debajo. Luego toca donde más tocas: sin trastear." },
        3: null,
        4: { title: "Comprueba la octavación", body: "Afina la cuerda al aire y tócala en el traste 12. La selleta es fija; si con las cuerdas ya asentadas una cuerda sale claramente alta o baja, hay que retocar la selleta: trabajo de luthier." },
        5: { title: "Afina y toca", body: "Las cuerdas de nailon nuevas tardan una semana en asentarse. Afina a menudo y revisa después la curvatura." },
      },
    },
    aim: { relief: "Objetivo: {v}", action: "Objetivo: {bass} en las graves, {treble} en las agudas", pickups: "Objetivo: {bass} en el lado grave, {treble} en el lado agudo" },
    picksTitle: "Cuerdas para probar",
    picksNote: "Juegos reales con estos mismos calibres. Mira los calibres del paquete antes de comprar; las imágenes son ilustraciones, no el paquete real de cada marca.",
    picks: { nickel: "Acero niquelado: la opción de siempre", coated: "Con recubrimiento: duran más, cuestan más", bronze: "Bronce fosforado: el sonido acústico de siempre", normal: "Tensión normal", hard: "Tensión alta" },
    buy: "Buscar cuerdas {set} en Amazon.es",
    buyNylon: "Buscar cuerdas de clásica en Amazon.es",
    query: { electric: "cuerdas guitarra eléctrica {set}", acoustic: "cuerdas guitarra acústica {set}", baritone: "cuerdas guitarra barítono {set}", nylon: "cuerdas guitarra clásica tensión normal", extended: " {n} cuerdas" },
    gearTitle: "Lo que necesitas para ajustarla",
    gear: [
      { label: "Regla para la altura de cuerdas", query: "regla altura cuerdas guitarra" },
      { label: "Galgas de espesores", query: "galgas de espesores" },
      { label: "Enrollador y cortacuerdas", query: "enrollador cuerdas guitarra cortador" },
      { label: "Afinador de pinza", query: "afinador de pinza guitarra" },
    ],
    affiliate: "En calidad de Afiliado de Amazon, obtengo ingresos por las compras adscritas que cumplen los requisitos aplicables. A ti no te cuesta nada y ayuda a mantener Diesis.",
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
    h2: "Todo lo que necesitas para dominar la guitarra.",
    lede: "Cada una tiene su página: qué hace, cómo se usa y por dónde se entra. Sin registro y sin instalar nada.",
    open: "Abrir",
    items: [
      { side: "Aprender", title: "Nombra la nota", body: "Se ilumina una posición y suena. Di qué nota es, y contrarreloj si te atreves." },
      { side: "Aprender", title: "Encuentra la nota", body: "Te dan una nota. Tócala en todos los sitios del mástil donde esté." },
      { side: "Practicar", title: "El mástil", body: "Cualquier escala sobre cualquier tónica, por todo el mástil. Aquí, la pentatónica menor de La." },
      { side: "Practicar", title: "Metrónomo", body: "De 20 a 300 BPM, compases de amalgama, tap tempo y una subida de tempo que te lleva hasta tu objetivo." },
      { side: "Practicar", title: "Backing tracks", body: "Bases de todos los estilos para improvisar encima, cada una con su tonalidad y la escala que encaja." },
      { side: "Practicar", title: "Independencia de dedos", body: "Cuatro botones, uno por dedo, y notas que caen sobre ellos en el clic. Pulsa cada uno cuando le llega la suya y mira lo cerca que has quedado." },
      { side: "Ajuste", title: "Cuerdas y ajuste", body: "La tensión de cada cuerda con tu afinación, un juego equilibrado calculado para ti y las medidas de ajuste de tu guitarra." },
    ],
  },
  features: {
    more: "Cómo funciona",
    what: "Qué hace",
    how: "Cómo se usa",
    faq: "Preguntas",
    others: "Más en Diesis",
    all: "Todas las herramientas",
    closing: "Se abre en el navegador. Gratis durante la beta y sin registro.",
    pages: {
      name: {
        slug: "nombra-la-nota",
        metaTitle: "Aprende las notas del mástil de la guitarra · Diesis",
        description: "Se ilumina una posición del mástil y suena: tú dices qué nota es. Práctica libre, contrarreloj o sin fallos, con seis, siete u ocho cuerdas. Gratis y en el navegador.",
        h1: "Apréndete todas las notas del mástil.",
        lede: "Se ilumina una posición y suena. Dices qué nota es y sabes al momento si has acertado. Unos minutos al día, hasta que te salga sin pensar.",
        cta: "Abrir Nombra la nota",
        points: [
          { title: "Todo el mástil, nota a nota", body: "Del traste 0 al 12 en todas las cuerdas. Empieza por las siete naturales y, cuando las tengas, activa las doce." },
          { title: "Tres formas de practicar", body: "Sin reloj y sin final, contrarreloj durante uno, dos o cinco minutos, o a ver cuántas encadenas antes del primer fallo. Tu mejor marca se queda guardada." },
          { title: "Tu guitarra y tus nombres de nota", body: "Seis, siete u ocho cuerdas con la afinación que elijas, y las notas escritas como Do Re Mi o como C D E." },
          { title: "Cada nota suena", body: "La posición suena al iluminarse, y así el nombre, el sitio y el sonido se te quedan juntos." },
        ],
        steps: [
          { title: "Se ilumina una posición", body: "Un punto del mástil se enciende en ámbar y suena la nota. Del traste 0 al 12, las seis cuerdas, las doce notas." },
          { title: "Di cuál es", body: "Doce botones al lado del mástil, de Do a Si, cada sostenido junto a su nota y escrito como ♯. En el ordenador basta con pulsar la tecla de la nota." },
          { title: "Verde o rojo, y a por la siguiente", body: "Si aciertas, el punto se pone verde con el nombre encima y enseguida se enciende la siguiente nota. Si fallas, el botón parpadea en rojo y la nota se queda esperando." },
        ],
        faq: [
          { q: "¿Cuál es la forma más rápida de aprenderse las notas del mástil?", a: "Poco y a menudo. Empieza solo con las naturales, unos minutos al día, y añade los sostenidos cuando esas te salgan sin pensar. El contrarreloj te enseña qué notas te siguen frenando." },
          { q: "¿Hay que aprenderse aparte los sostenidos y los bemoles?", a: "No. Un sostenido está un traste por encima de su nota natural, así que con las naturales bien sabidas lo demás cae solo. Diesis los escribe como sostenidos, con ♯: Fa♯ y Sol♭ son el mismo sitio del mástil." },
          { q: "¿Sirve para siete cuerdas o para otra afinación?", a: "Sí. Pon tu guitarra en el perfil: seis, siete u ocho cuerdas, estándar, drop D, DADGAD, afinaciones abiertas y las graves. El ejercicio pregunta sobre ese mástil." },
        ],
      },
      find: {
        slug: "encuentra-la-nota",
        metaTitle: "Encuentra cada nota en todo el mástil de la guitarra · Diesis",
        description: "Te dan una nota y la tocas en todos los sitios del mástil donde está. El ejercicio que convierte saberse las notas en encontrarlas. Gratis y en el navegador.",
        h1: "Encuentra cada nota en todos los sitios del mástil.",
        lede: "Te dan una nota. Tócala en todas las posiciones donde esté, de la cejuela al traste 12, hasta que no te quede ninguna. La otra mitad de saberse el mástil.",
        cta: "Abrir Encuentra la nota",
        points: [
          { title: "Todas las posiciones, no solo una", body: "En los doce primeros trastes de una guitarra de seis cuerdas, cada nota está en seis, siete u ocho sitios. El ejercicio termina cuando los has encontrado todos." },
          { title: "Si aciertas se queda; si fallas, te lo dice", body: "Un acierto se queda en verde con el nombre de la nota. Un fallo parpadea en rojo y te enseña qué nota es en realidad ese traste." },
          { title: "Todo lo que tocas suena", body: "Oyes la nota que has pulsado, aciertes o no, y el oído aprende a la vez que la vista." },
          { title: "Con calma o con reto", body: "Tómate tu tiempo y pide que te enseñe las que te faltan, o ve contrarreloj o sin fallos y guarda tu mejor marca." },
        ],
        steps: [
          { title: "Lee la nota", body: "Debajo del mástil aparece el nombre de una nota." },
          { title: "Tócala en todos sus sitios", body: "En todas las cuerdas, del traste 0 al 12. Cada una que encuentras se queda encendida." },
          { title: "Complétala y a por la siguiente", body: "Al encontrar la última sale otra nota, nunca la misma dos veces seguidas." },
        ],
        faq: [
          { q: "¿Cuántas veces aparece cada nota en el mástil?", a: "Del traste 0 al 12 de una guitarra de seis cuerdas en afinación estándar, entre seis y ocho: una por cuerda, más el traste 12 de cada cuerda afinada en esa nota. La que más, Mi, con ocho." },
          { q: "¿En qué se diferencia de Nombra la nota?", a: "Va en sentido contrario. Nombra la nota va del sitio al nombre; este, del nombre a los sitios. Para moverte con soltura por el mástil hacen falta los dos." },
          { q: "¿Y si me atasco?", a: "En la práctica libre tienes el botón «Enséñamelos»: enciende los que te faltan y pasa a la siguiente nota. Ahí no cuenta nada en tu contra." },
        ],
      },
      neck: {
        slug: "mastil",
        metaTitle: "Notas y escalas en el mástil de la guitarra, en cualquier tonalidad · Diesis",
        description: "Todas las notas del mástil de la guitarra, o cualquier escala sobre cualquier tónica: pentatónicas, blues, mayor, las menores y los modos, por nombre de nota o por grado. Seis, siete u ocho cuerdas. Gratis y en el navegador.",
        h1: "Todas las notas y todas las escalas, por todo el mástil.",
        lede: "Mira todas las notas del mástil, o elige una tónica y una escala y verás cómo se enciende de la cejuela al traste 24. Toca cualquier nota para oírla.",
        cta: "Abrir el mástil",
        points: [
          { title: "Doce escalas sobre cualquier tónica", body: "Pentatónica menor y mayor, blues, mayor, menor natural, armónica y melódica, y los modos: dórico, frigio, lidio, mixolidio y locrio." },
          { title: "Notas o grados", body: "Lee cada posición por el nombre de la nota o por su grado en la escala: 1, ♭3, 5. La tónica va siempre en ámbar." },
          { title: "Doce trastes o veinticuatro", body: "La primera octava para aprenderte los dibujos; el mástil entero para unirlos." },
          { title: "Dibujado para tu guitarra", body: "Seis, siete u ocho cuerdas, con la afinación de tu perfil. Si afinas más grave, las notas cambian de sitio y el mástil con ellas." },
        ],
        steps: [
          { title: "Elige la tónica", body: "Doce botones bajo el mástil, de Do a Si." },
          { title: "Elige la escala", body: "El mástil enciende todas sus notas, con la tónica en ámbar." },
          { title: "Toca y escucha", body: "Cada nota encendida suena. Pasa a grados para ver cómo está construida la escala." },
        ],
        faq: [
          { q: "¿Qué escala me aprendo primero en la guitarra?", a: "La pentatónica menor. Tiene cinco notas, está detrás de casi todos los solos de rock y de blues, y la escala de blues y la menor natural son el mismo dibujo con alguna nota más." },
          { q: "¿Qué significan los números?", a: "Son los grados: cada nota contada desde la tónica. El 1 es la tónica, el ♭3 la tercera menor y el 5 la quinta. Los mismos números describen la escala en cualquier tonalidad, y por eso los guitarristas piensan con ellos." },
          { q: "¿Enseña las posiciones o cajas de la escala?", a: "Todavía no. Muestra la escala por todo el mástil; las posiciones están en la lista." },
        ],
      },
      metronome: {
        slug: "metronomo",
        metaTitle: "Metrónomo online con subida de tempo · Diesis",
        description: "Metrónomo online gratis para practicar con la guitarra: de 20 a 300 BPM, compases de amalgama, subdivisiones, tap tempo y una subida de tempo que acelera cada pocos compases hasta tu objetivo.",
        h1: "Un metrónomo que te hace ganar velocidad.",
        lede: "Le pones un tempo y lo mantiene. O le das un tempo de salida, un objetivo y un paso, y va subiendo un poco cada pocos compases mientras tú tocas.",
        cta: "Abrir el metrónomo",
        points: [
          { title: "De 20 a 300 BPM, de tres maneras", body: "Desliza la regla de tempo, escribe el número o marca con toques el tempo que llevas en la cabeza." },
          { title: "Compases con sus acentos", body: "2/4, 3/4, 4/4, 5/4, 6/8 y 7/8, acentuados donde se siente cada compás." },
          { title: "Subdivisiones", body: "Corcheas, tresillos, semicorcheas o seisillos entre tiempo y tiempo, más suaves que el propio tiempo." },
          { title: "Subida de tempo", body: "Elige la salida, el objetivo, el paso y cuántos compases dura cada tempo. Puedes pausarla y seguir donde lo dejaste; al llegar, se queda ahí o vuelve a empezar." },
        ],
        steps: [
          { title: "Pon el tempo", body: "Lo bastante lento para tocar el pasaje limpio y sin tensión." },
          { title: "Pulsa Empezar", body: "En el ordenador, la barra espaciadora. Te da un compás de entrada y los tiempos se encienden a medida que suenan." },
          { title: "Activa la subida de tempo", body: "Con un toque en su tarjeta. Marca tu objetivo y deja que suba unos pocos BPM cada pocos compases." },
        ],
        faq: [
          { q: "¿A qué tempo tengo que practicar?", a: "Al más rápido al que el pasaje te salga limpio y sin tensión. Si te agarrotas o fallas notas, vas demasiado rápido: baja diez y vuelve a subir." },
          { q: "¿Cómo funciona una subida de tempo?", a: "Sube el tempo un pequeño paso cada cierto número de compases, y así pasas de cómodo a rápido sin parar a tocar nada. Los pasos pequeños funcionan mejor: de dos a cinco BPM." },
          { q: "¿Sigue sonando si cambio de pestaña?", a: "Sí. Mantiene el tempo con la pestaña en segundo plano y, mientras suena, no deja que la pantalla se apague." },
        ],
      },
      backing: {
        slug: "backing-tracks",
        metaTitle: "Backing tracks de guitarra con su tonalidad y la escala que tocar · Diesis",
        description: "Backing tracks para improvisar con la guitarra: blues, rock, metal, funk, jazz, flamenco y más. Cada base dice su tonalidad y una escala que encaja, y la abre en el mástil.",
        h1: "Bases que te dicen qué tocar.",
        lede: "Pon una base y toca encima. Cada una dice su tonalidad y una escala que encaja, y con un toque la ves dibujada en el mástil.",
        cta: "Abrir las backing tracks",
        points: [
          { title: "Diez estilos", body: "Blues, rock, metal, funk, jazz y bossa, modal, flamenco, country, baladas y neo-soul." },
          { title: "Tonalidad y escala en cada base", body: "No tienes que sacar la tonalidad de oído antes de empezar. La base la dice, junto con una escala que funciona encima." },
          { title: "De la base al mástil", body: "«Ver en el mástil» abre esa escala sobre esa tónica, por todo el mástil." },
          { title: "Bases de quienes las hicieron", body: "Los vídeos son de sus autores, en YouTube, y cada uno lleva su nombre. El reproductor solo se carga cuando le das al play." },
        ],
        steps: [
          { title: "Elige un estilo", body: "Filtra las bases por estilo." },
          { title: "Dale al play", body: "Empieza la base; su tonalidad y su escala están en la tarjeta." },
          { title: "Abre la escala", body: "Con un toque la ves en el mástil. Empieza por la tónica y tira de ahí." },
        ],
        faq: [
          { q: "¿Qué escala toco sobre una backing track?", a: "La que pone en la tarjeta. Como regla general, sobre una base en tonalidad menor la pentatónica menor de esa misma tónica funciona siempre, y sobre una en mayor, la pentatónica mayor." },
          { q: "¿Las bases son de Diesis?", a: "No. Son vídeos de YouTube de los músicos que las hicieron, con su nombre en cada tarjeta. Diesis pone la tonalidad, la escala y el enlace al mástil." },
        ],
      },
      fingers: {
        slug: "independencia-de-dedos",
        metaTitle: "Ejercicio de independencia de dedos para guitarra, medido al milisegundo · Diesis",
        description: "Un ejercicio de independencia de dedos para guitarristas: cuatro botones, uno por dedo, y notas que caen sobre ellos al ritmo de un metrónomo. Mira a cuántos milisegundos del clic cae cada dedo.",
        h1: "Que cada dedo vaya por su cuenta, y a tiempo.",
        lede: "Cuatro botones, uno por dedo. Las notas caen sobre ellos al ritmo de un metrónomo: pulsa cada botón justo cuando le llega su nota y mira lo cerca del clic que has quedado.",
        cta: "Abrir independencia de dedos",
        points: [
          { title: "Medido en milisegundos", body: "Cada pulsación sale en verde o en rojo, con lo que te has adelantado o retrasado. Al final, tu media: por delante del clic, por detrás o clavado." },
          { title: "Órdenes que desenredan los dedos", body: "Al azar, 1234, 4321, 1324, 2413 o 1423, con 16, 32 o 64 notas." },
          { title: "Con cualquiera de las dos manos", body: "El móvil apoyado en la mesa y los dedos sobre los botones, o el teclado del ordenador: A S D F para la izquierda y J K L Ñ para la derecha." },
          { title: "Un récord que merece la pena", body: "Tu pasada limpia más rápida, con el 90 % de las notas a tiempo o más, guardada para cada orden y cada número de notas." },
        ],
        steps: [
          { title: "Pon un tempo lento", body: "60 BPM es un buen punto de partida." },
          { title: "Pulsa cada botón cuando le llegue su nota", body: "Un compás de entrada y, después, una nota por clic." },
          { title: "¿Limpia? Sube cinco", body: "Cuando una pasada te salga limpia, sube el tempo cinco BPM y repite." },
        ],
        faq: [
          { q: "¿Qué es la independencia de dedos?", a: "Poder mover un dedo sin que los demás se muevan con él. En la guitarra es lo que hace que el anular y el meñique caigan limpios y a tiempo." },
          { q: "¿Sustituye a practicar con la guitarra?", a: "No. Entrena el ritmo y el control lejos del mástil. Después llévate esos mismos órdenes a la guitarra, un dedo por traste y con el metrónomo." },
          { q: "¿Puedo usar auriculares inalámbricos?", a: "Mejor no. El Bluetooth retrasa el clic y tus pulsaciones saldrán tarde. Usa el altavoz o unos auriculares con cable." },
        ],
      },
      strings: {
        slug: "cuerdas",
        metaTitle: "Calculadora de tensión de cuerdas de guitarra y guía de ajuste · Diesis",
        description: "Calcula la tensión de cada cuerda con tu afinación y tu tiro, encuentra un juego equilibrado y consulta las medidas de ajuste para tu tipo de guitarra: altura, curvatura, pastillas y octavación.",
        h1: "Las cuerdas que le van a tu afinación, y las medidas para ajustarla.",
        lede: "Mira cuánta tensión lleva cada cuerda en tu guitarra y con tu afinación. Carga un juego habitual o deja que Diesis calcule uno equilibrado, y después sigue los pasos de ajuste tras el cambio de cuerdas.",
        cta: "Abrir cuerdas y ajuste",
        points: [
          { title: "La tensión de cada cuerda", body: "Calculada con tus calibres, tu afinación y tu tiro; se desvía como mucho un 5 % de las tablas de los fabricantes. Verde es cómoda; ámbar, floja; rojo, dura." },
          { title: "Un juego equilibrado, calculado", body: "Elige un juego habitual o pide uno equilibrado para tu afinación. También te dice juegos reales con esos calibres." },
          { title: "Medidas de ajuste para tu guitarra", body: "Altura de cuerdas, curvatura del mástil, radio del diapasón y altura de pastillas para once tipos de guitarra: de las tipo Strat y Les Paul a las de ocho cuerdas, acústicas y clásicas." },
          { title: "Qué hacer después de cambiar cuerdas", body: "Estirar, curvatura, altura, pastillas y octavación, en el orden que funciona. Los pasos cambian en acústicas y clásicas." },
        ],
        steps: [
          { title: "Elige tu tipo de guitarra", body: "Fija el tiro; cámbialo si el de la tuya es distinto." },
          { title: "Pon cuerdas y afinación", body: "Seis, siete u ocho, con la afinación en la que tocas." },
          { title: "Lee las barras", body: "Prueba juegos hasta que todas las cuerdas estén en verde y después sigue los pasos de ajuste." },
        ],
        faq: [
          { q: "¿Qué calibre necesito para una afinación más grave?", a: "Uno más grueso. Si bajas la afinación, el mismo juego se queda flojo: trastea y se nota blando. Pon tu afinación y sube de calibre hasta que las barras estén en verde, o deja que Diesis te calcule un juego equilibrado." },
          { q: "¿Qué tensión es buena?", a: "Diesis marca cada cuerda como floja, equilibrada o dura. Lo que más importa es que todas se parezcan entre sí, para que ninguna se note blanda al lado de las demás." },
          { q: "¿Hay que ajustar la guitarra al cambiar de calibre?", a: "Casi siempre. Unas cuerdas más gruesas tiran más del mástil, así que revisa primero la curvatura, después la altura y por último la octavación. Diesis te da los pasos en ese orden." },
        ],
      },
    },
  },
  notFound: { title: "Esta página no existe.", body: "Puede que la dirección esté mal escrita o que la página se haya movido.", home: "Ir a Diesis" },
  footer: { tagline: "Todo lo que necesitas para dominar la guitarra.", made: "Hecho en Cáceres. «Diesis» es semitono en griego: un traste.", affiliate: "En calidad de Afiliado de Amazon, obtengo ingresos por las compras adscritas que cumplen los requisitos aplicables." },
  home: {
    title: "Aprender, practicar, ajustar",
    h1: "¿Qué quieres hacer hoy?",
    lede: "Con la guitarra encima y, si es un móvil, en horizontal.",
    about: "Sobre Diesis",
    start: "Empezar",
    next: "Próximamente",
    later: "Más adelante",
    learn: "Ejercicios que te enseñan la guitarra: primero todas las notas del mástil, luego las escalas y la lectura de partituras.",
    practice: "Las herramientas con las que tocas: el mástil con la escala que quieras, un metrónomo que te va subiendo la velocidad, backing tracks y un ejercicio de independencia de dedos.",
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
      { title: "Independencia de dedos", body: "Cuatro botones, uno por dedo, y notas que caen sobre ellos al ritmo de un clic. Para que cada dedo vaya por su cuenta, y a tiempo." },
    ],
  },
  setupMenu: {
    title: "Ajuste",
    lede: "Cuida la guitarra en sí: cuerdas, tensión y ajuste.",
    modes: [
      { title: "Cuerdas y ajuste", body: "La tensión de cada cuerda, los calibres que le van a tu guitarra y tu afinación, y las medidas de ajuste para tu tipo de guitarra." },
      { title: "Afinador y octavación", body: "Afina con el micrófono en la afinación de tu guitarra. Después tocas cada cuerda al aire y en el traste 12, y te dice hacia dónde mover la selleta y cuánto." },
      { title: "Mis guitarras", body: "Más de una guitarra, cada una con su tipo, tiro, afinación, cuerdas y el último ajuste que le hiciste. Eliges la que tienes en las manos y todo Diesis la usa." },
      { title: "Cambio de afinación", body: "¿Pasas de estándar a drop C? Qué le pasa a la tensión de cada cuerda, si tu juego sigue valiendo y qué revisar después: el alma y la octavación." },
      { title: "¿Por qué trastea?", body: "Eliges lo que te pasa (trastea en los primeros trastes, trastea arriba del mástil, desafina al subir, una cuerda se engancha en la cejuela) y te dice la causa probable y en qué orden arreglarlo." },
      { title: "Registro de cuerdas", body: "Cuándo cambiaste las cuerdas y qué juego pusiste. Diesis sabe cuánto practicas, así que te avisa cuando toca cambiarlas." },
      { title: "Cuidado y humedad", body: "Limpiar el diapasón (aceite en palosanto y ébano, nunca en arce), los trastes, la humedad en acústicas y clásicas (45–55 %), los viajes y los cambios de estación." },
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
    practiceCard: "Sin reloj y sin final.",
    streakCard: "Hasta el primer fallo.",
    noScore: "No se guarda marca",
    noBest: "Aún sin marca",
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
    meterHint: "Cuántos tiempos tiene cada compás.",
    accentFirst: "Acentuar el primer tiempo",
    accentHint: "Un clic más agudo en el uno.",
    subdivision: "Subdivisión",
    subHint: "Cómo se reparte cada tiempo: clics más suaves entre uno y el siguiente.",
    subNone: "Ninguna",
    subOne: "Un clic por tiempo",
    perBeat: "{n} por tiempo",
    noteValues: { eighth: "Corcheas", sixteenth: "Semicorcheas", thirtySecond: "Fusas", triplet: "Tresillos", sextuplet: "Seisillos" },
    off: "Apagada",
    done: "Listo",
    start: "Empezar",
    stop: "Parar",
    pause: "Pausa",
    resume: "Seguir",
    paused: "En pausa",
    countIn: "Compás de entrada",
    speedSettings: "Ajustes de la subida de tempo",
    tapTempo: "Tap tempo",
    slower: "Más lento",
    faster: "Más rápido",
    keys: "Teclado: espacio para empezar o parar, ← → cambian el tempo (con Mayús, de 5 en 5), T para marcarlo.",
  },
  fingers: {
    title: "Independencia de dedos",
    lede: "Cuatro botones, uno por dedo. Las notas van cayendo por la columna de cada botón al ritmo del metrónomo: pulsa el botón justo cuando su nota llega a él, en el clic. Con el móvil apoyado en la mesa y los dedos encima, o con el teclado en el ordenador.",
    tempo: "Tempo",
    pattern: "Orden",
    random: "Al azar",
    notes: "Notas",
    hand: "Mano",
    left: "Izquierda",
    right: "Derecha",
    fingerNames: ["Índice", "Medio", "Anular", "Meñique"],
    start: "Empezar",
    stop: "Parar",
    again: "Otra vez",
    change: "Cambiar ajustes",
    ready: "Prepárate",
    howTo: "Pulsa cada botón cuando le llegue su nota.",
    progress: "{k} de {n}",
    onTimeNow: "{g} a tiempo",
    verdict: { good: "{ms} ms", early: "{ms} ms antes", late: "{ms} ms tarde", wrong: "Dedo equivocado", missed: "Se te pasó" },
    result: "{p} % a tiempo",
    resultSub: "{g} de {n} notas a tiempo, a {bpm} BPM.",
    lean: { early: "De media vas {ms} ms por delante del clic.", late: "De media vas {ms} ms por detrás del clic.", on: "De media, clavado en el clic." },
    spread: "Distancia media al clic: {ms} ms.",
    mistakes: "Dedo equivocado: {w}. Sin tocar: {m}.",
    best: "Tu pasada limpia más rápida: {bpm} BPM",
    noBest: "Aún no tienes una pasada limpia con este orden y estas notas. Cuenta como limpia a partir del 90 % a tiempo.",
    newBest: "Récord: tu pasada limpia más rápida.",
    tip: "Empieza despacio. Cuando te salga limpia, sube cinco.",
    keysLeft: "Teclas: A S D F, del meñique al índice. Espacio empieza y para.",
    keysRight: "Teclas: J K L Ñ, del índice al meñique. Espacio empieza y para.",
    semicolonKey: "Ñ",
  },
  profile: {
    title: "Perfil",
    guitar: "Tu guitarra",
    guitarLede: "Los ejercicios y el mástil dibujan y suenan con esta guitarra: sus cuerdas y las notas que dan.",
    strings: "Cuerdas",
    tuning: "Afinación",
    tunings: { standard6: "Estándar", dropD: "Drop D", eFlat: "Mi♭ estándar", dStandard: "Re estándar", dropC: "Drop C", dadgad: "DADGAD", openG: "Sol abierta", openD: "Re abierta", bStandard: "Si estándar (barítona)", dropA: "Drop A (barítona)", standard7: "Estándar (Si grave)", eFlat7: "Mi♭ estándar (Si♭ grave)", dStandard7: "Re estándar (La grave)", dropA7: "Drop A", dropG7: "Drop G", dropFs7: "Drop F♯", standard8: "Estándar (Fa♯ grave)", eFlat8: "Mi♭ estándar (Fa grave)", dStandard8: "Re estándar (Mi grave)", dropE8: "Drop E" },
    names: "Nombres de las notas",
    namesLede: "Cómo se escriben las notas en los botones y en el mástil, en toda la app.",
    language: "Idioma",
    records: "Récords",
    recordsEmpty: "Aún no hay récords. Prueba Nombra la nota o Encuentra la nota contrarreloj o sin fallos y aquí aparecerán tus mejores marcas.",
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
    dataBody: "Todo lo de esta página, y tu diario de práctica, se guarda solo en este navegador: no hay cuenta y no se envía nada. Borrarlo no tiene vuelta atrás.",
    erase: "Borrar mis datos",
    eraseConfirm: "¿Borrar tus récords, logros, ajustes y tu diario de práctica de este navegador?",
  },
  log: {
    title: "Diario de práctica",
    tab: "Diario",
    blurb: "Ponte un objetivo con fecha y apunta cada día lo que has hecho para llegar. La semana de un vistazo, una página por día, y todo se queda en tu navegador.",
    week: "Semana {n}",
    today: "Hoy",
    prev: "Semana anterior",
    next: "Semana siguiente",
    days: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
    hasEntry: "con algo apuntado",
    goalDay: "la fecha de tu objetivo",
    setGoal: "Ponte un objetivo",
    setGoalSub: "Una pieza, un solo, una fecha para tenerlo listo",
    left: "quedan {n} días",
    leftOne: "queda 1 día",
    dueToday: "es hoy",
    overdue: "la fecha ya pasó",
    editGoal: "Cambiar tu objetivo",
    goalTitle: "Tu objetivo",
    goalName: "¿Qué quieres conseguir?",
    goalNameHint: "El solo para el concierto",
    goalDate: "¿Para cuándo?",
    quick: ["En 1 semana", "En 2 semanas", "En un mes"],
    fromToday: "Dentro de {n} días · {date}",
    tomorrow: "Mañana · {date}",
    onToday: "Hoy · {date}",
    pickDate: "Elige una fecha, o una de las tres de arriba.",
    errors: { name: "Ponle nombre al objetivo.", date: "Elige para qué fecha lo quieres tener.", past: "Elige una fecha de hoy en adelante." },
    save: "Guardar objetivo",
    remove: "Quitar el objetivo",
    close: "Cerrar",
    askToday: "¿Qué has hecho hoy?",
    askPast: "¿Qué hiciste este día?",
    dictate: "Escríbelo, o díctalo con el micrófono del teclado.",
    future: "Todavía no ha llegado.",
    stays: "Se queda en este navegador",
    saved: "Guardado en este navegador",
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
    step: "Cuánto sube",
    every: "Cada",
    bar: "1 compás",
    bars: "{n} compases",
    atTarget: "Al llegar",
    hold: "Mantener",
    restart: "Volver a empezar",
    barOf: "Compás {b} de {e}",
    reached: "En el objetivo",
    eta: "Llega a {to} en {time} aprox.",
    keys: "Teclado: espacio para empezar, pausar o seguir, Esc para parar, ← → cambian el tempo de inicio (con Mayús, de 5 en 5).",
  },
  settings: { challenge: "Reto", time: "Tiempo", notes: "Notas", all: "Todas", naturals: "Solo naturales", names: "Nombres", solfege: "Do Re Mi", letters: "C D E" },
  consent: {
    text: "Diesis cuenta las visitas y qué herramientas se usan, con Google Analytics y PostHog, solo si tú lo permites. Sin anuncios y sin vender nada.",
    accept: "Permitir",
    decline: "No, gracias",
    more: "Privacidad",
  },
  privacy: {
    eyebrow: "Privacidad",
    h1: "Política de privacidad",
    updated: "Última actualización: 1 de octubre de 2026",
    summary: "Diesis no tiene cuentas ni publicidad. Lo que eliges, consigues y apuntas en Diesis se queda en tu navegador. Lo único que se mide son las visitas: qué páginas y herramientas se abren, con Google Analytics y PostHog, y solo si tú lo permites.",
    sections: [
      { h: "La app", p: ["Diesis funciona por completo en tu navegador. No te pregunta quién eres, no crea ninguna cuenta y no envía tus respuestas, tus marcas ni tus ajustes a nadie, ni a mí ni a terceros.", "La puntuación de cada sesión se guarda en memoria y desaparece al cerrar la pestaña. Todo lo demás que eliges o consigues se queda en el almacenamiento local de tu navegador, solo en tu dispositivo: tu guitarra (cuerdas y afinación), cómo se nombran las notas, tus mejores marcas y el último reto que elegiste, los ajustes del metrónomo (con el plan de subida de tempo), los ajustes del ejercicio de dedos y tus pasadas limpias más rápidas, lo último que elegiste en el mástil, tu tipo de guitarra, tiro y calibres de cuerda, y tu diario de práctica (tu objetivo y lo que apuntas cada día). Nada de eso se envía nunca a ningún sitio. El botón «Borrar mis datos» de tu perfil lo elimina, y también borrar los datos de la web."] },
      { h: "Cookies", p: ["Diesis guarda dos cookies: una recuerda el idioma que has elegido y la otra, lo que respondiste al aviso de analítica. Ninguna contiene datos sobre ti."] },
      { h: "Esta web", p: ["diesis.app está alojada en Vercel, que conserva durante poco tiempo los registros habituales de cualquier servidor (dirección IP, navegador, páginas solicitadas) para que el servicio funcione y esté protegido.", "Si lo permites en el aviso, la web carga Google Analytics 4 y PostHog para contar visitas y ver qué páginas y herramientas se abren, durante cuánto tiempo, lo rápido que cargan y desde qué tipo de dispositivo. Google instala sus propias cookies para ello; PostHog guarda un identificador aleatorio en el almacenamiento local de tu navegador, no graba tu pantalla ni tus clics y conserva sus datos en la Unión Europea. Cada uno trata los datos según su propia política de privacidad. Si dices que no, no se carga nada de Google ni de PostHog; puedes cambiar de opinión borrando las cookies de la web."] },
      { h: "Backing tracks", p: ["La página de backing tracks muestra miniaturas que sirve YouTube (i.ytimg.com), así que YouTube ve tu dirección IP al cargarla. El reproductor viene de youtube-nocookie.com y solo se carga cuando pulsas play en una base; a partir de ahí, a ese vídeo se le aplica la política de privacidad de YouTube. Diesis no le envía a YouTube nada sobre ti."] },
      { h: "Enlaces a Amazon", p: ["Algunas páginas enlazan a búsquedas en Amazon.es con mi identificador de afiliado, para que Amazon sepa que la visita viene de Diesis. No se carga nada de Amazon hasta que haces clic, y Diesis no le envía nada sobre ti; una vez en Amazon, se aplican su política de privacidad y sus cookies. En calidad de Afiliado de Amazon, obtengo ingresos por las compras adscritas que cumplen los requisitos aplicables."] },
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
