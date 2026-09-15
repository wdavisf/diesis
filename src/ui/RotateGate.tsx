import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { color, space, type as typeStyle } from './theme';

/** Shown on the web when a phone is held upright. Native never sees it: the app is locked. */
export function RotateGate() {
  return (
    <View style={styles.root}>
      <Text style={styles.icon}>⟳</Text>
      <Text style={styles.text}>Turn your phone sideways</Text>
      <Text style={styles.sub}>Diesis plays in landscape, like a guitar neck.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.background, alignItems: 'center', justifyContent: 'center', padding: space.xl },
  icon: { fontSize: 48, color: color.accent, marginBottom: space.l },
  text: { ...typeStyle.feedback, color: color.ink, textAlign: 'center' },
  sub: { ...typeStyle.score, color: color.muted, textAlign: 'center', marginTop: space.s },
});
