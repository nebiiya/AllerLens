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

import React, { useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Colors from "../theme/colors";
import { RootStackParamList, AllergenId } from "../types";

// ── Props ─────────────────────────────────────────────────────────────────────

type Props = NativeStackScreenProps<RootStackParamList, "Processing">;

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
  const analyzeImage = async (): Promise<{
    detectedAllergens: AllergenId[];
    stats: any;
  }> => {
    try {
      // Create a FormData object (This is how mobile apps send files)
      const formData = new FormData();

      // Format the image properly for Flask server
      const filename = imageUri.split("/").pop() || "photo.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : "image/jpeg";

      formData.append("image", {
        uri: imageUri,
        name: filename,
        type,
      } as any); // 'as any' is needed to satisfy TypeScript for FormData

      // Attach user allergen profile as a  JSON string (like how app.py expects)
      formData.append("allergens", JSON.stringify(profile.selectedAllergens));

      // Send request to backend API
      // REPLACE THIS IP ADDRESS WITH ACTUAL WIFI IPv4 ADDRESS IF EXPO GO ONLY KEEP /SCAN AT END
      const SERVER_URL = "https://womanhood-unread-reflex.ngrok-free.dev/scan";

      const response = await fetch(SERVER_URL, {
        method: "POST",
        body: formData,
      });

      const responseText = await response.text();

      if (!response.ok) {
        // Unpack the hidden Flask error
        let realError = responseText;
        try {
          const parsedError = JSON.parse(responseText);
          realError = parsedError.error || JSON.stringify(parsedError);
        } catch (e) {}

        // Throw it straight to the phone screen
        throw new Error(`Flask says: ${realError}`);
      }

      const data = JSON.parse(responseText);

      // Setup default empty return
      let foundAllergens: AllergenId[] = [];

      // Parse the payload coming back from app.py
      if (data.verdict == "WARNING" && data.matches) {
        // Map through the matches array
        foundAllergens = data.matches.map((item: any) => item.allergen);
      }

      return {
        detectedAllergens: foundAllergens,
        stats: data.stats || "No comparisons available.",
      };
    } catch (error) {
      console.error("Backend Connection Error: ", error);
      // If server crashses or fails to connect, fallback to safe for now
      return { detectedAllergens: [], stats: "Network error occurred." };
    }
  };

  /**
   * Kick off analysis as soon as the screen mounts.
   * navigation.replace() is used so the user can't go back to
   * the spinning loader after seeing their result.
   */
  useEffect(() => {
    let cancelled = false;

    analyzeImage().then(({ detectedAllergens, stats }) => {
      if (cancelled) return;

      if (detectedAllergens.length === 0) {
        navigation.replace("SafeResult", { stats });
      } else {
        navigation.replace("WarningResult", { detectedAllergens, stats });
      }
    });

    // Cleanup flag prevents navigation on an unmounted screen
    return () => {
      cancelled = true;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.dark} />

      <View style={styles.container}>
        {/* Teal spinning indicator */}
        <ActivityIndicator
          size="large"
          color={Colors.teal}
          style={styles.spinner}
        />

        {/* Main processing label */}
        <Text style={styles.title}>Processing</Text>
        <Text style={styles.subtitle}>
          Analyzing ingredient label for allergens...
        </Text>

        {/* Contextual note about what's being checked */}
        <Text style={styles.note}>
          Checking against {profile.selectedAllergens.length} allergen
          {profile.selectedAllergens.length !== 1 ? "s" : ""} in your profile
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
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 16,
  },
  spinner: {
    marginBottom: 12,
    transform: [{ scale: 1.5 }],
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: Colors.textLight,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: "center",
    lineHeight: 22,
  },
  note: {
    marginTop: 8,
    fontSize: 12,
    color: Colors.teal,
    textAlign: "center",
  },
});

export default ProcessingScreen;
