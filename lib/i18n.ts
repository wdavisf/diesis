/**
 * All UI copy, English and Spanish. Edit both languages together. The landing and privacy
 * pages live at `/` and `/es`; the login, mode picker and game read the `diesis_lang` cookie,
 * which the switcher sets through `/lang/[code]`.
 */
export type Lang = "en" | "es";
export const LANGS: Lang[] = ["en", "es"];
export const LANG_COOKIE = "diesis_lang";

export type When = "now" | "next" | "later";

export interface Strings {
  code: Lang;
  base: string; // "" for en, "/es" for es
  otherLang: Lang;
  otherLabel: string;
  otherName: string;
  meta: { title: string; description: string; privacyTitle: string; privacyDescription: string };
  nav: { how: string; learn: string; faq: string; cta: string; privacy: string; about: string };
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
  pricing: { eyebrow: string; h2: string; price: string; sub: string; list: string[]; codeTitle: string; code: string; codeAfter: string };
  faq: { eyebrow: string; h2: string; items: { q: string; a: string }[] };
  closing: { h2: string; lede: string };
  screen: { score: string; feedback: string; hearAgain: string; aria: string };
  footer: { tagline: string; made: string };
  login: { h1: string; lede: string; label: string; button: string; checking: string; wrong: string; noCode: string; ask: string; back: string };
  home: { title: string; h1: string; lede: string; about: string; play: string; next: string; later: string; modes: { title: string; body: string }[] };
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
  };
  privacy: { eyebrow: string; h1: string; updated: string; summary: string; sections: { h: string; p: string[] }[]; contactHeading: string; contact: string };
}

const en: Strings = {
  code: "en",
  base: "",
  otherLang: "es",
  otherLabel: "ES",
  otherName: "Español",
  meta: {
    title: "Diesis — know every note on the guitar neck",
    description:
      "A spot lights up on the guitar neck and you hear it. Name it. Diesis teaches the fretboard, then scales, then reading music, as games you play with the guitar on your lap.",
    privacyTitle: "Privacy",
    privacyDescription: "What Diesis does with your data. Short version: nothing. No account, no analytics, nothing leaves your browser.",
  },
  nav: { how: "How it works", learn: "What you learn", faq: "FAQ", cta: "Open the app", privacy: "Privacy", about: "About Diesis" },
  hero: {
    eyebrow: "Guitar fretboard trainer",
    h1: "Know every note on the neck.",
    lede: "A spot lights up on the fretboard and you hear it. Name it. Right turns green and moves on; wrong stays until you get it. A few minutes a day with the guitar on your lap, and the neck stops being a mystery. Scales and reading music follow, on the same neck.",
    cta: "Open the app",
    secondary: "How it works",
    trust: ["Free in preview", "No account", "Phone or laptop, in the browser"],
  },
  how: {
    eyebrow: "How it works",
    h2: "See the note. Name it. Know at once.",
    lede: "One thing at a time, the way a teacher would do it across the table. Nothing to set up.",
    steps: [
      { title: "A position lights up", body: "One spot on the neck turns amber and the note plays. Frets 0 to 12, all six strings, every one of the twelve notes." },
      { title: "Name it", body: "Twelve buttons along the bottom, C to B, sharps written as ♯. On a laptop, just press the letter." },
      { title: "Green or red, then the next one", body: "Right: the spot turns green with the name written on it and the next note lights a moment later. Wrong: the button flashes red and the same note waits for you." },
    ],
  },
  learn: {
    eyebrow: "What you learn",
    h2: "Notes first. Then scales. Then the page.",
    lede: "Diesis grows in the order a player learns: first where the notes are, then the shapes built from them, then reading them off a score, for anyone heading toward classical guitar.",
    when: { now: "Playable now", next: "Coming next", later: "Later" },
    tracks: [
      {
        title: "Notes",
        lede: "Where every note lives on the neck, until you stop having to think about it.",
        items: [
          { title: "Name the note", body: "A position lights, you say which note it is. The one you can play today.", when: "now" },
          { title: "Find the note", body: "You get a name. Tap every place it lives within the fret range, until you have them all.", when: "next" },
          { title: "Hear the note", body: "A note plays with nothing lit. Tap a place on the neck where it could be.", when: "next" },
          { title: "Settings and challenges", body: "Fret range, naturals only, one string at a time, timed rounds, note-count rounds, personal bests.", when: "next" },
        ],
      },
      {
        title: "Scales",
        lede: "Any scale on the whole neck, then the shapes inside it.",
        items: [
          { title: "Explore a scale", body: "Pick a root and a scale and see every position lit, the root in its own color. The study screen, not a quiz.", when: "later" },
          { title: "Build the scale", body: "Given a root and a scale name, tap every note of it within the range. Same game as Find the note, bigger target.", when: "later" },
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
    sub: "The browser version costs nothing and asks for nothing but an access code.",
    list: ["Every mode that exists", "No account, no sign-up", "Phone or laptop", "No ads, no tracking"],
    codeTitle: "Need a code?",
    code: "Diesis is being built in the open with a handful of players. Write to",
    codeAfter: "and say what you play. Extra fretboards and sounds may become small one-off purchases later; the game itself stays free.",
  },
  faq: {
    eyebrow: "FAQ",
    h2: "Questions",
    items: [
      { q: "Do I need an account?", a: "Not yet. Diesis is in private preview: you get an access code, type it once, and the browser remembers it. Scores live in your browser and nowhere else." },
      { q: "Is there sound?", a: "Yes. Tap once to start (browsers require it) and each position plays as it lights. “Hear again” repeats it. The sound is a synthesised nylon pluck for now; recordings of a real guitar will replace it." },
      { q: "Sharps or flats?", a: "Sharps, written as ♯. F♯ and G♭ are the same place on the neck, and the game never asks which spelling you prefer. A flats setting is planned." },
      { q: "Which frets?", a: "Frets 0 to 12 on all six strings, standard tuning. A range picker (say, frets 5 to 9 only) is one of the next things to arrive." },
      { q: "Phone or laptop?", a: "Either, in a browser. The neck is long and thin, so on a phone Diesis asks you to turn it sideways. On a laptop it fills the window and the letter keys pick the note." },
      { q: "Left-handed?", a: "Not yet. The board is drawn the way chord books draw it, nut on the left, high E on top. A mirrored board is on the list." },
      { q: "Will there be a mobile app?", a: "The web version comes first and works on a phone today. A native app comes if enough people want one." },
    ],
  },
  closing: { h2: "Guitar on your lap?", lede: "Play a round. It takes a minute." },
  screen: { score: "7 right · 1 wrong", feedback: "Correct", hearAgain: "Hear again", aria: "Game screen: one lit position on the fretboard and twelve note-name buttons" },
  footer: { tagline: "Guitar notes, scales and reading, as games.", made: "Made in Cáceres, Spain. “Diesis” is Greek for the semitone: one fret." },
  login: {
    h1: "Access code",
    lede: "Diesis is in private preview. Enter the code you were given and the browser will remember it.",
    label: "Code",
    button: "Open the app",
    checking: "Checking…",
    wrong: "That code is not right.",
    noCode: "No code yet?",
    ask: "Ask for one",
    back: "Back to diesis.app",
  },
  home: {
    title: "Play",
    h1: "Pick a mode",
    lede: "Guitar on your lap, screen sideways if it is a phone.",
    about: "About Diesis",
    play: "Play",
    next: "Coming next",
    later: "Later",
    modes: [
      { title: "Name the note", body: "A position lights and plays. Say which note it is." },
      { title: "Find the note", body: "You get a name. Tap every place it lives." },
      { title: "Hear the note", body: "A note plays with nothing lit. Find it on the neck." },
      { title: "Scales", body: "Explore, build, name the scale, name the degree." },
      { title: "Reading music", body: "The note on the staff, the place on the neck." },
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
    rotate: "Turn your phone sideways",
    rotateSub: "Diesis plays in landscape, like a guitar neck.",
    board: "Guitar fretboard",
    notes: "Note names",
  },
  privacy: {
    eyebrow: "Privacy",
    h1: "Privacy policy",
    updated: "Last updated 23 September 2026",
    summary: "Diesis collects nothing. There is no account, no analytics, no advertising, and nothing you do in the game leaves your browser.",
    sections: [
      { h: "The game", p: ["Diesis runs entirely in your browser. It does not ask who you are, does not create an account, and does not send anything you do in the game to us or to anyone else.", "Scores for the current session are held in memory and disappear when you close the tab. When settings and personal bests arrive, they will be stored in your browser only."] },
      { h: "Cookies", p: ["While Diesis is in private preview, the app sits behind an access code. Typing it sets one cookie in your browser so you are not asked again for six months. A second cookie remembers the language you picked. Neither holds anything about you."] },
      { h: "This website", p: ["diesis.app is hosted by Vercel, which keeps standard server logs (IP address, browser, pages requested) for a short time to run the service and keep it safe. We add no analytics, tracking pixels or advertising."] },
      { h: "Children", p: ["Diesis collects no personal data from anyone, of any age."] },
      { h: "Changes", p: ["If this policy changes, the new version is published here with a new date. It will never quietly start collecting data."] },
    ],
    contactHeading: "Contact",
    contact: "Questions about privacy, or about Diesis in general:",
  },
};

const es: Strings = {
  code: "es",
  base: "/es",
  otherLang: "en",
  otherLabel: "EN",
  otherName: "English",
  meta: {
    title: "Diesis — aprende todas las notas del mástil",
    description:
      "Se ilumina un punto en el mástil de la guitarra y lo oyes. Di qué nota es. Diesis enseña el diapasón, luego las escalas y luego a leer partituras, como juegos con la guitarra encima.",
    privacyTitle: "Privacidad",
    privacyDescription: "Qué hace Diesis con tus datos. Versión corta: nada. Sin cuenta, sin analítica, nada sale de tu navegador.",
  },
  nav: { how: "Cómo funciona", learn: "Qué aprendes", faq: "Preguntas", cta: "Abrir la app", privacy: "Privacidad", about: "Sobre Diesis" },
  hero: {
    eyebrow: "Entrenador del mástil de guitarra",
    h1: "Sabe qué nota hay en cada traste.",
    lede: "Se ilumina un punto en el diapasón y lo oyes. Di su nombre. Si aciertas se pone verde y pasa a la siguiente; si fallas, la nota se queda hasta que la sacas. Unos minutos al día con la guitarra encima y el mástil deja de ser un misterio. Después vienen las escalas y la lectura de partituras, en el mismo mástil.",
    cta: "Abrir la app",
    secondary: "Cómo funciona",
    trust: ["Gratis en la beta", "Sin cuenta", "Móvil o portátil, en el navegador"],
  },
  how: {
    eyebrow: "Cómo funciona",
    h2: "Ves la nota. La nombras. Lo sabes al momento.",
    lede: "Una cosa cada vez, como lo haría un profesor sentado enfrente. Nada que configurar.",
    steps: [
      { title: "Se ilumina una posición", body: "Un punto del mástil se pone ámbar y suena la nota. Trastes del 0 al 12, las seis cuerdas, las doce notas." },
      { title: "Di cuál es", body: "Doce botones abajo, de C a B, con los sostenidos escritos como ♯. En un portátil, basta con pulsar la letra." },
      { title: "Verde o rojo, y la siguiente", body: "Acierto: el punto se pone verde con el nombre escrito encima y al momento se ilumina la siguiente nota. Fallo: el botón parpadea en rojo y la misma nota te espera." },
    ],
  },
  learn: {
    eyebrow: "Qué aprendes",
    h2: "Primero las notas. Luego las escalas. Luego la partitura.",
    lede: "Diesis crece en el orden en que se aprende: primero dónde está cada nota, luego las formas que se construyen con ellas, y por último leerlas en una partitura, para quien va hacia la guitarra clásica.",
    when: { now: "Ya se puede jugar", next: "Lo siguiente", later: "Más adelante" },
    tracks: [
      {
        title: "Notas",
        lede: "Dónde vive cada nota en el mástil, hasta que dejes de tener que pensarlo.",
        items: [
          { title: "Nombra la nota", body: "Se ilumina una posición y dices qué nota es. El modo que puedes jugar hoy.", when: "now" },
          { title: "Encuentra la nota", body: "Te dan un nombre. Toca todos los sitios donde vive dentro del rango de trastes, hasta tenerlos todos.", when: "next" },
          { title: "Escucha la nota", body: "Suena una nota sin nada iluminado. Toca un sitio del mástil donde podría estar.", when: "next" },
          { title: "Ajustes y retos", body: "Rango de trastes, solo naturales, una cuerda cada vez, rondas a tiempo, rondas por número de notas, mejores marcas.", when: "next" },
        ],
      },
      {
        title: "Escalas",
        lede: "Cualquier escala en todo el mástil, y luego las formas que hay dentro.",
        items: [
          { title: "Explora una escala", body: "Elige tónica y escala y mira todas las posiciones iluminadas, la tónica con su propio color. La pantalla de estudio, no un juego.", when: "later" },
          { title: "Construye la escala", body: "Con una tónica y un nombre de escala, toca todas sus notas dentro del rango. El mismo juego que Encuentra la nota, con más objetivo.", when: "later" },
          { title: "Nombra la escala, nombra el grado", body: "Se ilumina una forma y dices qué escala o modo es. Se ilumina una nota dentro de una escala y dices qué grado es. Mayor y sus modos, pentatónicas, blues, las menores.", when: "later" },
        ],
      },
      {
        title: "Leer partituras",
        lede: "Para guitarra clásica: la nota en el pentagrama y el sitio en el mástil son lo mismo.",
        items: [
          { title: "Lee la nota", body: "Aparece una nota en el pentagrama en clave de sol. Nómbrala o encuéntrala en el mástil. Clave de guitarra, registro de guitarra, con líneas adicionales.", when: "later" },
          { title: "Lee la posición", body: "Se ilumina un punto del mástil y lo colocas en el pentagrama. El otro sentido, para que se fijen los dos.", when: "later" },
          { title: "Ritmo y práctica de lectura", body: "Pasajes cortos para leer con un clic, como cuando un profesor te pone una línea delante. Más adelante, cuando las notas estén firmes.", when: "later" },
        ],
      },
    ],
  },
  name: {
    eyebrow: "El nombre",
    p: [
      "Diesis es la palabra griega antigua para el paso más pequeño de la escala: el semitono. En una guitarra, un traste. En italiano y en castellano la misma palabra sigue nombrando el sostenido, ♯.",
      "Esa es toda la idea. Aprende el mástil traste a traste y el resto viene solo.",
    ],
  },
  pricing: {
    eyebrow: "Precio",
    h2: "Gratis mientras está en beta.",
    price: "Gratis",
    sub: "La versión para navegador no cuesta nada y solo pide un código de acceso.",
    list: ["Todos los modos que existen", "Sin cuenta ni registro", "Móvil o portátil", "Sin anuncios ni rastreo"],
    codeTitle: "¿Necesitas un código?",
    code: "Diesis se está construyendo con un puñado de guitarristas. Escribe a",
    codeAfter: "y cuenta qué tocas. Los diapasones y sonidos extra podrán ser pequeñas compras únicas más adelante; el juego en sí seguirá siendo gratis.",
  },
  faq: {
    eyebrow: "Preguntas",
    h2: "Preguntas frecuentes",
    items: [
      { q: "¿Hace falta una cuenta?", a: "Todavía no. Diesis está en beta privada: te dan un código de acceso, lo escribes una vez y el navegador lo recuerda. Las puntuaciones se quedan en tu navegador y en ningún otro sitio." },
      { q: "¿Tiene sonido?", a: "Sí. Toca una vez para empezar (lo exige el navegador) y cada posición suena al iluminarse. «Oír otra vez» la repite. De momento es una cuerda de nailon sintetizada; la sustituirán grabaciones de una guitarra real." },
      { q: "¿Sostenidos o bemoles?", a: "Sostenidos, escritos como ♯. F♯ y G♭ son el mismo sitio del mástil, y el juego nunca pregunta cómo prefieres escribirlo. Está previsto un ajuste para bemoles." },
      { q: "¿Qué trastes?", a: "Del 0 al 12 en las seis cuerdas, afinación estándar. Un selector de rango (por ejemplo, solo del 5 al 9) es de lo próximo que llegará." },
      { q: "¿Móvil o portátil?", a: "Cualquiera de los dos, en un navegador. El mástil es largo y estrecho, así que en el móvil Diesis te pide girarlo. En un portátil llena la ventana y las teclas de letras eligen la nota." },
      { q: "¿Para zurdos?", a: "Todavía no. El diapasón se dibuja como en los libros de acordes: cejuela a la izquierda, Mi agudo arriba. Un diapasón en espejo está en la lista." },
      { q: "¿Habrá app para el móvil?", a: "Primero la versión web, que ya funciona en el móvil. Una app nativa llegará si la pide suficiente gente." },
    ],
  },
  closing: { h2: "¿Tienes la guitarra a mano?", lede: "Juega una ronda. Tarda un minuto." },
  screen: { score: "7 aciertos · 1 fallo", feedback: "Correcto", hearAgain: "Oír otra vez", aria: "Pantalla del juego: un punto iluminado en el diapasón y doce botones con nombres de notas" },
  footer: { tagline: "Notas, escalas y lectura de guitarra, como juegos.", made: "Hecho en Cáceres. «Diesis» es el semitono en griego: un traste." },
  login: {
    h1: "Código de acceso",
    lede: "Diesis está en beta privada. Escribe el código que te han dado y el navegador lo recordará.",
    label: "Código",
    button: "Abrir la app",
    checking: "Comprobando…",
    wrong: "Ese código no es correcto.",
    noCode: "¿Sin código?",
    ask: "Pide uno",
    back: "Volver a diesis.app",
  },
  home: {
    title: "Jugar",
    h1: "Elige un modo",
    lede: "Guitarra encima, pantalla en horizontal si es un móvil.",
    about: "Sobre Diesis",
    play: "Jugar",
    next: "Lo siguiente",
    later: "Más adelante",
    modes: [
      { title: "Nombra la nota", body: "Se ilumina una posición y suena. Di qué nota es." },
      { title: "Encuentra la nota", body: "Te dan un nombre. Toca todos los sitios donde vive." },
      { title: "Escucha la nota", body: "Suena una nota sin nada iluminado. Encuéntrala en el mástil." },
      { title: "Escalas", body: "Explora, construye, nombra la escala, nombra el grado." },
      { title: "Leer partituras", body: "La nota en el pentagrama, el sitio en el mástil." },
    ],
  },
  game: {
    title: "Nombra la nota",
    back: "Modos",
    score: "{r} aciertos · {w} fallos",
    start: "Toca para empezar",
    startSub: "Se ilumina una nota y suena. Di cuál es.",
    loading: "Cargando…",
    correct: "Correcto",
    wrong: "Fallo",
    hearAgain: "Oír otra vez",
    keys: "Teclas: C D E F G A B eligen la nota, Mayús para ♯, espacio para oírla otra vez.",
    rotate: "Gira el móvil",
    rotateSub: "Diesis se juega en horizontal, como el mástil de una guitarra.",
    board: "Diapasón de guitarra",
    notes: "Nombres de las notas",
  },
  privacy: {
    eyebrow: "Privacidad",
    h1: "Política de privacidad",
    updated: "Última actualización: 23 de septiembre de 2026",
    summary: "Diesis no recoge nada. No hay cuenta, ni analítica, ni publicidad, y nada de lo que haces en el juego sale de tu navegador.",
    sections: [
      { h: "El juego", p: ["Diesis funciona por completo en tu navegador. No pregunta quién eres, no crea ninguna cuenta y no envía nada de lo que haces en el juego ni a nosotros ni a nadie.", "Las puntuaciones de la sesión se guardan en memoria y desaparecen al cerrar la pestaña. Cuando lleguen los ajustes y las mejores marcas, se guardarán solo en tu navegador."] },
      { h: "Cookies", p: ["Mientras Diesis está en beta privada, la app va detrás de un código de acceso. Al escribirlo se guarda una cookie en tu navegador para no volver a pedírtelo durante seis meses. Una segunda cookie recuerda el idioma que elegiste. Ninguna de las dos guarda nada sobre ti."] },
      { h: "Esta web", p: ["diesis.app está alojada en Vercel, que conserva durante poco tiempo los registros habituales del servidor (dirección IP, navegador, páginas pedidas) para operar el servicio y protegerlo. No añadimos analítica, píxeles de seguimiento ni publicidad."] },
      { h: "Menores", p: ["Diesis no recoge datos personales de nadie, de ninguna edad."] },
      { h: "Cambios", p: ["Si esta política cambia, la nueva versión se publica aquí con fecha nueva. Nunca empezará a recoger datos sin avisar."] },
    ],
    contactHeading: "Contacto",
    contact: "Dudas sobre privacidad, o sobre Diesis en general:",
  },
};

export const strings: Record<Lang, Strings> = { en, es };

export function isLang(x: unknown): x is Lang {
  return x === "en" || x === "es";
}
