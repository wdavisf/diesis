/**
 * All UI copy, English and Spanish. Edit both languages together. The landing and privacy
 * pages live at `/` and `/es`; the mode picker and game read the `diesis_lang` cookie,
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
  pricing: { eyebrow: string; h2: string; price: string; sub: string; list: string[]; contactTitle: string; contact: string; contactAfter: string };
  faq: { eyebrow: string; h2: string; items: { q: string; a: string }[] };
  closing: { h2: string; lede: string };
  screen: { score: string; feedback: string; hearAgain: string; aria: string };
  footer: { tagline: string; made: string };
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
    /** The twelve pitch classes from C, sharps as ♯. Letters in English, solfège in Spanish. */
    noteNames: string[];
  };
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
    title: "Diesis — know every note on the guitar neck",
    description:
      "A spot lights up on the guitar neck and you hear it. Name it. Diesis teaches the fretboard, then scales, then reading music, as games you play with the guitar on your lap.",
    privacyTitle: "Privacy",
    privacyDescription: "What Diesis does with your data: no account, no ads, nothing from the game leaves your browser. Visit counting with Google Analytics only if you allow it.",
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
    sub: "The browser version costs nothing and asks for nothing. Open it and play.",
    list: ["Every mode that exists", "No account, no sign-up", "Phone or laptop", "No ads"],
    contactTitle: "Say what you play",
    contact: "Diesis is being built in the open with a handful of players. Write to",
    contactAfter: "and say what you play, or what you would like to see next. Extra fretboards and sounds may become small one-off purchases later; the game itself stays free.",
  },
  faq: {
    eyebrow: "FAQ",
    h2: "Questions",
    items: [
      { q: "Do I need an account?", a: "No. Open the app and play. Scores live in your browser and nowhere else." },
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
    noteNames: ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"],
  },
  consent: {
    text: "Diesis uses Google Analytics to count visits, only if you say yes. No ads, nothing sold.",
    accept: "Allow",
    decline: "No thanks",
    more: "Privacy",
  },
  privacy: {
    eyebrow: "Privacy",
    h1: "Privacy policy",
    updated: "Last updated 23 September 2026",
    summary: "Diesis has no account and no advertising. Nothing you do in the game leaves your browser. The only thing we measure is visits to the site, with Google Analytics, and only if you allow it.",
    sections: [
      { h: "The game", p: ["Diesis runs entirely in your browser. It does not ask who you are, does not create an account, and does not send anything you do in the game to us or to anyone else.", "Scores for the current session are held in memory and disappear when you close the tab. When settings and personal bests arrive, they will be stored in your browser only."] },
      { h: "Cookies", p: ["Diesis sets two cookies. One remembers the language you picked; the other remembers your answer to the analytics banner. Neither holds anything about you."] },
      { h: "This website", p: ["diesis.app is hosted by Vercel, which keeps standard server logs (IP address, browser, pages requested) for a short time to run the service and keep it safe.", "If you allow it in the banner, the site loads Google Analytics 4 to count visits and see which pages are read. Google sets its own cookies for that and processes the data under its own privacy policy. If you decline, nothing from Google is loaded, and you can change your mind by clearing the site's cookies."] },
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
    title: "Diesis — aprende todas las notas del mástil de la guitarra",
    description:
      "Se ilumina un punto en el mástil y suena la nota. Tú dices cuál es. Diesis enseña el mástil de la guitarra, después las escalas y después a leer partituras, en forma de juego y con la guitarra encima.",
    privacyTitle: "Privacidad",
    privacyDescription: "Qué hace Diesis con tus datos: sin cuenta, sin anuncios y sin que nada del juego salga de tu navegador. Contamos visitas con Google Analytics solo si tú lo permites.",
  },
  nav: { how: "Cómo funciona", learn: "Qué aprendes", faq: "Preguntas", cta: "Jugar", privacy: "Privacidad", about: "Sobre Diesis" },
  hero: {
    eyebrow: "El mástil de la guitarra, como un juego",
    h1: "Aprende todas las notas del mástil.",
    lede: "Se ilumina un punto en el mástil y suena la nota. Tú dices cuál es. Si aciertas, se pone en verde y pasa a la siguiente; si fallas, se queda ahí hasta que la saques. Unos minutos al día con la guitarra encima y el mástil deja de ser un misterio. Después llegan las escalas y la lectura de partituras, en el mismo mástil.",
    cta: "Jugar ahora",
    secondary: "Cómo funciona",
    trust: ["Gratis durante la beta", "Sin registro", "En el navegador, móvil u ordenador"],
  },
  how: {
    eyebrow: "Cómo funciona",
    h2: "Ves la nota. Dices cuál es. Sabes al instante si has acertado.",
    lede: "De una en una, como haría un profesor sentado enfrente. No hay nada que configurar.",
    steps: [
      { title: "Se ilumina una posición", body: "Un punto del mástil se enciende en ámbar y suena la nota. Del traste 0 al 12, las seis cuerdas, las doce notas." },
      { title: "Di cuál es", body: "Doce botones en la parte de abajo, de Do a Si, con los sostenidos escritos como ♯. En el ordenador basta con pulsar la tecla de la nota." },
      { title: "Verde o rojo, y a por la siguiente", body: "Si aciertas, el punto se pone verde con el nombre encima y enseguida se enciende la siguiente nota. Si fallas, el botón parpadea en rojo y la nota se queda esperando." },
    ],
  },
  learn: {
    eyebrow: "Qué aprendes",
    h2: "Primero las notas. Luego las escalas. Luego la partitura.",
    lede: "Diesis sigue el orden en que se aprende de verdad: primero dónde está cada nota, después las formas que se construyen con ellas y, por último, leerlas en una partitura, para quien quiera llegar a la guitarra clásica.",
    when: { now: "Ya disponible", next: "Próximamente", later: "Más adelante" },
    tracks: [
      {
        title: "Notas",
        lede: "Dónde está cada nota del mástil, hasta que no tengas que pensarlo.",
        items: [
          { title: "Nombra la nota", body: "Se ilumina una posición y tú dices qué nota es. El modo que ya puedes jugar.", when: "now" },
          { title: "Encuentra la nota", body: "Te dan una nota y tienes que tocarla en todos los sitios del mástil donde esté, dentro del rango de trastes que hayas elegido.", when: "next" },
          { title: "Escucha la nota", body: "Suena una nota sin que se ilumine nada. Tócala en algún sitio del mástil donde pueda estar.", when: "next" },
          { title: "Ajustes y retos", body: "Rango de trastes, solo notas naturales, una cuerda cada vez, rondas contrarreloj, rondas de un número fijo de notas y mejores marcas.", when: "next" },
        ],
      },
      {
        title: "Escalas",
        lede: "Cualquier escala a lo largo de todo el mástil, y después las posiciones.",
        items: [
          { title: "Explora una escala", body: "Elige tónica y escala y verás todas sus notas iluminadas, con la tónica en otro color. Para estudiar, no para jugar.", when: "later" },
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
    sub: "La versión web no cuesta nada y no pide nada. Entras y juegas.",
    list: ["Todos los modos disponibles", "Sin cuenta ni registro", "Móvil u ordenador", "Sin anuncios"],
    contactTitle: "Cuéntanos qué tocas",
    contact: "Diesis se está construyendo con un grupo pequeño de guitarristas. Escribe a",
    contactAfter: "y cuéntanos qué tocas o qué te gustaría que llegara antes. Más adelante puede que los mástiles y sonidos extra sean pequeñas compras únicas; el juego seguirá siendo gratis.",
  },
  faq: {
    eyebrow: "Preguntas",
    h2: "Preguntas frecuentes",
    items: [
      { q: "¿Hace falta registrarse?", a: "No. Entras y juegas. Las puntuaciones se quedan en tu navegador y no salen de ahí." },
      { q: "¿Tiene sonido?", a: "Sí. Toca una vez para empezar (el navegador lo exige) y cada posición suena al iluminarse. «Oír otra vez» la repite. De momento el sonido es una cuerda de nailon sintetizada; más adelante lo sustituirán grabaciones de una guitarra de verdad." },
      { q: "¿Sostenidos o bemoles?", a: "Sostenidos, escritos con ♯. Fa♯ y Sol♭ están en el mismo sitio del mástil, y el juego nunca te pregunta cómo prefieres escribirlo. Un ajuste para bemoles está previsto." },
      { q: "¿Qué trastes entran?", a: "Del 0 al 12 en las seis cuerdas, con afinación estándar. Poder elegir un rango (por ejemplo, solo del 5 al 9) es de lo próximo que llegará." },
      { q: "¿Móvil u ordenador?", a: "Los dos, desde el navegador. El mástil es largo y estrecho, así que en el móvil Diesis te pide que lo pongas en horizontal. En el ordenador ocupa toda la ventana y puedes responder con el teclado." },
      { q: "¿Y si soy zurdo?", a: "Todavía no hay opción. El mástil se dibuja como en los libros de acordes: cejuela a la izquierda y la cuerda aguda arriba. Un mástil en espejo está en la lista." },
      { q: "¿Habrá app para el móvil?", a: "Primero la versión web, que ya funciona en el móvil. Si la pide bastante gente, haremos una app nativa." },
    ],
  },
  closing: { h2: "¿Tienes la guitarra a mano?", lede: "Échate una ronda. Un minuto y listo." },
  screen: { score: "7 aciertos · 1 fallo", feedback: "¡Correcto!", hearAgain: "Oír otra vez", aria: "Pantalla del juego: una posición iluminada en el mástil y doce botones con los nombres de las notas" },
  footer: { tagline: "Notas, escalas y lectura para guitarra, en forma de juego.", made: "Hecho en Cáceres. «Diesis» es semitono en griego: un traste." },
  home: {
    title: "Jugar",
    h1: "Elige un modo",
    lede: "Con la guitarra encima y, si es un móvil, en horizontal.",
    about: "Sobre Diesis",
    play: "Jugar",
    next: "Próximamente",
    later: "Más adelante",
    modes: [
      { title: "Nombra la nota", body: "Se ilumina una posición y suena. Di qué nota es." },
      { title: "Encuentra la nota", body: "Te dan una nota. Tócala en todos los sitios donde esté." },
      { title: "Escucha la nota", body: "Suena una nota sin iluminar nada. Encuéntrala en el mástil." },
      { title: "Escalas", body: "Explóralas, constrúyelas, reconócelas y di el grado." },
      { title: "Leer partituras", body: "De la nota en el pentagrama a la posición en el mástil." },
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
    rotate: "Pon el móvil en horizontal",
    rotateSub: "Diesis se juega apaisado, como el mástil de una guitarra.",
    board: "Mástil de guitarra",
    notes: "Nombres de las notas",
    noteNames: ["Do", "Do♯", "Re", "Re♯", "Mi", "Fa", "Fa♯", "Sol", "Sol♯", "La", "La♯", "Si"],
  },
  consent: {
    text: "Diesis usa Google Analytics para contar visitas, solo si tú lo permites. Sin anuncios y sin vender nada.",
    accept: "Permitir",
    decline: "No, gracias",
    more: "Privacidad",
  },
  privacy: {
    eyebrow: "Privacidad",
    h1: "Política de privacidad",
    updated: "Última actualización: 23 de septiembre de 2026",
    summary: "Diesis no tiene cuentas ni publicidad. Nada de lo que haces en el juego sale de tu navegador. Lo único que medimos son las visitas a la web, con Google Analytics, y solo si tú lo permites.",
    sections: [
      { h: "El juego", p: ["Diesis funciona por completo en tu navegador. No te pregunta quién eres, no crea ninguna cuenta y no envía nada de lo que haces a nadie, ni a nosotros ni a terceros.", "Las puntuaciones de cada sesión se guardan en memoria y desaparecen al cerrar la pestaña. Cuando lleguen los ajustes y las mejores marcas, se guardarán solo en tu navegador."] },
      { h: "Cookies", p: ["Diesis guarda dos cookies: una recuerda el idioma que has elegido y la otra, lo que respondiste al aviso de analítica. Ninguna contiene datos sobre ti."] },
      { h: "Esta web", p: ["diesis.app está alojada en Vercel, que conserva durante poco tiempo los registros habituales de cualquier servidor (dirección IP, navegador, páginas solicitadas) para que el servicio funcione y esté protegido.", "Si lo permites en el aviso, la web carga Google Analytics 4 para contar visitas y ver qué páginas se leen. Google instala sus propias cookies para ello y trata los datos según su política de privacidad. Si dices que no, no se carga nada de Google; puedes cambiar de opinión borrando las cookies de la web."] },
      { h: "Menores", p: ["Diesis no recoge datos personales de nadie, tenga la edad que tenga."] },
      { h: "Cambios", p: ["Si esta política cambia, la nueva versión se publicará aquí con su fecha. Nunca empezará a recoger datos sin avisar."] },
    ],
    contactHeading: "Contacto",
    contact: "Para cualquier duda sobre privacidad, o sobre Diesis en general:",
  },
};

export const strings: Record<Lang, Strings> = { en, es };

export function isLang(x: unknown): x is Lang {
  return x === "en" || x === "es";
}
