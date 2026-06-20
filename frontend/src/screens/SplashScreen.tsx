/**
 * SplashScreen.tsx
 * ----------------
 * The app's first screen — an introductory / branding screen.
 * Shown briefly when the app launches before the user is taken to onboarding.
 *
 * Design:
 *  - Cream (#F8F4EB) background
 *  - Centered AllerLens logo (lens icon + wordmark)
 *  - "Know what you consume" tagline
 *  - Auto-advances to CreateProfileScreen after 2 seconds,
 *    or the user can tap anywhere to skip.
 *
 * Navigation:
 *  Splash → CreateProfile
 */

import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Colors from "../theme/colors";
import { RootStackParamList } from "../types";

// ── Props ─────────────────────────────────────────────────────────────────────

type Props = NativeStackScreenProps<RootStackParamList, "Splash">;

// ── Component ─────────────────────────────────────────────────────────────────

const SplashScreen: React.FC<Props> = ({ navigation }) => {
  /**
   * Auto-advance to the next screen after 2 seconds.
   * The timer is cleared when the component unmounts to prevent
   * navigation calls on an unmounted screen.
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("CreateProfile");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  /** Allow the user to tap anywhere to skip the timer and advance immediately */
  const handleSkip = () => {
    navigation.replace("CreateProfile");
  };

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={1}
      onPress={handleSkip}
      accessibilityLabel="AllerLens splash screen, tap to continue"
    >
      {/* Status bar styled for light background */}
      <StatusBar barStyle="dark-content" backgroundColor={Colors.cream} />

      {/* ── Logo Mark ─────────────────────────────────────────────────────── */}
      <View style={styles.logoContainer}>
        {/* Circular lens graphic (SVG-free approximation using border-radius) */}
        <View style={styles.lensOuter}>
          <View style={styles.lensInner} />
          {/* Cross-hairs to suggest a lens / scanner */}
          <View style={styles.crossH} />
          <View style={styles.crossV} />
        </View>

        {/* App name wordmark */}
        <Text style={styles.wordmark}>ALLERLENS</Text>

        {/* Tagline */}
        <Text style={styles.tagline}>Know what you consume</Text>
      </View>

      {/* ── Tap-to-continue hint ──────────────────────────────────────────── */}
      <Text style={styles.hint}>Tap anywhere to continue</Text>
    </TouchableOpacity>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    gap: 12,
  },

  // Lens graphic
  lensOuter: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 4,
    borderColor: Colors.teal,
    alignItems: "center",
    justifyContent: "center",
  },
  lensInner: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    borderWidth: 3,
    borderColor: Colors.teal,
  },
  crossH: {
    position: "absolute",
    width: 90,
    height: 2,
    backgroundColor: Colors.teal,
    opacity: 0.4,
  },
  crossV: {
    position: "absolute",
    width: 2,
    height: 90,
    backgroundColor: Colors.teal,
    opacity: 0.4,
  },

  // Text
  wordmark: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.dark,
    letterSpacing: 4,
  },
  tagline: {
    fontSize: 14,
    color: Colors.textMuted,
    letterSpacing: 1,
  },
  hint: {
    position: "absolute",
    bottom: 40,
    fontSize: 12,
    color: Colors.textMuted,
  },
});

export default SplashScreen;
