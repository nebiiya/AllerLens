/**
 * HomeScreen.tsx
 * --------------
 * Main landing screen after onboarding — the hub of the app.
 * Greets the user by name and offers two scan entry points.
 *
 * Design:
 *  - Cream (#F8F4EB) background
 *  - "Hello, [user name]" greeting
 *  - Two teal action cards:
 *      1. "Scan Ingredients List"  — open camera/text scanner
 *      2. "Upload an Image"        — pick from gallery
 *  - Custom BottomTabBar at the bottom
 *
 * Navigation:
 *  EnterName → Home ↔ Camera / Profile
 *
 * Route Params received:
 *  - profile: { name, selectedAllergens }
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
import BottomTabBar from "../components/BottomTabBar";

// ── Props ─────────────────────────────────────────────────────────────────────

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

// ── Component ─────────────────────────────────────────────────────────────────

const HomeScreen: React.FC<Props> = ({ navigation, route }) => {
  const { profile } = route.params;

  /**
   * Navigate to Camera screen, forwarding the user profile so
   * CameraScreen and downstream screens know which allergens to check.
   */
  const goToCamera = () => {
    navigation.navigate("Camera", { profile });
  };

  /**
   * Handle bottom-tab navigation.
   * 'home' is no-op (already here), others navigate to their screens.
   */
  const handleTabPress = (tab: string) => {
    if (tab === "camera") {
      navigation.navigate("Camera", { profile });
    } else if (tab === "profile") {
      navigation.navigate("Profile", { profile });
    }
    // 'home' — already on this screen, do nothing
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.cream} />

      <View style={styles.container}>
        {/* ── Top Bar ──────────────────────────────────────────────────── */}
        <View style={styles.topBar}>
          {/* App wordmark */}
          <Text style={styles.wordmark}>ALLERLENS</Text>

          {/* Profile avatar shortcut */}
          <TouchableOpacity
            style={styles.avatarBtn}
            onPress={() => navigation.navigate("Profile", { profile })}
            accessibilityLabel="View your profile"
          >
            <Text style={styles.avatarInitial}>
              {profile.name.charAt(0).toUpperCase()}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Greeting ─────────────────────────────────────────────────── */}
        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>Hello,</Text>
          <Text style={styles.userName}>{profile.name}</Text>
          <Text style={styles.greetingSubtitle}>
            What would you like to scan today?
          </Text>
        </View>

        {/* ── Action Cards ─────────────────────────────────────────────── */}
        <View style={styles.cardsContainer}>
          {/* Card 1: Scan Ingredients List (camera / text) */}
          <TouchableOpacity
            style={styles.card}
            onPress={goToCamera}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Scan ingredients list"
          >
            <Text style={styles.cardIcon}>📷</Text>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>Scan Ingredients List</Text>
              <Text style={styles.cardDesc}>
                Point your camera at an ingredient label
              </Text>
            </View>
            <Text style={styles.cardArrow}>›</Text>
          </TouchableOpacity>

          {/* Card 2: Upload an Image from gallery */}
          <TouchableOpacity
            style={styles.card}
            onPress={goToCamera} // CameraScreen handles both modes
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Upload an image from gallery"
          >
            <Text style={styles.cardIcon}>🖼️</Text>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>Upload an Image</Text>
              <Text style={styles.cardDesc}>
                Select an image from your device gallery
              </Text>
            </View>
            <Text style={styles.cardArrow}>›</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Bottom Tab Bar ────────────────────────────────────────────── */}
      <BottomTabBar activeTab="home" onTabPress={handleTabPress} />
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
    paddingHorizontal: 24,
    paddingTop: 60,
  },

  // Top bar
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
  },
  wordmark: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.dark,
    letterSpacing: 2,
  },
  avatarBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.teal,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    color: Colors.textLight,
    fontWeight: "700",
    fontSize: 16,
  },

  // Greeting
  greetingContainer: {
    marginBottom: 40,
  },
  greeting: {
    fontSize: 18,
    fontWeight: "400",
    color: Colors.textMuted,
  },
  userName: {
    fontSize: 32,
    fontWeight: "800",
    color: Colors.dark,
    marginBottom: 6,
  },
  greetingSubtitle: {
    fontSize: 15,
    color: Colors.textMuted,
  },

  // Action cards
  cardsContainer: {
    gap: 16,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.teal,
    borderRadius: 16,
    padding: 18,
    gap: 14,
  },
  cardIcon: {
    fontSize: 28,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textLight,
    marginBottom: 3,
  },
  cardDesc: {
    fontSize: 12,
    color: "rgba(255,255,255,0.75)",
  },
  cardArrow: {
    fontSize: 24,
    color: Colors.textLight,
    fontWeight: "300",
  },
});

export default HomeScreen;
