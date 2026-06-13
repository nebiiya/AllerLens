/**
 * App.tsx
 * -------
 * Root entry point of the AllerLens React Native application.
 *
 * Responsibilities:
 *  1. Wraps the app in GestureHandlerRootView (required by React Navigation's
 *     stack navigator for swipe-back gestures on Android).
 *  2. Renders AppNavigator which owns the full screen routing tree.
 *
 * All navigation logic, screens, and state live inside AppNavigator.
 * This file stays intentionally minimal — it is the Expo entry point and
 * should not contain business logic.
 */

import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    /**
     * GestureHandlerRootView must wrap the entire app for gesture-based
     * navigation (e.g. swipe-to-go-back) to work correctly.
     * flex: 1 ensures it fills the full screen.
     */
    <GestureHandlerRootView style={styles.root}>
      <AppNavigator />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
