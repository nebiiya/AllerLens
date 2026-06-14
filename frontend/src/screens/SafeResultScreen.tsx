/**
 * SafeResultScreen.tsx
 * --------------------
 * Verdict screen shown when NO allergens were detected in the scanned image.
 * Gives the user a clear green "SAFE" confirmation.
 *
 * Design:
 *  - Cream (#F8F4EB) background
 *  - "ANALYSIS" header
 *  - Large green "SAFE" banner
 *  - Green checkmark circle graphic
 *  - "No Allergen Detected" title
 *  - "YOUR FOOD IS SAFE TO CONSUME" subtitle
 *  - "Algorithmic Comparisons" fine-print note
 *  - Teal "Back" button → returns to Home
 *
 * Navigation:
 *  Processing → SafeResult → Home
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Colors from "../theme/colors";
import { RootStackParamList } from "../types";

// ── Props ─────────────────────────────────────────────────────────────────────

type Props = NativeStackScreenProps<RootStackParamList, "SafeResult">;

// ── Component ─────────────────────────────────────────────────────────────────

const SafeResultScreen: React.FC<Props> = ({ navigation, route }) => {
  const { stats } = route.params;

  // Tally up algorithm stats
  let totalBoyer = 0;
  let totalBrute = 0;

  if (typeof stats == "object" && stats !== null) {
    Object.values(stats).forEach((stat: any) => {
      totalBoyer += stat.boyer_comps || 0;
      totalBrute += stat.brute_comps || 0;
    });
  }

  /**
   * "Back" navigates to the root of the stack (Splash → CreateProfile is skipped).
   * We use popToTop() so the stack is reset and the user lands on Home.
   * Adjust this if you want to go back only one screen.
   */
  const handleBack = () => {
    navigation.popToTop();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.cream} />

      <View style={styles.container}>
        {/* ── Section Label ─────────────────────────────────────────────── */}
        <Text style={styles.sectionLabel}>ANALYSIS</Text>

        {/* ── Verdict Banner ────────────────────────────────────────────── */}
        <View style={styles.verdictBanner}>
          <Text style={styles.verdictText}>SAFE</Text>
        </View>

        {/* ── Green Checkmark Graphic ───────────────────────────────────── */}
        <View style={styles.iconCircle}>
          <Text style={styles.iconMark}>✓</Text>
        </View>

        {/* ── Result Messages ───────────────────────────────────────────── */}
        <Text style={styles.resultTitle}>No Allergen Detected</Text>
        <Text style={styles.resultSubtitle}>YOUR FOOD IS SAFE TO CONSUME</Text>

        {/* ── Fine Print ────────────────────────────────────────────────── */}
        <View style={styles.finePrint}>
          <Text style={styles.finePrintTitle}>Algorithmic Comparisons</Text>
          <Text style={styles.finePrintBody}>
            {typeof stats == "string"
              ? stats
              : `Boyer-Moore Total: ${totalBoyer} comparisons\nBrute Force Total: ${totalBrute} comparisons`}
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
      </View>
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
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingTop: 60,
    gap: 18,
  },

  // "ANALYSIS" label
  sectionLabel: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.textMuted,
    letterSpacing: 3,
  },

  // "SAFE" banner
  verdictBanner: {
    backgroundColor: Colors.safe,
    paddingHorizontal: 40,
    paddingVertical: 10,
    borderRadius: 10,
  },
  verdictText: {
    color: Colors.textLight,
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: 4,
  },

  // Checkmark circle
  iconCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: Colors.safe,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
  },
  iconMark: {
    color: Colors.textLight,
    fontSize: 56,
    fontWeight: "700",
    lineHeight: 64,
  },

  // Result messages
  resultTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.dark,
    textAlign: "center",
  },
  resultSubtitle: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.safe,
    textAlign: "center",
    letterSpacing: 0.5,
  },

  // Fine print
  finePrint: {
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 10,
    padding: 14,
    marginTop: 8,
    width: "100%",
  },
  finePrintTitle: {
    fontSize: 13,
    fontWeight: "700",
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
    marginTop: 40,
  },
  backText: {
    color: Colors.textLight,
    fontSize: 16,
    fontWeight: "700",
  },
});

export default SafeResultScreen;
