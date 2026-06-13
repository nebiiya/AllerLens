/**
 * WarningResultScreen.tsx
 * -----------------------
 * Verdict screen shown when allergens WERE detected in the scanned image.
 * Clearly alerts the user with a red "WARNING" result.
 *
 * Design:
 *  - Cream (#F8F4EB) background
 *  - "ANALYSIS" header
 *  - Red "WARNING" banner
 *  - Red exclamation-mark circle graphic
 *  - "ALLERGENS DETECTED!" title in red
 *  - List of detected allergen names
 *  - "Algorithmic Comparisons" fine-print note
 *  - Teal "Back" button → returns to Home
 *
 * Navigation:
 *  Processing → WarningResult → Home
 *
 * Route Params received:
 *  - detectedAllergens: AllergenId[] — allergens found in the scan
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Colors from '../theme/colors';
import { RootStackParamList, ALLERGENS } from '../types';

// ── Props ─────────────────────────────────────────────────────────────────────

type Props = NativeStackScreenProps<RootStackParamList, 'WarningResult'>;

// ── Component ─────────────────────────────────────────────────────────────────

const WarningResultScreen: React.FC<Props> = ({ navigation, route }) => {
  const { detectedAllergens } = route.params;

  /**
   * Resolve allergen IDs to full display objects (emoji + label).
   * We filter from the master list to ensure consistent labeling.
   */
  const detectedAllergenObjects = ALLERGENS.filter((a) =>
    detectedAllergens.includes(a.id),
  );

  /** Navigate back to the top of the stack (Home) */
  const handleBack = () => {
    navigation.popToTop();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.cream} />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Section Label ─────────────────────────────────────────────── */}
        <Text style={styles.sectionLabel}>ANALYSIS</Text>

        {/* ── Verdict Banner ────────────────────────────────────────────── */}
        <View style={styles.verdictBanner}>
          <Text style={styles.verdictText}>WARNING</Text>
        </View>

        {/* ── Red Exclamation Graphic ───────────────────────────────────── */}
        <View style={styles.iconCircle}>
          <Text style={styles.iconMark}>!</Text>
        </View>

        {/* ── Result Messages ───────────────────────────────────────────── */}
        <Text style={styles.resultTitle}>ALLERGENS DETECTED!</Text>
        <Text style={styles.resultSubtitle}>
          The following allergens were found in the ingredient list:
        </Text>

        {/* ── Detected Allergen Chips ───────────────────────────────────── */}
        <View style={styles.allergenChipsContainer}>
          {detectedAllergenObjects.map((allergen) => (
            <View key={allergen.id} style={styles.allergenChip}>
              <Text style={styles.chipEmoji}>{allergen.emoji}</Text>
              <Text style={styles.chipLabel}>{allergen.label}</Text>
            </View>
          ))}
        </View>

        {/* ── Fine Print ────────────────────────────────────────────────── */}
        <View style={styles.finePrint}>
          <Text style={styles.finePrintTitle}>Algorithmic Comparisons</Text>
          <Text style={styles.finePrintBody}>
            Results are based on optical character recognition (OCR) and ingredient
            matching. Do NOT consume this product if you are sensitive to any
            of the flagged allergens.
          </Text>
        </View>

        {/* ── Back Button ───────────────────────────────────────────────── */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Go back to home"
        >
          <Text style={styles.backText}>Back to Home</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  container: {
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 60,
    gap: 18,
  },

  // "ANALYSIS" label
  sectionLabel: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 3,
  },

  // "WARNING" banner
  verdictBanner: {
    backgroundColor: Colors.warning,
    paddingHorizontal: 40,
    paddingVertical: 10,
    borderRadius: 10,
  },
  verdictText: {
    color: Colors.textLight,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 4,
  },

  // Exclamation-mark circle
  iconCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: Colors.warning,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  iconMark: {
    color: Colors.textLight,
    fontSize: 56,
    fontWeight: '700',
    lineHeight: 64,
  },

  // Result messages
  resultTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.warning,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  resultSubtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },

  // Detected allergen chips
  allergenChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    width: '100%',
  },
  allergenChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.warning,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    gap: 6,
  },
  chipEmoji: {
    fontSize: 16,
  },
  chipLabel: {
    color: Colors.textLight,
    fontSize: 13,
    fontWeight: '600',
  },

  // Fine print
  finePrint: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 10,
    padding: 14,
    marginTop: 4,
    width: '100%',
  },
  finePrintTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textMuted,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  finePrintBody: {
    fontSize: 12,
    color: Colors.textMuted,
    lineHeight: 17,
  },

  // Back button
  backButton: {
    backgroundColor: Colors.teal,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 40,
    marginTop: 60,
  },
  backText: {
    color: Colors.textLight,
    fontSize: 16,
    fontWeight: '700',
  },
});

export default WarningResultScreen;
