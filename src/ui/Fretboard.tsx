import React, { useMemo } from 'react';
import Svg, { Circle, G, Line, Rect, Text as SvgText } from 'react-native-svg';
import type { Position } from '../core/notes';
import { STRING_COUNT } from '../core/notes';
import { board, type as typeStyle } from './theme';

export type HighlightState = 'asking' | 'correct';

export interface FretboardProps {
  width: number;
  height: number;
  minFret: number;
  maxFret: number;
  highlight: Position | null;
  highlightState: HighlightState;
  /** Note name drawn inside the highlight once answered. */
  highlightLabel?: string;
}

/** Distance of fret n from the nut on a neck of scale length 1 (equal temperament). */
function fretDistance(n: number): number {
  return 1 - Math.pow(2, -n / 12);
}

/**
 * The neck, drawn with the nut on the left and string 1 (high E) at the top. Fret spacing is the
 * real logarithmic one, scaled so the selected range fills the width. Fret 0 (open string) gets a
 * short zone left of the nut so an open-string question has somewhere to light.
 */
export function Fretboard({
  width,
  height,
  minFret,
  maxFret,
  highlight,
  highlightState,
  highlightLabel,
}: FretboardProps) {
  const layout = useMemo(() => {
    const numbersBand = 18;
    const boardTop = 6;
    const boardBottom = height - numbersBand;
    const boardHeight = boardBottom - boardTop;
    const stringInset = boardHeight * 0.12;
    const stringGap = (boardHeight - stringInset * 2) / (STRING_COUNT - 1);

    const showsOpen = minFret === 0;
    const openZone = showsOpen ? Math.max(36, width * 0.06) : 0;
    const firstDrawnFret = Math.max(minFret - 1, 0); // left boundary line of the first cell
    const left = openZone;
    const right = width - 4;
    const span = fretDistance(maxFret) - fretDistance(firstDrawnFret);
    const scale = (right - left) / span;

    const fretX = (n: number) => left + (fretDistance(n) - fretDistance(firstDrawnFret)) * scale;
    const cellCenter = (n: number) =>
      n === 0 ? openZone / 2 : (fretX(n - 1) + fretX(n)) / 2;
    const stringY = (s: number) => boardTop + stringInset + (s - 1) * stringGap;

    return { boardTop, boardBottom, boardHeight, left, right, showsOpen, fretX, cellCenter, stringY, stringGap, numbersBand, firstDrawnFret };
  }, [width, height, minFret, maxFret]);

  const fretsToDraw: number[] = [];
  for (let n = Math.max(layout.firstDrawnFret, 1); n <= maxFret; n++) fretsToDraw.push(n);
  const cells: number[] = [];
  for (let n = Math.max(minFret, 1); n <= maxFret; n++) cells.push(n);

  const highlightR = Math.min(layout.stringGap * 0.46, 22);

  return (
    <Svg width={width} height={height}>
      {/* wood */}
      <Rect
        x={layout.left}
        y={layout.boardTop}
        width={layout.right - layout.left}
        height={layout.boardHeight}
        fill={board.wood}
        stroke={board.woodEdge}
        strokeWidth={2}
        rx={3}
      />

      {/* inlays */}
      {cells
        .filter((n) => board.inlayFrets.includes(n as never))
        .map((n) => {
          const cx = layout.cellCenter(n);
          const r = Math.min(layout.stringGap * 0.28, 9);
          if (board.doubleInlayFrets.includes(n as never)) {
            const y1 = (layout.stringY(2) + layout.stringY(3)) / 2;
            const y2 = (layout.stringY(4) + layout.stringY(5)) / 2;
            return (
              <G key={`inlay-${n}`}>
                <Circle cx={cx} cy={y1} r={r} fill={board.inlay} opacity={0.9} />
                <Circle cx={cx} cy={y2} r={r} fill={board.inlay} opacity={0.9} />
              </G>
            );
          }
          const cy = (layout.stringY(3) + layout.stringY(4)) / 2;
          return <Circle key={`inlay-${n}`} cx={cx} cy={cy} r={r} fill={board.inlay} opacity={0.9} />;
        })}

      {/* nut or the left edge fret */}
      {layout.showsOpen ? (
        <Rect
          x={layout.left - 3}
          y={layout.boardTop - 2}
          width={7}
          height={layout.boardHeight + 4}
          fill={board.nut}
          rx={1.5}
        />
      ) : null}

      {/* frets */}
      {fretsToDraw.map((n) => {
        const x = layout.fretX(n);
        return (
          <G key={`fret-${n}`}>
            <Line x1={x + 1} y1={layout.boardTop} x2={x + 1} y2={layout.boardBottom} stroke={board.fretShadow} strokeWidth={2} />
            <Line x1={x} y1={layout.boardTop} x2={x} y2={layout.boardBottom} stroke={board.fret} strokeWidth={2.5} />
          </G>
        );
      })}

      {/* strings, string 1 (high E) at the top */}
      {Array.from({ length: STRING_COUNT }, (_, i) => i + 1).map((s) => {
        const y = layout.stringY(s);
        const gauge = board.stringGauges[s - 1];
        return (
          <G key={`string-${s}`}>
            <Line x1={0} y1={y + gauge * 0.6} x2={width} y2={y + gauge * 0.6} stroke={board.stringShadow} strokeWidth={gauge} />
            <Line x1={0} y1={y} x2={width} y2={y} stroke={board.string} strokeWidth={gauge} />
          </G>
        );
      })}

      {/* fret numbers */}
      {cells.map((n) => (
        <SvgText
          key={`num-${n}`}
          x={layout.cellCenter(n)}
          y={height - 4}
          fontSize={typeStyle.fretNumber.fontSize}
          fill={board.fretNumber}
          textAnchor="middle"
        >
          {n}
        </SvgText>
      ))}

      {/* the lit position */}
      {highlight ? (
        <G>
          <Circle
            cx={layout.cellCenter(highlight.fret)}
            cy={layout.stringY(highlight.string)}
            r={highlightR + 4}
            fill="none"
            stroke={highlightState === 'correct' ? board.highlightCorrect : board.highlight}
            strokeWidth={2}
            opacity={0.55}
          />
          <Circle
            cx={layout.cellCenter(highlight.fret)}
            cy={layout.stringY(highlight.string)}
            r={highlightR}
            fill={highlightState === 'correct' ? board.highlightCorrect : board.highlight}
          />
          {highlightLabel ? (
            <SvgText
              x={layout.cellCenter(highlight.fret)}
              y={layout.stringY(highlight.string) + 5}
              fontSize={14}
              fontWeight="700"
              fill={board.highlightInk}
              textAnchor="middle"
            >
              {highlightLabel}
            </SvgText>
          ) : null}
        </G>
      ) : null}
    </Svg>
  );
}
