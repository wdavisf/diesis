import { StatusBar } from 'expo-status-bar';
import * as ScreenOrientation from 'expo-screen-orientation';
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Game } from './src/ui/Game';

export default function App() {
  useEffect(() => {
    if (Platform.OS !== 'web') {
      void ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    }
  }, []);
  return (
    <SafeAreaProvider>
      <StatusBar style="light" hidden />
      <Game />
    </SafeAreaProvider>
  );
}
