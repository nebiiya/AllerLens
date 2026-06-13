/**
 * ProcessingScreen.tsx
 * --------------------
 * Shown while the app "analyzes" the scanned image for allergens.
 * Displays an animated loading spinner to indicate work in progress.
 *
 * In a production app this screen would send the image to a backend
 * OCR + NLP service. Here we simulate a 2-second analysis delay and
 * randomly generate a result for demonstration purposes.
 *
 * Design:
 *  - Dark (#1E2829) background
 *  - Centered "Processing..." text + teal ActivityIndicator
 *
 * Navigation:
 *  Camera → Processing → SafeResult | WarningResult
 *
 * Route Params received:
 *  - profile  : user's allergen profile
 *  - imageUri : URI of the image to analyze
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Colors from '../theme/colors';
import { RootStackParamList, AllergenId } from '../types';

// ── Props ─────────────────────────────────────────────────────────────────────

type Props = NativeStackScreenProps<RootStackParamList, 'Processing'>;

// ── Component ─────────────────────────────────────────────────────────────────

const ProcessingScreen: React.FC<Props> = ({ navigation, route }) => {
  const { profile, imageUri } = route.params;

  /**
   * Simulated allergen analysis.
   *
   * Replace this function with a real API call, e.g.:
   *   const response = await fetch('https://your-api.com/analyze', {
   *     method: 'POST',
   *     body: formData,        // imageUri uploaded as multipart
   *   });
   *   const { detectedAllergens } = await response.json();
   *
   * The function returns the subset of user allergens detected in the image.
   */
  const analyzeImage = async (): Promise<AllergenId[]> => {
    // Simulate network latency (2 seconds)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    /**
     * DEMO LOGIC: randomly decide if we find allergens.
     * In production, replace with actual OCR + ingredient matching.
     * We only report allergens that the user has flagged in their profile,
     * since those are the ones they care about.
     */
    const shouldWarn = Math.random() > 0.5;

    if (!shouldWarn || profile.selectedAllergens.length === 0) {
      return []; // No relevant allergens found
    }

    // Pick 1–2 random allergens from the user's profile as "detected"
    const shuffled = [...profile.selectedAllergens].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(2, shuffled.length)) as AllergenId[];
  };

  /**
   * Kick off analysis as soon as the screen mounts.
   * navigation.replace() is used so the user can't go back to
   * the spinning loader after seeing their result.
   */
  useEffect(() => {
    let cancelled = false;

    analyzeImage().then((detectedAllergens) => {
      if (cancelled) return;

      if (detectedAllergens.length === 0) {
        navigation.replace('SafeResult');
      } else {
        navigation.replace('WarningResult', { detectedAllergens });
      }
    });

    // Cleanup flag prevents navigation on an unmounted screen
    return () => { cancelled = true; };
  }, []);   // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.dark} />

      <View style={styles.container}>
        {/* Teal spinning indicator */}
        <ActivityIndicator size="large" color={Colors.teal} style={styles.spinner} />

        {/* Main processing label */}
        <Text style={styles.title}>Processing</Text>
        <Text style={styles.subtitle}>
          Analyzing ingredient label for allergens...
        </Text>

        {/* Contextual note about what's being checked */}
        <Text style={styles.note}>
          Checking against {profile.selectedAllergens.length} allergen
          {profile.selectedAllergens.length !== 1 ? 's' : ''} in your profile
        </Text>
      </View>
    </SafeAreaView>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.dark,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 16,
  },
  spinner: {
    marginBottom: 12,
    transform: [{ scale: 1.5 }],
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.textLight,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
  note: {
    marginTop: 8,
    fontSize: 12,
    color: Colors.teal,
    textAlign: 'center',
  },
});

export default ProcessingScreen;
