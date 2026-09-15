export type Lang = 'en' | 'es';

export const PLAY_URL = 'https://play.diesis.app';
export const CONTACT = 'hello@diesis.app';

export interface Strings {
  code: Lang;
  htmlLang: string;
  otherLang: Lang;
  otherLabel: string;
  base: string; // '' for en, '/es' for es
  meta: { title: string; description: string; privacyTitle: string; privacyDescription: string };
  nav: { how: string; modes: string; name: string; pricing: string; faq: string; cta: string; privacy: string };
  footer: { tagline: string; made: string; trademarks: string };
  hero: { eyebrow: string; h1: string; lede: string; cta: string; secondary: string; trust: string[] };
  how: { eyebrow: string; h2: string; lede: string; steps: { h: string; p: string }[] };
  modes: { eyebrow: string; h2: string; lede: string; now: string; next: string; later: string; items: { title: string; body: string; when: 'now' | 'next' | 'later' }[] };
  name: { eyebrow: string; h2: string; p: string[] };
  pricing: { eyebrow: string; h2: string; price: string; sub: string; list: string[]; iosTitle: string; ios: string; cta: string };
  faq: { eyebrow: string; h2: string; items: { q: string; a: string }[] };
  closing: { h2: string; lede: string; cta: string };
  screen: { title: string; score: string; feedback: string; hearAgain: string };
  privacy: {
    eyebrow: string; h1: string; updated: string; summary: string;
    sections: { h: string; p: string[]; list?: string[] }[];
    contactHeading: string; contact: string;
  };
}

const en: Strings = {
  code: 'en',
  htmlLang: 'en',
  otherLang: 'es',
  otherLabel: 'ES',
  base: '',
  meta: {
    title: 'Diesis — learn every note on the guitar neck',
    description: 'A spot lights up on the fretboard and you hear it. Name it. Diesis is a guitar fretboard trainer that works like a game. Play free in the browser; iPhone app coming.',
    privacyTitle: 'Diesis — privacy policy',
    privacyDescription: 'What Diesis does with your data. Short version: nothing. No account, no tracking, nothing leaves your device.',
  },
  nav: { how: 'How it works', modes: 'Modes', name: 'The name', pricing: 'Pricing', faq: 'FAQ', cta: 'Play now', privacy: 'Privacy' },
  footer: {
    tagline: 'Guitar notes and scales, as games.',
    made: 'Made in Cáceres, Spain. "Diesis" is Greek for the semitone: one fret.',
    trademarks: 'Apple, iPhone and App Store are trademarks of Apple Inc. Other product names belong to their owners.',
  },
  hero: {
    eyebrow: 'Guitar fretboard trainer',
    h1: 'Know every note on the neck.',
    lede: 'A spot lights up on the fretboard and you hear it. Tap its name. Right turns green and moves on; wrong stays until you get it. A few minutes a day with the guitar on your lap, and the neck stops being a mystery.',
    cta: 'Play in the browser',
    secondary: 'How it works',
    trust: ['Free', 'No account', 'Phone or laptop, held sideways'],
  },
  how: {
    eyebrow: 'How it works',
    h2: 'See the note. Name it. Know at once.',
    lede: 'One thing at a time, the way a teacher would do it across the table. Nothing to set up.',
    steps: [
      { h: 'A position lights up', p: 'One spot on the neck turns amber and the note plays. Frets 0 to 12, all six strings, every one of the twelve notes.' },
      { h: 'Tap the name', p: 'Twelve buttons along the bottom, C to B, sharps written as ♯. Big enough to hit without looking down.' },
      { h: 'Green or red, then the next one', p: 'Right: the spot turns green with the name written on it and the next note lights a moment later. Wrong: the button flashes red and the same note waits for you.' },
    ],
  },
  modes: {
    eyebrow: 'Modes',
    h2: 'Notes first. Scales next.',
    lede: 'Diesis grows in the order a player learns: first the notes, then where each note lives, then the shapes built from them.',
    now: 'Playable now',
    next: 'Coming next',
    later: 'Later',
    items: [
      { title: 'Name the note', body: 'A position lights, you say which note it is. The one you can play today.', when: 'now' },
      { title: 'Find the note', body: 'You get a name. Tap every place it lives within the fret range, until you have them all.', when: 'next' },
      { title: 'Hear the note', body: 'A note plays with nothing lit. Tap a place on the neck where it could be.', when: 'next' },
      { title: 'Settings and challenges', body: 'Fret range, naturals only, one string at a time, timed rounds, note-count rounds, personal bests.', when: 'next' },
      { title: 'Scales', body: 'Light any scale on the whole neck, build it yourself, name it from its shape, name the degree. Major and its modes, pentatonics, blues, the minors.', when: 'later' },
      { title: 'Skins and sounds', body: 'Nylon or electric sound, and other fretboards to play on.', when: 'later' },
    ],
  },
  name: {
    eyebrow: 'The name',
    h2: 'δίεσις',
    p: [
      'Diesis is the old Greek word for the smallest step in the scale: the semitone. On a guitar that is one fret. In Italian and Spanish the same word still means the sharp sign, ♯.',
      'That is the whole idea of the app. Learn the neck one fret at a time, and the rest follows.',
    ],
  },
  pricing: {
    eyebrow: 'Pricing',
    h2: 'Free to play.',
    price: 'Free',
    sub: 'The browser version costs nothing and asks for nothing.',
    list: ['Every mode that exists', 'No account, no sign-up', 'Works on a phone or a laptop', 'No ads'],
    iosTitle: 'iPhone app',
    ios: 'The same game, on the App Store, with sound that works even with the ringer switched off. Extra fretboards will be small one-off purchases. Coming.',
    cta: 'Play in the browser',
  },
  faq: {
    eyebrow: 'FAQ',
    h2: 'Questions',
    items: [
      { q: 'Why does it ask me to turn my phone?', a: 'The neck is long and thin, so Diesis only plays sideways. Turn the phone and the board fills the screen with the twelve buttons under it. On a laptop it just works.' },
      { q: 'Is there sound?', a: 'Yes. Tap once to start (browsers require it) and each position plays as it lights. "Hear again" repeats it. The sound is a synthesised nylon pluck for now; recordings of a real guitar will replace it.' },
      { q: 'Sharps or flats?', a: 'Sharps, written as ♯. F♯ and G♭ are the same place on the neck, and the game never asks which spelling you prefer. A flats setting is planned.' },
      { q: 'Which frets?', a: 'Frets 0 to 12 on all six strings, standard tuning. A range picker (say, frets 5 to 9 only) is one of the next things to arrive.' },
      { q: 'Left-handed?', a: 'Not yet. The board is drawn the way chord books draw it, nut on the left, high E on top. A mirrored board is on the list.' },
      { q: 'Does it keep my scores?', a: 'The header counts right and wrong for the session, and that is all. Personal bests and stats come with the challenge modes, stored on your device, no account.' },
      { q: 'When is the iPhone app out?', a: 'When it is ready. The browser version is the same code, so what you play at play.diesis.app is what the app will be.' },
    ],
  },
  closing: {
    h2: 'Guitar on your lap?',
    lede: 'Turn the phone sideways and play a round. It takes a minute.',
    cta: 'Play in the browser',
  },
  screen: { title: 'Diesis', score: '7 right · 1 wrong', feedback: 'Correct', hearAgain: 'Hear again' },
  privacy: {
    eyebrow: 'Privacy',
    h1: 'Privacy policy',
    updated: 'Last updated 15 September 2026',
    summary: 'Diesis collects nothing. There is no account, no analytics, no advertising, and nothing you do in the game leaves your device.',
    sections: [
      {
        h: 'The game',
        p: [
          'Diesis runs entirely on your device, whether that is the browser version at play.diesis.app or the iPhone app. It does not ask who you are, does not create an account, and does not send anything to us or to anyone else.',
          'Scores for the current session are held in memory and disappear when you close it. When settings and personal bests arrive, they will be stored on your device only.',
        ],
      },
      {
        h: 'This website',
        p: [
          'diesis.app and play.diesis.app are hosted by Vercel, which keeps standard server logs (IP address, browser, pages requested) for a short time to run the service and keep it safe. We do not add analytics, tracking pixels or advertising, and the site sets no cookies.',
        ],
      },
      {
        h: 'The iPhone app',
        p: [
          'The app uses no third-party analytics or advertising kits. If you buy an extra fretboard, the purchase is handled by Apple through the App Store; we never see your payment details. Apple\'s own privacy policy applies to that transaction.',
        ],
      },
      {
        h: 'Children',
        p: ['Diesis collects no personal data from anyone, of any age.'],
      },
      {
        h: 'Changes',
        p: ['If this policy changes, the new version is published here with a new date. It will never quietly start collecting data.'],
      },
    ],
    contactHeading: 'Contact',
    contact: 'Questions about privacy, or about Diesis in general:',
  },
};

const es: Strings = {
  code: 'es',
  htmlLang: 'es',
  otherLang: 'en',
  otherLabel: 'EN',
  base: '/es',
  meta: {
    title: 'Diesis — aprende todas las notas del mástil',
    description: 'Se ilumina un punto en el diapasón y lo oyes. Di qué nota es. Diesis es un entrenador del mástil de la guitarra que funciona como un juego. Gratis en el navegador; app para iPhone en camino.',
    privacyTitle: 'Diesis — política de privacidad',
    privacyDescription: 'Qué hace Diesis con tus datos. Versión corta: nada. Sin cuenta, sin rastreo, nada sale de tu dispositivo.',
  },
  nav: { how: 'Cómo funciona', modes: 'Modos', name: 'El nombre', pricing: 'Precio', faq: 'Preguntas', cta: 'Jugar', privacy: 'Privacidad' },
  footer: {
    tagline: 'Notas y escalas de guitarra, como un juego.',
    made: 'Hecho en Cáceres. «Diesis» es el semitono en griego: un traste.',
    trademarks: 'Apple, iPhone y App Store son marcas de Apple Inc. Los demás nombres pertenecen a sus dueños.',
  },
  hero: {
    eyebrow: 'Entrenador del mástil de guitarra',
    h1: 'Sabe qué nota hay en cada traste.',
    lede: 'Se ilumina un punto en el diapasón y lo oyes. Toca su nombre. Si aciertas se pone verde y pasa a la siguiente; si fallas, la nota se queda hasta que la sacas. Unos minutos al día con la guitarra encima y el mástil deja de ser un misterio.',
    cta: 'Jugar en el navegador',
    secondary: 'Cómo funciona',
    trust: ['Gratis', 'Sin cuenta', 'Móvil o portátil, en horizontal'],
  },
  how: {
    eyebrow: 'Cómo funciona',
    h2: 'Ves la nota. La nombras. Lo sabes al momento.',
    lede: 'Una cosa cada vez, como lo haría un profesor sentado enfrente. Nada que configurar.',
    steps: [
      { h: 'Se ilumina una posición', p: 'Un punto del mástil se pone ámbar y suena la nota. Trastes del 0 al 12, las seis cuerdas, las doce notas.' },
      { h: 'Toca el nombre', p: 'Doce botones abajo, de C a B, con los sostenidos escritos como ♯. Lo bastante grandes para acertar sin mirar.' },
      { h: 'Verde o rojo, y la siguiente', p: 'Acierto: el punto se pone verde con el nombre escrito encima y al momento se ilumina la siguiente nota. Fallo: el botón parpadea en rojo y la misma nota te espera.' },
    ],
  },
  modes: {
    eyebrow: 'Modos',
    h2: 'Primero las notas. Después las escalas.',
    lede: 'Diesis crece en el orden en que se aprende: primero las notas, luego dónde vive cada una, y por último las formas que se construyen con ellas.',
    now: 'Ya se puede jugar',
    next: 'Lo siguiente',
    later: 'Más adelante',
    items: [
      { title: 'Nombra la nota', body: 'Se ilumina una posición y dices qué nota es. El modo que puedes jugar hoy.', when: 'now' },
      { title: 'Encuentra la nota', body: 'Te dan un nombre. Toca todos los sitios donde vive dentro del rango de trastes, hasta tenerlos todos.', when: 'next' },
      { title: 'Escucha la nota', body: 'Suena una nota sin nada iluminado. Toca un sitio del mástil donde podría estar.', when: 'next' },
      { title: 'Ajustes y retos', body: 'Rango de trastes, solo naturales, una cuerda cada vez, rondas a tiempo, rondas por número de notas, mejores marcas.', when: 'next' },
      { title: 'Escalas', body: 'Ilumina cualquier escala en todo el mástil, constrúyela tú, reconócela por su forma, di el grado. Mayor y sus modos, pentatónicas, blues, las menores.', when: 'later' },
      { title: 'Diapasones y sonidos', body: 'Sonido de nailon o eléctrica, y otros diapasones donde jugar.', when: 'later' },
    ],
  },
  name: {
    eyebrow: 'El nombre',
    h2: 'δίεσις',
    p: [
      'Diesis es la palabra griega antigua para el paso más pequeño de la escala: el semitono. En una guitarra, un traste. En italiano y en castellano la misma palabra sigue nombrando el sostenido, ♯.',
      'Esa es toda la idea de la app. Aprende el mástil traste a traste y el resto viene solo.',
    ],
  },
  pricing: {
    eyebrow: 'Precio',
    h2: 'Gratis.',
    price: 'Gratis',
    sub: 'La versión para navegador no cuesta nada y no pide nada.',
    list: ['Todos los modos que existen', 'Sin cuenta ni registro', 'Funciona en el móvil y en el portátil', 'Sin anuncios'],
    iosTitle: 'App para iPhone',
    ios: 'El mismo juego, en la App Store, con sonido aunque el móvil esté en silencio. Los diapasones extra serán pequeñas compras únicas. En camino.',
    cta: 'Jugar en el navegador',
  },
  faq: {
    eyebrow: 'Preguntas',
    h2: 'Preguntas frecuentes',
    items: [
      { q: '¿Por qué me pide girar el móvil?', a: 'El mástil es largo y estrecho, así que Diesis solo se juega en horizontal. Gira el móvil y el diapasón llena la pantalla con los doce botones debajo. En un portátil funciona sin más.' },
      { q: '¿Tiene sonido?', a: 'Sí. Toca una vez para empezar (lo exige el navegador) y cada posición suena al iluminarse. «Oír otra vez» la repite. De momento es una cuerda de nailon sintetizada; la sustituirán grabaciones de una guitarra real.' },
      { q: '¿Sostenidos o bemoles?', a: 'Sostenidos, escritos como ♯. Fa♯ y Sol♭ son el mismo sitio del mástil, y el juego nunca pregunta cómo prefieres escribirlo. Está previsto un ajuste para bemoles.' },
      { q: '¿Qué trastes?', a: 'Del 0 al 12 en las seis cuerdas, afinación estándar. Un selector de rango (por ejemplo, solo del 5 al 9) es de lo próximo que llegará.' },
      { q: '¿Para zurdos?', a: 'Todavía no. El diapasón se dibuja como en los libros de acordes: cejuela a la izquierda, Mi agudo arriba. Un diapasón en espejo está en la lista.' },
      { q: '¿Guarda mis puntuaciones?', a: 'La cabecera cuenta aciertos y fallos de la sesión, y nada más. Las mejores marcas y estadísticas llegarán con los modos de reto, guardadas en tu dispositivo, sin cuenta.' },
      { q: '¿Cuándo sale la app para iPhone?', a: 'Cuando esté lista. La versión para navegador es el mismo código, así que lo que juegas en play.diesis.app es lo que será la app.' },
    ],
  },
  closing: {
    h2: '¿Tienes la guitarra a mano?',
    lede: 'Gira el móvil y juega una ronda. Tarda un minuto.',
    cta: 'Jugar en el navegador',
  },
  screen: { title: 'Diesis', score: '7 aciertos · 1 fallo', feedback: 'Correcto', hearAgain: 'Oír otra vez' },
  privacy: {
    eyebrow: 'Privacidad',
    h1: 'Política de privacidad',
    updated: 'Última actualización: 15 de septiembre de 2026',
    summary: 'Diesis no recoge nada. No hay cuenta, ni analítica, ni publicidad, y nada de lo que haces en el juego sale de tu dispositivo.',
    sections: [
      {
        h: 'El juego',
        p: [
          'Diesis funciona por completo en tu dispositivo, tanto la versión para navegador en play.diesis.app como la app para iPhone. No pregunta quién eres, no crea ninguna cuenta y no envía nada ni a nosotros ni a nadie.',
          'Las puntuaciones de la sesión se guardan en memoria y desaparecen al cerrar. Cuando lleguen los ajustes y las mejores marcas, se guardarán solo en tu dispositivo.',
        ],
      },
      {
        h: 'Esta web',
        p: [
          'diesis.app y play.diesis.app están alojadas en Vercel, que conserva durante poco tiempo los registros habituales del servidor (dirección IP, navegador, páginas pedidas) para operar el servicio y protegerlo. No añadimos analítica, píxeles de seguimiento ni publicidad, y la web no usa cookies.',
        ],
      },
      {
        h: 'La app para iPhone',
        p: [
          'La app no usa kits de analítica ni de publicidad de terceros. Si compras un diapasón extra, la compra la gestiona Apple a través de la App Store; nunca vemos tus datos de pago. A esa operación se le aplica la política de privacidad de Apple.',
        ],
      },
      {
        h: 'Menores',
        p: ['Diesis no recoge datos personales de nadie, de ninguna edad.'],
      },
      {
        h: 'Cambios',
        p: ['Si esta política cambia, la nueva versión se publica aquí con fecha nueva. Nunca empezará a recoger datos sin avisar.'],
      },
    ],
    contactHeading: 'Contacto',
    contact: 'Dudas sobre privacidad, o sobre Diesis en general:',
  },
};

export const strings: Record<Lang, Strings> = { en, es };

export function switchPath(t: Strings, pathname: string): string {
  const stripped = pathname.replace(/\.html$/, '').replace(/^\/es(?=\/|$)/, '') || '/';
  const other = strings[t.otherLang];
  const path = other.base + (stripped === '/' ? '' : stripped);
  return path === '' ? '/' : path;
}
