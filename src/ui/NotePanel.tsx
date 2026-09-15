import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SHARP_NAMES, type PitchClass } from '../core/notes';
import { color, radius, space, type as typeStyle } from './theme';

export interface NotePanelProps {
  onPick: (pc: PitchClass) => void;
  disabled: boolean;
  /** Button shown green. */
  correctPick: PitchClass | null;
  /** Button shown red. */
  wrongPick: PitchClass | null;
}

const ALL: PitchClass[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

/** One row of the twelve chromatic notes, sharps spelled with ♯. */
export function NotePanel({ onPick, disabled, correctPick, wrongPick }: NotePanelProps) {
  return (
    <View style={styles.row} accessibilityRole="radiogroup">
      {ALL.map((pc) => {
        const state = pc === correctPick ? 'correct' : pc === wrongPick ? 'wrong' : 'idle';
        return (
          <Pressable
            key={pc}
            accessibilityRole="button"
            accessibilityLabel={SHARP_NAMES[pc]}
            disabled={disabled}
            onPress={() => onPick(pc)}
            style={({ pressed }) => [
              styles.button,
              state === 'correct' && styles.correct,
              state === 'wrong' && styles.wrong,
              pressed && state === 'idle' && styles.pressed,
            ]}
          >
            <Text style={styles.label}>{SHARP_NAMES[pc]}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: space.s,
    paddingHorizontal: space.m,
  },
  button: {
    flex: 1,
    height: 56,
    minWidth: 44,
    borderRadius: radius.m,
    backgroundColor: color.surface,
    borderWidth: 1,
    borderColor: color.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { backgroundColor: color.surfaceRaised },
  correct: { backgroundColor: color.correct, borderColor: color.correct },
  wrong: { backgroundColor: color.wrong, borderColor: color.wrong },
  label: { ...typeStyle.noteButton, color: color.ink },
});
