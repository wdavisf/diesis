/* The game screen, drawn in SVG with the same geometry as components/fretboard.tsx: nut on the
   left, high E on top, real logarithmic fret spacing, open strings in a short zone left of the nut.
   One SVG so it scales with its container. The loop itself is CSS in app/globals.css (.screen). */

const W = 640;
const H = 300;
const header = 34;
const boardH = 156;
const feedbackH = 34;
const panelH = 44;
const pad = 12;
const boardTop = header + 4;
const numbersBand = 18;
const boardBottom = boardTop + boardH - numbersBand;
const boardInnerH = boardBottom - boardTop;
const STRINGS = 6;
const MAX_FRET = 12;
const stringInset = boardInnerH * 0.12;
const stringGap = (boardInnerH - stringInset * 2) / (STRINGS - 1);
const openZone = 36;
const left = pad + openZone;
const right = W - pad - 4;
const fretDistance = (n: number) => 1 - Math.pow(2, -n / 12);
const scale = (right - left) / fretDistance(MAX_FRET);
const fretX = (n: number) => left + fretDistance(n) * scale;
const cellCenter = (n: number) => (n === 0 ? pad + openZone / 2 : (fretX(n - 1) + fretX(n)) / 2);
const stringY = (s: number) => boardTop + stringInset + (s - 1) * stringGap;
const frets = Array.from({ length: MAX_FRET }, (_, i) => i + 1);
const gauges = [1.2, 1.5, 1.9, 2.4, 3.0, 3.6];
const inlays = [3, 5, 7, 9, 12];
const r = Math.min(stringGap * 0.46, 22);

const notes = ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"];
const gap = 6;
const btnW = (W - pad * 2 - gap * 11) / 12;
const btnY = H - pad - panelH;
const feedbackY = boardTop + boardH + feedbackH / 2;

const q1 = { s: 2, f: 8, name: "G" };
const q2 = { s: 5, f: 3, name: "C" };

export function Screen({ className }: { className?: string }) {
  return (
    <svg
      className={`screen h-auto w-full ${className ?? ""}`}
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label="Game screen: one lit position on the fretboard and twelve note-name buttons"
    >
      <rect width={W} height={H} rx="22" fill="#14120f" stroke="#3a352d" strokeWidth="2" />
      <text x={pad + 4} y="24" fontSize="15" fontWeight="600" fill="#f3efe6">Diesis</text>
      <text x={W - pad - 4} y="24" fontSize="12" fill="#a39c8e" textAnchor="end">7 right · 1 wrong</text>

      <rect x={left} y={boardTop} width={right - left} height={boardInnerH} fill="#5a3a2b" stroke="#3d271c" strokeWidth="2" rx="3" />

      {inlays.map((n) => {
        const cx = cellCenter(n);
        const ir = Math.min(stringGap * 0.28, 9);
        if (n === 12) {
          return (
            <g key={n}>
              <circle cx={cx} cy={(stringY(2) + stringY(3)) / 2} r={ir} fill="#e8e2d3" opacity="0.9" />
              <circle cx={cx} cy={(stringY(4) + stringY(5)) / 2} r={ir} fill="#e8e2d3" opacity="0.9" />
            </g>
          );
        }
        return <circle key={n} cx={cx} cy={(stringY(3) + stringY(4)) / 2} r={ir} fill="#e8e2d3" opacity="0.9" />;
      })}

      <rect x={left - 3} y={boardTop - 2} width="7" height={boardInnerH + 4} fill="#e9e2cf" rx="1.5" />

      {frets.map((n) => (
        <g key={n}>
          <line x1={fretX(n) + 1} y1={boardTop} x2={fretX(n) + 1} y2={boardBottom} stroke="#7d7a72" strokeWidth="2" />
          <line x1={fretX(n)} y1={boardTop} x2={fretX(n)} y2={boardBottom} stroke="#c9c6bd" strokeWidth="2.5" />
        </g>
      ))}

      {gauges.map((g, i) => (
        <g key={i}>
          <line x1={pad} y1={stringY(i + 1) + g * 0.6} x2={W - pad} y2={stringY(i + 1) + g * 0.6} stroke="#6b6558" strokeWidth={g} />
          <line x1={pad} y1={stringY(i + 1)} x2={W - pad} y2={stringY(i + 1)} stroke="#d8d4c8" strokeWidth={g} />
        </g>
      ))}

      {frets.map((n) => (
        <text key={n} x={cellCenter(n)} y={boardTop + boardH - 4} fontSize="11" fill="#a39c8e" textAnchor="middle">{n}</text>
      ))}

      <g className="q q1-ask">
        <circle cx={cellCenter(q1.f)} cy={stringY(q1.s)} r={r} fill="#e0a63a" stroke="#f0c46a" strokeWidth="2" />
      </g>
      <g className="q q1-ok">
        <circle cx={cellCenter(q1.f)} cy={stringY(q1.s)} r={r} fill="#4caf6b" />
        <text x={cellCenter(q1.f)} y={stringY(q1.s) + 5} fontSize="14" fontWeight="700" fill="#14120f" textAnchor="middle">{q1.name}</text>
      </g>
      <g className="q q2-ask">
        <circle cx={cellCenter(q2.f)} cy={stringY(q2.s)} r={r} fill="#e0a63a" stroke="#f0c46a" strokeWidth="2" />
      </g>
      <g className="q q2-ok">
        <circle cx={cellCenter(q2.f)} cy={stringY(q2.s)} r={r} fill="#4caf6b" />
        <text x={cellCenter(q2.f)} y={stringY(q2.s) + 5} fontSize="14" fontWeight="700" fill="#14120f" textAnchor="middle">{q2.name}</text>
      </g>

      <text className="q fb" x={W / 2} y={feedbackY + 6} fontSize="16" fontWeight="600" fill="#4caf6b" textAnchor="middle">Correct</text>
      <text x={W - pad - 4} y={feedbackY + 5} fontSize="12" fill="#f0c46a" textAnchor="end">Hear again</text>

      {notes.map((n, i) => {
        const x = pad + i * (btnW + gap);
        const cls = n === q1.name ? "q q1-ok" : n === q2.name ? "q q2-ok" : "";
        return (
          <g key={n}>
            <rect x={x} y={btnY} width={btnW} height={panelH} rx="8" fill="#23201b" stroke="#3a352d" />
            {cls ? <rect className={cls} x={x} y={btnY} width={btnW} height={panelH} rx="8" fill="#4caf6b" /> : null}
            <text x={x + btnW / 2} y={btnY + panelH / 2 + 6} fontSize="17" fontWeight="600" fill="#f3efe6" textAnchor="middle">{n}</text>
          </g>
        );
      })}
    </svg>
  );
}
