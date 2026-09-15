import React, { useEffect, useMemo, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createNotePlayer } from '../audio/createNotePlayer';
import { noteName } from '../core/notes';
import { DEFAULT_SETTINGS } from '../core/quiz';
import { useModeA } from '../game/useModeA';
import { Fretboard } from './Fretboard';
import { NotePanel } from './NotePanel';
import { RotateGate } from './RotateGate';
import { color, radius, space, type as typeStyle } from './theme';

export function Game() {
  const { width, height } = useWindowDimensions();
  const player = useMemo(() => createNotePlayer(), []);
  useEffect(() => () => player.dispose(), [player]);
  const game = useModeA(DEFAULT_SETTINGS, player);
  const [boardSize, setBoardSize] = useState({ width: 0, height: 0 });

  const portraitPhone = Platform.OS === 'web' && height > width && width < 700;
  if (portraitPhone) return <RotateGate />;

  const feedback =
    game.phase === 'correct' ? 'Correct' : game.wrongPick !== null ? 'Wrong' : ' ';
  const feedbackColor = game.phase === 'correct' ? color.correct : color.wrong;

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.title}>Diesis</Text>
        <Text style={styles.score} accessibilityLiveRegion="polite">
          {game.correctCount} right · {game.wrongCount} wrong
        </Text>
      </View>

      <View
        style={styles.board}
        onLayout={(e) => setBoardSize({ width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height })}
      >
        {boardSize.width > 0 ? (
          <Fretboard
            width={boardSize.width}
            height={boardSize.height}
            minFret={DEFAULT_SETTINGS.minFret}
            maxFret={DEFAULT_SETTINGS.maxFret}
            highlight={game.question?.position ?? null}
            highlightState={game.phase === 'correct' ? 'correct' : 'asking'}
            highlightLabel={game.phase === 'correct' && game.question ? noteName(game.question.answer) : undefined}
          />
        ) : null}
        {game.phase === 'idle' ? (
          <Pressable style={styles.startOverlay} onPress={() => void game.start()} accessibilityRole="button">
            <View style={styles.startButton}>
              <Text style={styles.startText}>Tap to start</Text>
              <Text style={styles.startSub}>A note lights up and plays. Name it.</Text>
            </View>
          </Pressable>
        ) : null}
      </View>

      <View style={styles.feedbackRow}>
        <Text style={[styles.feedback, { color: feedbackColor }]} accessibilityLiveRegion="assertive">
          {feedback}
        </Text>
        {game.phase !== 'idle' ? (
          <Pressable onPress={game.replay} style={styles.replay} accessibilityRole="button" accessibilityLabel="Play the note again">
            <Text style={styles.replayText}>Hear again</Text>
          </Pressable>
        ) : null}
      </View>

      <NotePanel
        onPick={game.pick}
        disabled={game.phase !== 'asking'}
        correctPick={game.phase === 'correct' && game.question ? game.question.answer : null}
        wrongPick={game.wrongPick}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.background },
  header: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space.l,
  },
  title: { ...typeStyle.title, color: color.ink },
  score: { ...typeStyle.score, color: color.muted },
  board: { flex: 1, marginHorizontal: space.m },
  startOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  startButton: {
    backgroundColor: color.accent,
    paddingHorizontal: space.xl,
    paddingVertical: space.l,
    borderRadius: radius.m,
    alignItems: 'center',
  },
  startText: { ...typeStyle.feedback, color: color.background },
  startSub: { ...typeStyle.score, color: color.background, opacity: 0.8, marginTop: space.xs },
  feedbackRow: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.l,
  },
  feedback: { ...typeStyle.feedback, textAlign: 'center' },
  replay: { position: 'absolute', right: space.l, paddingHorizontal: space.m, paddingVertical: space.xs, borderRadius: radius.pill, borderWidth: 1, borderColor: color.border },
  replayText: { ...typeStyle.score, color: color.accentText },
  bottom: { height: space.m },
});
